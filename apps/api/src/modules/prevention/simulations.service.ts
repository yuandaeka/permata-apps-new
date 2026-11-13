import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import type { SimulationResponseDto } from './simulations.schema';

export const simulationsService = {
  async list(query: { disasterTypeId?: string; ageGroup?: string; language?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 50);
    const skip = (page - 1) * limit;

    const where: any = { publishedVersionId: { not: null } };
    if (query.disasterTypeId) where.disasterTypeId = query.disasterTypeId;
    if (query.ageGroup) where.targetAgeGroup = query.ageGroup;

    const [scenarios, total] = await Promise.all([
      prisma.simulationScenario.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, title: true, description: true, disasterTypeId: true, targetAgeGroup: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.simulationScenario.count({ where }),
    ]);

    return { scenarios, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async getById(scenarioId: string) {
    const scenario = await prisma.simulationScenario.findFirst({
      where: { id: scenarioId, publishedVersionId: { not: null } },
      include: {
        publishedVersion: {
          include: {
            steps: {
              include: { options: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        disasterType: true,
      },
    });

    if (!scenario) throw new NotFoundError('Simulation scenario', scenarioId);
    return scenario;
  },

  async startAttempt(scenarioId: string, childId: string) {
    const scenario = await prisma.simulationScenario.findFirst({
      where: { id: scenarioId, publishedVersionId: { not: null } },
    });
    if (!scenario) throw new NotFoundError('Simulation scenario', scenarioId);

    const attempt = await prisma.simulationAttempt.create({
      data: {
        childId,
        scenarioId,
        scenarioVersionId: scenario.publishedVersionId!,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return attempt;
  },

  async saveResponse(attemptId: string, dto: SimulationResponseDto, childId: string) {
    const attempt = await prisma.simulationAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new NotFoundError('Simulation attempt', attemptId);
    if (attempt.childId !== childId) throw new ForbiddenError('Not your attempt');
    if (attempt.status !== 'IN_PROGRESS') throw new ForbiddenError('Attempt is not in progress');

    const option = await prisma.scenarioOption.findUnique({ where: { id: dto.selectedOptionId } });
    if (!option) throw new NotFoundError('Scenario option', dto.selectedOptionId);

    const response = await prisma.simulationResponse.upsert({
      where: { attemptId_stepId: { attemptId, stepId: dto.stepId } },
      create: {
        attemptId,
        stepId: dto.stepId,
        selectedOptionId: dto.selectedOptionId,
        timeSpentSeconds: dto.timeSpentSeconds,
      },
      update: { selectedOptionId: dto.selectedOptionId, timeSpentSeconds: dto.timeSpentSeconds },
    });

    return { response, isRecommended: option.isRecommended, explanation: option.explanation };
  },

  async completeAttempt(attemptId: string, childId: string) {
    const attempt = await prisma.simulationAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: { include: { selectedOption: true } },
      },
    });
    if (!attempt) throw new NotFoundError('Simulation attempt', attemptId);
    if (attempt.childId !== childId) throw new ForbiddenError('Not your attempt');

    const correctCount = attempt.responses.filter(r => r.selectedOption?.isRecommended).length;
    const totalCount = attempt.responses.length;

    const updated = await prisma.simulationAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        correctResponses: correctCount,
        totalResponses: totalCount,
      },
    });

    // Scores are for learning feedback, not permanent labeling
    return { attempt: updated, correctResponses: correctCount, totalResponses: totalCount };
  },

  async getHistory(childId: string, requesterId: string, requesterRoles: string[]) {
    const isOwner = childId === requesterId;
    const isAdmin = requesterRoles.some(r => ['SUPER_ADMIN', 'PROGRAM_MANAGER', 'TEACHER_COUNSELOR'].includes(r));
    if (!isOwner && !isAdmin) throw new ForbiddenError('Access denied');

    return prisma.simulationAttempt.findMany({
      where: { childId },
      include: { scenario: { select: { title: true, disasterTypeId: true } } },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  },
};
