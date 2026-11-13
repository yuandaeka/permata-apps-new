import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { errorHandlerMiddleware } from '../src/middlewares/errorHandler.middleware';
import { validate } from '../src/middlewares/validate.middleware';
import { authenticate, requireRoles } from '../src/middlewares/auth.middleware';
import { requestIdMiddleware } from '../src/middlewares/requestId.middleware';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../src/common/errors';
import { env } from '../src/config/env';

function createMockReqRes(options: {
  headers?: Record<string, string>;
  body?: unknown;
  params?: unknown;
  query?: unknown;
  user?: any;
} = {}) {
  const req: any = {
    headers: options.headers ?? {},
    body: options.body ?? {},
    params: options.params ?? {},
    query: options.query ?? {},
    user: options.user,
  };

  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    status: vi.fn(function (code: number) {
      res.statusCode = code;
      return res;
    }),
    json: vi.fn(function (data: any) {
      res.body = data;
      return res;
    }),
    setHeader: vi.fn(function (name: string, value: string) {
      res.headers[name.toLowerCase()] = value;
      return res;
    }),
  };

  const next = vi.fn();

  return { req, res, next };
}

describe('Middleware Suite (FND-01..03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('errorHandlerMiddleware', () => {
    it('formats AppError with correct status code, code, and message', () => {
      const { req, res, next } = createMockReqRes();
      const error = new NotFoundError('ChildProfile', 'child-123');

      errorHandlerMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'ChildProfile with id child-123 not found',
          }),
        })
      );
    });

    it('formats ZodError into structured validation error envelope with 400 status', () => {
      const { req, res, next } = createMockReqRes();
      const schema = z.object({ email: z.string().email(), age: z.number().min(0) });
      const parseResult = schema.safeParse({ email: 'invalid-email', age: -5 });
      if (parseResult.success) throw new Error('Expected validation failure');

      errorHandlerMiddleware(parseResult.error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: expect.objectContaining({
              email: expect.any(Array),
              age: expect.any(Array),
            }),
          }),
        })
      );
    });

    it('handles unexpected errors gracefully with 500 status', () => {
      const { req, res, next } = createMockReqRes();
      const rawError = new Error('Database connection timeout');

      errorHandlerMiddleware(rawError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
          }),
        })
      );
    });
  });

  describe('validate middleware', () => {
    const testSchema = z.object({
      username: z.string().min(3),
      score: z.number().int(),
    });

    it('calls next() when input passes schema validation and parses transformed data', () => {
      const { req, res, next } = createMockReqRes({
        body: { username: 'gemini', score: 100 },
      });

      const middleware = validate(testSchema, 'body');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body).toEqual({ username: 'gemini', score: 100 });
    });

    it('returns 400 VALIDATION_ERROR when input fails schema validation', () => {
      const { req, res, next } = createMockReqRes({
        body: { username: 'ab' }, // too short, score missing
      });

      const middleware = validate(testSchema, 'body');
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
          }),
        })
      );
    });
  });

  describe('authenticate and requireRoles middlewares', () => {
    it('rejects requests without Authorization Bearer header with 401', () => {
      const { req, res, next } = createMockReqRes();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('rejects invalid or tampered JWT token with 401', () => {
      const { req, res, next } = createMockReqRes({
        headers: { authorization: 'Bearer invalid.jwt.signature' },
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('attaches user payload to req when JWT is valid', () => {
      const validPayload = {
        id: 'user-valid-1',
        email: 'test@example.com',
        roles: ['CHILD'],
        organizationIds: ['org-1'],
      };

      const token = jwt.sign(validPayload, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

      const { req, res, next } = createMockReqRes({
        headers: { authorization: `Bearer ${token}` },
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-valid-1');
      expect(req.user.roles).toContain('CHILD');
    });

    it('requireRoles allows user with matching role', () => {
      const { req, res, next } = createMockReqRes({
        user: { id: 'u1', roles: ['PROGRAM_MANAGER', 'VOLUNTEER'] },
      });

      const roleCheck = requireRoles('PROGRAM_MANAGER', 'SUPER_ADMIN');
      roleCheck(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('requireRoles passes ForbiddenError (403) when user lacks required role', () => {
      const { req, res, next } = createMockReqRes({
        user: { id: 'u2', roles: ['VOLUNTEER'] },
      });

      const roleCheck = requireRoles('SUPER_ADMIN');
      roleCheck(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('requestIdMiddleware', () => {
    it('sets X-Request-ID response header and assigns requestId to request object', () => {
      const { req, res, next } = createMockReqRes();

      requestIdMiddleware(req, res, next);

      expect(req.requestId).toBeDefined();
      expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', req.requestId);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('propagates incoming X-Request-ID if provided by client', () => {
      const incomingId = 'client-custom-req-id-1234';
      const { req, res, next } = createMockReqRes({
        headers: { 'x-request-id': incomingId },
      });

      requestIdMiddleware(req, res, next);

      expect(req.requestId).toBe(incomingId);
      expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', incomingId);
    });
  });
});

