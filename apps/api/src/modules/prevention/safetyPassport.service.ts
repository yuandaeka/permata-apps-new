import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { childrenService } from '../children/children.service';
import { auditService } from '../audit/audit.service';

export const safetyPassportService = {
  async get(childId: string, requesterId: string, requesterRoles: string[]) {
    await childrenService.assertCanAccessChild(childId, requesterId, requesterRoles);

    const passport = await prisma.safetyPassport.findUnique({
      where: { childId },
      include: {
        contacts: true,
        familyMembers: true,
        meetingPoints: true,
        emergencyNeeds: true,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'SAFETY_PASSPORT_READ',
      resourceType: 'SafetyPassport',
      resourceId: passport?.id ?? childId,
      metadata: { childId },
    });

    return passport;
  },

  async upsert(childId: string, data: any, requesterId: string, requesterRoles: string[]) {
    await childrenService.assertCanAccessChild(childId, requesterId, requesterRoles);

    const passport = await prisma.safetyPassport.upsert({
      where: { childId },
      create: { childId, ...data },
      update: { ...data, updatedAt: new Date() },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'SAFETY_PASSPORT_UPDATE',
      resourceType: 'SafetyPassport',
      resourceId: passport.id,
      metadata: { childId },
    });

    return passport;
  },
};
