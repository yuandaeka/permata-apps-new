import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';
import type { GrowthAspectType } from '@prisma/client';

export interface CreateGrowthReflectionDto {
  activityId?: string;
  reflectionText?: string;
  rating?: number;
  aspects?: Array<{
    aspectType: GrowthAspectType;
    score?: number;
    notes?: string;
  }>;
}

export const growthService = {
  async list(childId: string, requesterId: string, requesterRoles: string[]) {
    const isOwner = childId === requesterId;
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'PROFESSIONAL', 'TEACHER_COUNSELOR'].includes(r));

    if (!isOwner && !isAuthorized) {
      // Check CareCircle permission
      const membership = await prisma.careCircleMember.findFirst({
        where: { childId, userId: requesterId },
        include: { permissions: true },
      });
      const hasPermission = membership?.permissions.some(p => p.permission === 'VIEW_PROGRESS') || membership?.role === 'ADMIN';
      if (!hasPermission) throw new ForbiddenError('Access to child growth reflections is restricted');
    }

    const reflections = await prisma.growthReflection.findMany({
      where: { childId },
      include: {
        activity: true,
        aspects: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    return reflections;
  },

  async create(childId: string, dto: CreateGrowthReflectionDto, requesterId: string) {
    if (childId !== requesterId) {
      const child = await prisma.childProfile.findUnique({ where: { id: childId } });
      if (!child || child.createdByUserId !== requesterId) {
        throw new ForbiddenError('Cannot record growth reflection for another user');
      }
    }

    const reflection = await prisma.$transaction(async (tx) => {
      const created = await tx.growthReflection.create({
        data: {
          childId,
          activityId: dto.activityId,
          reflectionText: dto.reflectionText,
          rating: dto.rating,
        },
      });

      if (dto.aspects && dto.aspects.length > 0) {
        for (const aspect of dto.aspects) {
          await tx.growthAspect.create({
            data: {
              reflectionId: created.id,
              aspectType: aspect.aspectType,
              score: aspect.score,
              notes: aspect.notes,
            },
          });
        }
      }

      return created;
    });

    await auditService.log({
      actorId: requesterId,
      action: 'GROWTH_REFLECTION_CREATE',
      resourceType: 'GrowthReflection',
      resourceId: reflection.id,
      metadata: { childId, aspectsCount: dto.aspects?.length ?? 0 },
    });

    return reflection;
  },

  async getSummary(childId: string, requesterId: string, requesterRoles: string[]) {
    const reflections = await this.list(childId, requesterId, requesterRoles);

    // Calculate count per aspect without pass/fail scoring or peer comparison
    const aspectCounts: Record<string, number> = {};
    for (const r of reflections) {
      for (const a of r.aspects) {
        aspectCounts[a.aspectType] = (aspectCounts[a.aspectType] ?? 0) + 1;
      }
    }

    return {
      totalReflections: reflections.length,
      aspectCounts,
      // Garden stage calculated for non-stigmatizing visual feedback
      gardenLevel: Math.min(Math.floor(reflections.length / 3) + 1, 5),
    };
  },
};

