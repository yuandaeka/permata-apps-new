import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthenticatedUser } from '../common/types';
import { UnauthorizedError, ForbiddenError } from '../common/errors';
import { env } from '../config/env';

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AuthenticatedUser & {
      iat: number;
      exp: number;
    };
    req.user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
      organizationIds: payload.organizationIds,
    };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    const hasRole = roles.some((role) => req.user!.roles.includes(role));
    if (!hasRole) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AuthenticatedUser & {
      iat: number;
      exp: number;
    };
    req.user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
      organizationIds: payload.organizationIds,
    };
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

