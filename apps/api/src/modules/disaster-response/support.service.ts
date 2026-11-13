import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

export const supportService = {
  async getMaterials(language?: string) {
    return prisma.supportMaterial.findMany({
      where: { isActive: true, ...(language ? { language } : {}) },
      select: { id: true, title: true, type: true, language: true, contentUrl: true, duration: true },
      orderBy: { order: 'asc' },
    });
  },

  async createRequest(data: any, requesterId: string) {
    // Log support requests without automatic diagnosis
    const request = await prisma.supportRequest.create({
      data: {
        childId: requesterId,
        requestType: data.requestType ?? 'EMOTIONAL_SUPPORT',
        notes: data.notes,
        status: 'OPEN',
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'SUPPORT_REQUEST_CREATE',
      resourceType: 'SupportRequest',
      resourceId: request.id,
    });

    return request;
  },

  async assignSupport(requestId: string, assigneeId: string, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER', 'VOLUNTEER', 'PROFESSIONAL'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to assign support');

    const request = await prisma.supportRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError('Support request', requestId);

    const assignment = await prisma.supportAssignment.create({
      data: { supportRequestId: requestId, assignedUserId: assigneeId, assignedByUserId: requesterId, status: 'ACTIVE' },
    });

    await prisma.supportRequest.update({
      where: { id: requestId },
      data: { status: 'ASSIGNED' },
    });

    return assignment;
  },

  async updateStatus(requestId: string, status: string, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER', 'VOLUNTEER', 'PROFESSIONAL'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to update support status');

    const request = await prisma.supportRequest.update({
      where: { id: requestId },
      data: { status: status as any },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'SUPPORT_REQUEST_STATUS_UPDATE',
      resourceType: 'SupportRequest',
      resourceId: requestId,
      metadata: { status },
    });

    return request;
  },
};
