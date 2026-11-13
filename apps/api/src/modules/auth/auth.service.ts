import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../common/errors';
import type { RegisterDto, LoginDto, RefreshTokenDto } from './auth.schema';
import type { AuthenticatedUser } from '../../common/types';
import { auditService } from '../audit/audit.service';

export const authService = {
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      // Generic message to avoid email enumeration
      throw new ConflictError('Account already exists');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          status: 'ACTIVE',
          profile: {
            create: {
              fullName: dto.fullName,
              preferredLanguage: dto.preferredLanguage,
            },
          },
        },
        include: { profile: true },
      });

      if (dto.roleCode) {
        const role = await tx.role.findUnique({ where: { code: dto.roleCode } });
        if (role) {
          await tx.userRole.create({ data: { userId: newUser.id, roleId: role.id } });
        }
      } else {
        // Default role: CHILD
        const childRole = await tx.role.findUnique({ where: { code: 'CHILD' } });
        if (childRole) {
          await tx.userRole.create({ data: { userId: newUser.id, roleId: childRole.id } });
        }
      }

      return newUser;
    });

    await auditService.log({
      actorId: user.id,
      action: 'USER_REGISTER',
      resourceType: 'User',
      resourceId: user.id,
    });

    const tokens = await this.generateTokens(user.id, user.email!);
    return { user: { id: user.id, email: user.email, fullName: user.profile?.fullName }, ...tokens };
  },

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        profile: true,
        roles: { include: { role: true } },
      },
    });

    // Constant-time check to prevent timing attacks
    if (!user || !user.passwordHash) {
      await argon2.hash('dummy-password-to-prevent-timing-attack');
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await auditService.log({
      actorId: user.id,
      action: 'USER_LOGIN',
      resourceType: 'User',
      resourceId: user.id,
    });

    const tokens = await this.generateTokens(user.id, user.email ?? '');
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        roles: user.roles.map((ur: any) => ur.role.code),
      },
      ...tokens,
    };
  },

  async refresh(dto: RefreshTokenDto) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: { include: { roles: { include: { role: true } } } } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (stored.user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    // Rotate: revoke old, issue new
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(stored.user.id, stored.user.email ?? '');
    return tokens;
  },

  async logout(refreshToken: string, actorId: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, userId: actorId },
      data: { revokedAt: new Date() },
    });

    await auditService.log({
      actorId,
      action: 'USER_LOGOUT',
      resourceType: 'User',
      resourceId: actorId,
    });
  },

  async generateTokens(userId: string, email: string) {
    const userWithRoles = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        organizationMembers: { where: { status: 'ACTIVE' }, select: { organizationId: true } },
      },
    });

    const payload: AuthenticatedUser = {
      id: userId,
      email,
      roles: userWithRoles?.roles.map((ur: any) => ur.role.code) ?? [],
      organizationIds: userWithRoles?.organizationMembers.map((m: any) => m.organizationId) ?? [],
    };

    const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_TTL as any,
    });

    const refreshTokenValue = uuidv4();
    const refreshTtlMs = parseTtlToMs(env.REFRESH_TOKEN_TTL);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt: new Date(Date.now() + refreshTtlMs),
      },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  },
};

function parseTtlToMs(ttl: string): number {
  const unit = ttl.slice(-1);
  const value = parseInt(ttl.slice(0, -1), 10);
  const units: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (units[unit] ?? 1000);
}
