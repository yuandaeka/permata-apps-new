import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

export interface CreateJournalEntryDto {
  title?: string;
  content?: string;
  mood?: number;
  privacy?: 'PRIVATE' | 'CARE_CIRCLE' | 'PUBLIC';
  activityType?: string;
  tags?: string[];
  mediaAssetIds?: string[];
}

export interface UpdateJournalEntryDto {
  title?: string;
  content?: string;
  mood?: number;
  privacy?: 'PRIVATE' | 'CARE_CIRCLE' | 'PUBLIC';
  activityType?: string;
  tags?: string[];
}

export const recoveryJournalService = {
  async list(childId: string, requesterId: string, requesterRoles: string[]) {
    const isOwner = childId === requesterId;
    const isSuperAdmin = requesterRoles.includes('SUPER_ADMIN');

    if (isOwner || isSuperAdmin) {
      return prisma.recoveryJournalEntry.findMany({
        where: { childId, deletedAt: null },
        include: { media: { include: { asset: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Check if requester is a CareCircle member with VIEW_JOURNAL permission
    const membership = await prisma.careCircleMember.findFirst({
      where: { childId, userId: requesterId },
      include: { permissions: true },
    });

    const hasJournalPermission = membership?.permissions.some(p => p.permission === 'VIEW_JOURNAL') || membership?.role === 'ADMIN';

    if (!hasJournalPermission) {
      throw new ForbiddenError('Access to child recovery journal is restricted');
    }

    return prisma.recoveryJournalEntry.findMany({
      where: { childId, privacy: 'CARE_CIRCLE', deletedAt: null },
      include: { media: { include: { asset: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(childId: string, dto: CreateJournalEntryDto, requesterId: string) {
    if (childId !== requesterId) {
      const child = await prisma.childProfile.findUnique({ where: { id: childId } });
      if (!child || child.createdByUserId !== requesterId) {
        throw new ForbiddenError('Cannot create journal entry for another user');
      }
    }

    const entry = await prisma.$transaction(async (tx) => {
      const created = await tx.recoveryJournalEntry.create({
        data: {
          childId,
          title: dto.title,
          content: dto.content,
          mood: dto.mood,
          privacy: dto.privacy ?? 'PRIVATE',
          activityType: dto.activityType,
          tags: dto.tags ?? [],
        },
      });

      if (dto.mediaAssetIds && dto.mediaAssetIds.length > 0) {
        for (let i = 0; i < dto.mediaAssetIds.length; i++) {
          await tx.journalMedia.create({
            data: {
              entryId: created.id,
              assetId: dto.mediaAssetIds[i],
              orderIndex: i,
            },
          });
        }
      }

      return created;
    });

    await auditService.log({
      actorId: requesterId,
      action: 'JOURNAL_ENTRY_CREATE',
      resourceType: 'RecoveryJournalEntry',
      resourceId: entry.id,
      metadata: { childId, privacy: dto.privacy ?? 'PRIVATE' },
    });

    return entry;
  },

  async update(entryId: string, dto: UpdateJournalEntryDto, requesterId: string) {
    const entry = await prisma.recoveryJournalEntry.findUnique({ where: { id: entryId } });
    if (!entry || entry.deletedAt) throw new NotFoundError('Journal entry', entryId);

    if (entry.childId !== requesterId) {
      throw new ForbiddenError('Only the author can update their journal');
    }

    const updated = await prisma.recoveryJournalEntry.update({
      where: { id: entryId },
      data: dto,
    });

    await auditService.log({
      actorId: requesterId,
      action: 'JOURNAL_ENTRY_UPDATE',
      resourceType: 'RecoveryJournalEntry',
      resourceId: entryId,
    });

    return updated;
  },

  async delete(entryId: string, requesterId: string, requesterRoles: string[]) {
    const entry = await prisma.recoveryJournalEntry.findUnique({ where: { id: entryId } });
    if (!entry || entry.deletedAt) throw new NotFoundError('Journal entry', entryId);

    const isOwner = entry.childId === requesterId;
    const isSuperAdmin = requesterRoles.includes('SUPER_ADMIN');
    if (!isOwner && !isSuperAdmin) throw new ForbiddenError('Not authorized to delete entry');

    await prisma.recoveryJournalEntry.update({
      where: { id: entryId },
      data: { deletedAt: new Date() },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'JOURNAL_ENTRY_DELETE',
      resourceType: 'RecoveryJournalEntry',
      resourceId: entryId,
    });

    return { message: 'Journal entry deleted' };
  },
};

