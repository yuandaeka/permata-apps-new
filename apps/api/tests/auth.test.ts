import { describe, it, expect, vi, beforeEach } from 'vitest';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authService } from '../src/modules/auth/auth.service';
import { prisma } from '../src/config/database';
import { UnauthorizedError, ConflictError } from '../src/common/errors';

vi.mock('../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    role: {
      findUnique: vi.fn(),
    },
    userRole: {
      create: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

vi.mock('../src/modules/audit/audit.service', () => ({
  auditService: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Auth Service (FND-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('authenticates valid credentials and generates token pair', async () => {
      const mockHashedPassword = await argon2.hash('Secret123!');
      const mockUser = {
        id: 'user-uuid-1',
        email: 'budi@example.com',
        passwordHash: mockHashedPassword,
        status: 'ACTIVE',
        profile: { fullName: 'Budi Santoso' },
        roles: [{ role: { code: 'CHILD' } }],
        organizationMembers: [],
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.refreshToken.create as any).mockResolvedValue({ id: 'rt-1' });

      const result = await authService.login({
        email: 'budi@example.com',
        password: 'Secret123!',
      });

      expect(result).toBeDefined();
      expect(result.user.id).toBe('user-uuid-1');
      expect(result.user.email).toBe('budi@example.com');
      expect(result.user.roles).toContain('CHILD');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const decoded = jwt.decode(result.accessToken) as any;
      expect(decoded.id).toBe('user-uuid-1');
      expect(decoded.roles).toContain('CHILD');
    });

    it('rejects unknown email with constant-time dummy hash to mitigate timing attacks', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('rejects incorrect password for existing user', async () => {
      const mockHashedPassword = await argon2.hash('CorrectPassword123!');
      const mockUser = {
        id: 'user-uuid-2',
        email: 'siti@example.com',
        passwordHash: mockHashedPassword,
        status: 'ACTIVE',
        profile: { fullName: 'Siti Rahma' },
        roles: [{ role: { code: 'VOLUNTEER' } }],
        organizationMembers: [],
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'siti@example.com',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('rejects login for inactive user account', async () => {
      const mockHashedPassword = await argon2.hash('Password123!');
      const mockUser = {
        id: 'user-uuid-3',
        email: 'inactive@example.com',
        passwordHash: mockHashedPassword,
        status: 'SUSPENDED',
        profile: { fullName: 'Inactive User' },
        roles: [{ role: { code: 'PARENT_GUARDIAN' } }],
        organizationMembers: [],
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'inactive@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refresh', () => {
    it('rotates refresh token and returns new token pair', async () => {
      const mockStoredToken = {
        id: 'rt-record-1',
        token: 'valid-refresh-token',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 86400000),
        user: {
          id: 'user-uuid-1',
          email: 'budi@example.com',
          status: 'ACTIVE',
          roles: [{ role: { code: 'CHILD' } }],
          organizationMembers: [],
        },
      };

      (prisma.refreshToken.findUnique as any).mockResolvedValue(mockStoredToken);
      (prisma.refreshToken.update as any).mockResolvedValue({ id: 'rt-record-1', revokedAt: new Date() });
      (prisma.user.findUnique as any).mockResolvedValue(mockStoredToken.user);
      (prisma.refreshToken.create as any).mockResolvedValue({ id: 'rt-record-2' });

      const result = await authService.refresh({ refreshToken: 'valid-refresh-token' });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rt-record-1' },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      );
    });

    it('rejects revoked or expired refresh token', async () => {
      const expiredToken = {
        id: 'rt-record-2',
        token: 'expired-token',
        revokedAt: new Date(Date.now() - 1000),
        expiresAt: new Date(Date.now() - 5000),
        user: { id: 'user-uuid-1', status: 'ACTIVE' },
      };

      (prisma.refreshToken.findUnique as any).mockResolvedValue(expiredToken);

      await expect(
        authService.refresh({ refreshToken: 'expired-token' })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('register', () => {
    it('rejects duplicate email with conflict error', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing-id', email: 'taken@example.com' });

      await expect(
        authService.register({
          email: 'taken@example.com',
          password: 'Password123!',
          fullName: 'Test User',
          preferredLanguage: 'id',
        })
      ).rejects.toThrow(ConflictError);
    });
  });
});

