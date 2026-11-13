import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import type { CreateOrganizationDto, UpdateOrganizationDto, AddMemberDto } from './organizations.schema';
import { auditService } from '../audit/audit.service';

export const organizationsService = {
  async create(dto: CreateOrganizationDto, creatorId: string) {
    const org = await prisma.organization.create({
      data: { ...dto, status: 'ACTIVE', createdByUserId: creatorId },
    });

    // Auto-add creator as OWNER
    await prisma.organizationMember.create({
      data: { organizationId: org.id, userId: creatorId, role: 'OWNER', status: 'ACTIVE' },
    });

    await auditService.log({
      actorId: creatorId, action: 'ORGANIZATION_CREATE', resourceType: 'Organization', resourceId: org.id,
    });

    return org;
  },

  async getById(orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId }, include: { region: true } });
    if (!org) throw new NotFoundError('Organization', orgId);
    return org;
  },

  async update(orgId: string, dto: UpdateOrganizationDto, requesterId: string, roles: string[]) {
    await this.assertIsOrgAdmin(orgId, requesterId, roles);
    const org = await prisma.organization.update({ where: { id: orgId }, data: dto });
    await auditService.log({ actorId: requesterId, action: 'ORGANIZATION_UPDATE', resourceType: 'Organization', resourceId: orgId });
    return org;
  },

  async addMember(orgId: string, dto: AddMemberDto, requesterId: string, roles: string[]) {
    await this.assertIsOrgAdmin(orgId, requesterId, roles);
    const memberRole = (['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'].includes(dto.roleCode) ? dto.roleCode : 'MEMBER') as any;

    const member = await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: orgId, userId: dto.userId } },
      create: { organizationId: orgId, userId: dto.userId, role: memberRole, status: 'ACTIVE' },
      update: { role: memberRole, status: 'ACTIVE' },
    });

    await auditService.log({
      actorId: requesterId, action: 'ORGANIZATION_MEMBER_ADD', resourceType: 'OrganizationMember',
      resourceId: member.id, organizationId: orgId, metadata: { addedUserId: dto.userId },
    });

    return member;
  },

  async getMembers(orgId: string, requesterId: string, roles: string[]) {
    await this.assertCanViewOrg(orgId, requesterId, roles);
    return prisma.organizationMember.findMany({
      where: { organizationId: orgId, status: 'ACTIVE' },
      include: { user: { include: { profile: true } } },
    });
  },

  async assertIsOrgAdmin(orgId: string, userId: string, roles: string[]) {
    if (roles.includes('SUPER_ADMIN')) return;
    const member = await prisma.organizationMember.findFirst({
      where: { organizationId: orgId, userId, status: 'ACTIVE' },
    });
    if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
      throw new ForbiddenError('Not authorized to manage this organization');
    }
  },

  async assertCanViewOrg(orgId: string, userId: string, roles: string[]) {
    if (roles.includes('SUPER_ADMIN') || roles.includes('PROGRAM_MANAGER')) return;
    const member = await prisma.organizationMember.findFirst({
      where: { organizationId: orgId, userId, status: 'ACTIVE' },
    });
    if (!member) throw new ForbiddenError('Not a member of this organization');
  },
};
