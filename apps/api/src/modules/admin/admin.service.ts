import { prisma } from '../../config/database';
import { auditService } from '../audit/audit.service';

export const adminService = {
  // Content Admin
  async listContent(query: { page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        skip,
        take: limit,
        include: { disasterType: true, translations: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.contentItem.count(),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async createContent(data: any, adminId: string) {
    const item = await prisma.contentItem.create({
      data: {
        slug: data.slug,
        type: data.type,
        status: data.status ?? 'DRAFT',
        disasterTypeId: data.disasterTypeId,
        targetAgeMin: data.targetAgeMin,
        targetAgeMax: data.targetAgeMax,
        authorId: adminId,
        translations: data.translations ? { create: data.translations } : undefined,
      },
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_CONTENT_CREATE',
      resourceType: 'ContentItem',
      resourceId: item.id,
    });

    return item;
  },

  async updateContent(id: string, data: any, adminId: string) {
    const item = await prisma.contentItem.update({
      where: { id },
      data,
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_CONTENT_UPDATE',
      resourceType: 'ContentItem',
      resourceId: id,
    });

    return item;
  },

  // Simulations Admin
  async createSimulationScenario(data: any, adminId: string) {
    const scenario = await prisma.simulationScenario.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty ?? 'BEGINNER',
        disasterTypeId: data.disasterTypeId,
        targetAgeGroup: data.targetAgeGroup,
        targetAgeMin: data.targetAgeMin,
        targetAgeMax: data.targetAgeMax,
        isPublished: data.isPublished ?? false,
        createdBy: adminId,
      },
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_SIMULATION_CREATE',
      resourceType: 'SimulationScenario',
      resourceId: scenario.id,
    });

    return scenario;
  },

  async updateSimulationScenario(id: string, data: any, adminId: string) {
    const scenario = await prisma.simulationScenario.update({
      where: { id },
      data,
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_SIMULATION_UPDATE',
      resourceType: 'SimulationScenario',
      resourceId: id,
    });

    return scenario;
  },

  // Assessments Admin
  async createAssessment(data: any, adminId: string) {
    const assessment = await prisma.assessment.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type ?? 'RESILIENCE',
        targetAgeGroup: data.targetAgeGroup,
        estimatedMinutes: data.estimatedMinutes,
        isActive: data.isActive ?? true,
        createdBy: adminId,
      },
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_ASSESSMENT_CREATE',
      resourceType: 'Assessment',
      resourceId: assessment.id,
    });

    return assessment;
  },

  async updateAssessment(id: string, data: any, adminId: string) {
    const assessment = await prisma.assessment.update({
      where: { id },
      data,
    });

    await auditService.log({
      actorId: adminId,
      action: 'ADMIN_ASSESSMENT_UPDATE',
      resourceType: 'Assessment',
      resourceId: id,
    });

    return assessment;
  },
};

