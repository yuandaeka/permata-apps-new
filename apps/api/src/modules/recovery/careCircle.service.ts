import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError, ConflictError } from '../../common/errors';
import { auditService } from '../audit/audit.service';
import type { CareCircleRole, InvitationStatus } from '@prisma/client';

export interface CreateInvitationDto {
  email?: string;
  phone?: string;
  role?: CareCircleRole;
}

export interface ReferralDto {
  reason: string;
  urgency?: number;
  referredTo?: string;
  organizationId?: string;
  notes?: string;
}

export const careCircleService = {
  async listMembers(childId: string, requesterId: string, requesterRoles: string[]) {
    const isOwner = childId === requesterId;
    const isSuperAdmin = requesterRoles.includes('SUPER_ADMIN');

    if (!isOwner && !isSuperAdmin) {
      const isMember = await prisma.careCircleMember.findFirst({
        where: { childId, userId: requesterId },
      });
      if (!isMember) throw new ForbiddenError('Not a member of this child CareCircle');
    }

    return prisma.careCircleMember.findMany({
      where: { childId },
      include: {
        permissions: true,
      },
    });
  },

  async createInvitation(childId: string, dto: CreateInvitationDto, requesterId: string) {
    const isChild = childId === requesterId;
    const child = await prisma.childProfile.findUnique({ where: { id: childId } });
    if (!isChild && child?.createdByUserId !== requesterId) {
      const membership = await prisma.careCircleMember.findFirst({
        where: { childId, userId: requesterId, role: 'ADMIN' },
      });
      if (!membership) throw new ForbiddenError('Only child, guardian, or CareCircle admin can invite members');
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.careCircleInvitation.create({
      data: {
        childId,
        invitedBy: requesterId,
        email: dto.email,
        phone: dto.phone,
        role: dto.role ?? 'VIEWER',
        token,
        status: 'PENDING',
        expiresAt,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CARECIRCLE_INVITATION_CREATE',
      resourceType: 'CareCircleInvitation',
      resourceId: invitation.id,
      metadata: { childId, role: dto.role ?? 'VIEWER' },
    });

    return invitation;
  },

  async respondInvitation(invitationId: string, status: 'ACCEPTED' | 'REJECTED', requesterId: string) {
    const invitation = await prisma.careCircleInvitation.findUnique({ where: { id: invitationId } });
    if (!invitation) throw new NotFoundError('Invitation', invitationId);

    if (invitation.status !== 'PENDING') {
      throw new ConflictError('Invitation is no longer pending');
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.careCircleInvitation.update({ where: { id: invitationId }, data: { status: 'EXPIRED' } });
      throw new ConflictError('Invitation has expired');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const inv = await tx.careCircleInvitation.update({
        where: { id: invitationId },
        data: { status: status as InvitationStatus },
      });

      if (status === 'ACCEPTED') {
        const member = await tx.careCircleMember.upsert({
          where: { childId_userId: { childId: inv.childId, userId: requesterId } },
          create: {
            childId: inv.childId,
            userId: requesterId,
            role: inv.role,
          },
          update: {
            role: inv.role,
          },
        });

        // Grant default safe permissions based on role
        const defaultPermissions = inv.role === 'ADMIN'
          ? ['VIEW_JOURNAL', 'VIEW_PROGRESS', 'ADD_NOTES', 'VIEW_SAFETY_PASSPORT']
          : ['VIEW_PROGRESS'];

        for (const perm of defaultPermissions) {
          await tx.careCirclePermission.upsert({
            where: { memberId_permission: { memberId: member.id, permission: perm } },
            create: { memberId: member.id, permission: perm },
            update: {},
          });
        }
      }

      return inv;
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CARECIRCLE_INVITATION_RESPOND',
      resourceType: 'CareCircleInvitation',
      resourceId: invitationId,
      metadata: { status },
    });

    return updated;
  },

  async updatePermissions(memberId: string, permissions: string[], requesterId: string, requesterRoles: string[]) {
    const member = await prisma.careCircleMember.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundError('CareCircle member', memberId);

    const isChild = member.childId === requesterId;
    const isSuperAdmin = requesterRoles.includes('SUPER_ADMIN');

    if (!isChild && !isSuperAdmin) {
      const requesterMembership = await prisma.careCircleMember.findFirst({
        where: { childId: member.childId, userId: requesterId, role: 'ADMIN' },
      });
      if (!requesterMembership) throw new ForbiddenError('Not authorized to update permissions');
    }

    // Replace permissions
    await prisma.$transaction(async (tx) => {
      await tx.careCirclePermission.deleteMany({ where: { memberId } });
      for (const perm of permissions) {
        await tx.careCirclePermission.create({
          data: { memberId, permission: perm },
        });
      }
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CARECIRCLE_PERMISSIONS_UPDATE',
      resourceType: 'CareCircleMember',
      resourceId: memberId,
      metadata: { permissions },
    });

    return { memberId, permissions };
  },

  async createReferral(childId: string, dto: ReferralDto, requesterId: string, requesterRoles: string[]) {
    // Only professionals, teachers, or admins can make clinical/support referrals
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'PROFESSIONAL', 'TEACHER_COUNSELOR', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Referrals require certified caregiver or professional role');

    const referral = await prisma.referralCase.create({
      data: {
        childId,
        referredBy: requesterId,
        referredTo: dto.referredTo,
        organizationId: dto.organizationId,
        reason: dto.reason,
        urgency: dto.urgency ?? 2,
        notes: dto.notes,
        status: 'OPEN',
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'REFERRAL_CREATE',
      resourceType: 'ReferralCase',
      resourceId: referral.id,
      metadata: { childId, urgency: dto.urgency ?? 2 },
    });

    return referral;
  },
};

