import { prisma } from '../../config/database';
import { NotFoundError } from '../../common/errors';
import type { UpdateProfileDto } from './users.schema';

export const usersService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: { include: { role: true } },
        organizationMembers: {
          where: { status: 'ACTIVE' },
          include: { organization: true },
        },
      },
    });

    if (!user) throw new NotFoundError('User', userId);

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      profile: user.profile,
      roles: user.roles.map((ur: any) => ({ code: ur.role.code, name: ur.role.name })),
      organizations: user.organizationMembers.map((m: any) => ({
        id: m.organization.id,
        name: m.organization.name,
        type: m.organization.type,
      })),
    };
  },

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) throw new NotFoundError('User', userId);

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: dto.fullName ?? user.profile?.fullName ?? 'User',
        preferredLanguage: dto.preferredLanguage ?? 'id',
      },
      update: dto,
    });

    return profile;
  },
};
