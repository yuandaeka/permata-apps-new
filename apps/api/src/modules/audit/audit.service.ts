import { prisma } from '../../config/database';
import { logger } from '../../config/logger';

interface AuditLogParams {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  organizationId?: string;
  requestId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export const auditService = {
  async log(params: AuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId,
          organizationId: params.organizationId,
          requestId: params.requestId,
          reason: params.reason,
          metadata: params.metadata as any,
        },
      });
    } catch (err) {
      // Audit log failure must not crash the main operation
      logger.error('Failed to write audit log', { error: err, params: { action: params.action, resourceType: params.resourceType } });
    }
  },
};
