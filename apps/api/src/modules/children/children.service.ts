import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import type { CreateChildDto, UpdateChildDto, GuardianRelationDto, ConsentDto } from './children.schema';
import { auditService } from '../audit/audit.service';

export const childrenService = {
  async create(dto: CreateChildDto, creatorId: string) {
    const child = await prisma.childProfile.create({
      data: {
        displayName: dto.displayName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        ageGroup: dto.ageGroup,
        regionId: dto.regionId,
        preferredLanguage: dto.preferredLanguage,
        createdByUserId: creatorId,
      },
    });

    await auditService.log({
      actorId: creatorId,
      action: 'CHILD_PROFILE_CREATE',
      resourceType: 'ChildProfile',
      resourceId: child.id,
    });

    return child;
  },

  async getById(childId: string, requesterId: string, requesterRoles: string[]) {
    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      include: { region: true },
    });

    if (!child) throw new NotFoundError('Child', childId);

    await this.assertCanAccessChild(childId, requesterId, requesterRoles);
    return child;
  },

  async update(childId: string, dto: UpdateChildDto, requesterId: string, requesterRoles: string[]) {
    await this.assertCanAccessChild(childId, requesterId, requesterRoles);

    const child = await prisma.childProfile.update({
      where: { id: childId },
      data: {
        displayName: dto.displayName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        ageGroup: dto.ageGroup,
        regionId: dto.regionId,
        preferredLanguage: dto.preferredLanguage,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CHILD_PROFILE_UPDATE',
      resourceType: 'ChildProfile',
      resourceId: childId,
    });

    return child;
  },

  async addGuardian(childId: string, dto: GuardianRelationDto, requesterId: string, requesterRoles: string[]) {
    const child = await prisma.childProfile.findUnique({ where: { id: childId } });
    if (!child) throw new NotFoundError('Child', childId);

    if (!requesterRoles.includes('SUPER_ADMIN') && child.createdByUserId !== requesterId) {
      throw new ForbiddenError('Not authorized to add guardian');
    }

    const relation = await prisma.guardianRelationship.create({
      data: {
        childId,
        guardianUserId: dto.guardianUserId,
        relationshipType: dto.relationshipType,
        status: 'PENDING',
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'GUARDIAN_RELATION_CREATE',
      resourceType: 'GuardianRelationship',
      resourceId: relation.id,
      metadata: { childId, guardianUserId: dto.guardianUserId },
    });

    return relation;
  },

  async updateGuardianRelation(
    childId: string,
    relationshipId: string,
    status: string,
    requesterId: string,
    requesterRoles: string[]
  ) {
    const relation = await prisma.guardianRelationship.findFirst({
      where: { id: relationshipId, childId },
    });
    if (!relation) throw new NotFoundError('Guardian relationship', relationshipId);

    // Only the guardian themselves or super admin can verify
    const isGuardian = relation.guardianUserId === requesterId;
    const isAdmin = requesterRoles.includes('SUPER_ADMIN');
    if (!isGuardian && !isAdmin) throw new ForbiddenError('Cannot update this relationship');

    const updated = await prisma.guardianRelationship.update({
      where: { id: relationshipId },
      data: {
        status: status as any,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'GUARDIAN_RELATION_UPDATE',
      resourceType: 'GuardianRelationship',
      resourceId: relationshipId,
      metadata: { status },
    });

    return updated;
  },

  async recordConsent(childId: string, dto: ConsentDto, requesterId: string) {
    const consent = await prisma.consentRecord.create({
      data: {
        childId,
        guardianUserId: requesterId,
        consentType: dto.consentType,
        status: dto.status,
        policyVersion: dto.policyVersion,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CONSENT_RECORD',
      resourceType: 'ConsentRecord',
      resourceId: consent.id,
      metadata: { childId, consentType: dto.consentType, status: dto.status },
    });

    return consent;
  },

  async getConsents(childId: string, requesterId: string, requesterRoles: string[]) {
    await this.assertCanAccessChild(childId, requesterId, requesterRoles);
    return prisma.consentRecord.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async assertCanAccessChild(childId: string, userId: string, roles: string[]): Promise<void> {
    if (roles.includes('SUPER_ADMIN')) return;

    // Check if user is the child profile owner, verified guardian, or assigned caregiver
    const [guardianRelation, careAssignment] = await Promise.all([
      prisma.guardianRelationship.findFirst({
        where: { childId, guardianUserId: userId, status: 'VERIFIED' },
      }),
      prisma.careAssignment.findFirst({
        where: { childId, userId, status: 'ACTIVE' },
      }),
    ]);

    const child = await prisma.childProfile.findUnique({ where: { id: childId } });

    if (!child) throw new NotFoundError('Child', childId);
    if (child.createdByUserId === userId) return;
    if (guardianRelation) return;
    if (careAssignment) return;

    throw new ForbiddenError('Access to this child profile is not authorized');
  },
};
