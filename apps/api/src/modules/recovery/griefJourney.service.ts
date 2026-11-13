import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

export interface EmotionCheckInDto {
  emotion: string;
  intensity: number;
  context?: string;
}

export interface MemoryBoxDto {
  title: string;
  description?: string;
  assetId?: string;
  memoryDate?: string;
}

export interface LittleStepDto {
  title: string;
  description?: string;
  targetDate?: string;
}

export const griefJourneyService = {
  async getActivities() {
    // 5 non-linear aspects: Denial, Anger, Bargaining, Depression, Acceptance
    return [
      {
        aspect: 'UNDERSTANDING_LOSS',
        label: 'Understanding the Loss',
        description: 'Safe gentle ways to acknowledge what has happened without feeling overwhelmed.',
        activityTypes: ['MEMORY_SHARING', 'STORY_READING'],
      },
      {
        aspect: 'EXPRESSING_FEELINGS',
        label: 'Expressing Feelings',
        description: 'Creative and physical outlets for big emotions including anger and frustration.',
        activityTypes: ['EMOTION_DRAWING', 'BREATHING', 'MOVEMENT'],
      },
      {
        aspect: 'UNDERSTANDING_EVENTS',
        label: 'Understanding What Happened',
        description: 'Learning that big changes and disasters are not the child fault.',
        activityTypes: ['GUIDED_TALK', 'COMFORT_ROUTINE'],
      },
      {
        aspect: 'PROCESSING_SADNESS',
        label: 'Processing Sadness',
        description: 'Honoring memories and treasuring what remains important.',
        activityTypes: ['MEMORY_BOX', 'LETTER_WRITING'],
      },
      {
        aspect: 'MOVING_FORWARD',
        label: 'Moving Forward',
        description: 'Small daily steps toward hope and routine, without pressure to feel okay immediately.',
        activityTypes: ['LITTLE_STEPS', 'CONNECTING_WITH_OTHERS'],
      },
    ];
  },

  async recordEmotionCheckIn(childId: string, dto: EmotionCheckInDto, requesterId: string) {
    if (childId !== requesterId) {
      const child = await prisma.childProfile.findUnique({ where: { id: childId } });
      if (!child || child.createdByUserId !== requesterId) {
        throw new ForbiddenError('Cannot record emotion check-in for another user');
      }
    }

    const checkIn = await prisma.emotionCheckIn.create({
      data: {
        childId,
        emotion: dto.emotion,
        intensity: Math.min(Math.max(dto.intensity, 1), 5),
        context: dto.context,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'EMOTION_CHECKIN_CREATE',
      resourceType: 'EmotionCheckIn',
      resourceId: checkIn.id,
      metadata: { childId, emotion: dto.emotion },
    });

    return checkIn;
  },

  async createMemoryBoxEntry(childId: string, dto: MemoryBoxDto, requesterId: string) {
    if (childId !== requesterId) {
      const child = await prisma.childProfile.findUnique({ where: { id: childId } });
      if (!child || child.createdByUserId !== requesterId) {
        throw new ForbiddenError('Cannot add to memory box for another user');
      }
    }

    const memory = await prisma.memoryBoxEntry.create({
      data: {
        childId,
        title: dto.title,
        description: dto.description,
        assetId: dto.assetId,
        memoryDate: dto.memoryDate ? new Date(dto.memoryDate) : undefined,
      },
      include: { asset: true },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'MEMORY_BOX_CREATE',
      resourceType: 'MemoryBoxEntry',
      resourceId: memory.id,
      metadata: { childId },
    });

    return memory;
  },

  async getMemoryBox(childId: string, requesterId: string, requesterRoles: string[]) {
    const isOwner = childId === requesterId;
    const isSuperAdmin = requesterRoles.includes('SUPER_ADMIN');

    if (!isOwner && !isSuperAdmin) {
      const membership = await prisma.careCircleMember.findFirst({
        where: { childId, userId: requesterId },
        include: { permissions: true },
      });
      const hasPermission = membership?.permissions.some(p => p.permission === 'VIEW_JOURNAL');
      if (!hasPermission) throw new ForbiddenError('Memory box is private');
    }

    return prisma.memoryBoxEntry.findMany({
      where: { childId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async createLittleStep(childId: string, dto: LittleStepDto, requesterId: string) {
    if (childId !== requesterId) {
      const child = await prisma.childProfile.findUnique({ where: { id: childId } });
      if (!child || child.createdByUserId !== requesterId) {
        throw new ForbiddenError('Cannot create little step for another user');
      }
    }

    const step = await prisma.littleStep.create({
      data: {
        childId,
        title: dto.title,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'LITTLE_STEP_CREATE',
      resourceType: 'LittleStep',
      resourceId: step.id,
      metadata: { childId },
    });

    return step;
  },

  async completeLittleStep(stepId: string, celebrationNote: string | undefined, requesterId: string) {
    const step = await prisma.littleStep.findUnique({ where: { id: stepId } });
    if (!step) throw new NotFoundError('Little step', stepId);

    const updated = await prisma.littleStep.update({
      where: { id: stepId },
      data: {
        completedAt: new Date(),
        celebrationNote,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'LITTLE_STEP_COMPLETE',
      resourceType: 'LittleStep',
      resourceId: stepId,
    });

    return updated;
  },
};

