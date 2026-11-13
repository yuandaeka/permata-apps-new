import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recoveryJournalService } from '../src/modules/recovery/recoveryJournal.service';
import { disasterIncidentsService } from '../src/modules/disaster-response/disasterIncidents.service';
import { prisma } from '../src/config/database';
import { ForbiddenError } from '../src/common/errors';

vi.mock('../src/config/database', () => ({
  prisma: {
    recoveryJournalEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    careCircleMember: {
      findFirst: vi.fn(),
    },
    childProfile: {
      findUnique: vi.fn(),
    },
    disasterIncident: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    incidentChildRecord: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    childSafetyStatus: {
      create: vi.fn(),
    },
    childLocationRecord: {
      create: vi.fn(),
    },
    reunificationRequest: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    identityVerification: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

vi.mock('../src/modules/audit/audit.service', () => ({
  auditService: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Permission and Relationship-Based Access Control (FND-02, REC-01, SAFE-01..03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Child Recovery Journal Isolation (REC-01)', () => {
    const childId = 'child-user-001';

    it('allows child to access their own journal entries', async () => {
      const mockEntries = [
        { id: 'entry-1', childId, title: 'Hari yang tenang', privacy: 'PRIVATE' },
        { id: 'entry-2', childId, title: 'Cerita bersama teman', privacy: 'CARE_CIRCLE' },
      ];
      (prisma.recoveryJournalEntry.findMany as any).mockResolvedValue(mockEntries);

      const result = await recoveryJournalService.list(childId, childId, ['CHILD']);
      expect(result).toHaveLength(2);
      expect(prisma.recoveryJournalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { childId, deletedAt: null },
        })
      );
    });

    it('allows SUPER_ADMIN full read access for safeguarding oversight', async () => {
      const mockEntries = [{ id: 'entry-1', childId, privacy: 'PRIVATE' }];
      (prisma.recoveryJournalEntry.findMany as any).mockResolvedValue(mockEntries);

      const result = await recoveryJournalService.list(childId, 'admin-user-id', ['SUPER_ADMIN']);
      expect(result).toBeDefined();
      expect(prisma.careCircleMember.findFirst).not.toHaveBeenCalled();
    });

    it('allows Care Circle member with VIEW_JOURNAL permission to view CARE_CIRCLE entries only', async () => {
      const guardianUserId = 'guardian-user-002';
      (prisma.careCircleMember.findFirst as any).mockResolvedValue({
        id: 'member-1',
        childId,
        userId: guardianUserId,
        role: 'MENTOR',
        permissions: [{ permission: 'VIEW_JOURNAL' }],
      });

      const mockCircleEntries = [
        { id: 'entry-2', childId, title: 'Cerita bersama teman', privacy: 'CARE_CIRCLE' },
      ];
      (prisma.recoveryJournalEntry.findMany as any).mockResolvedValue(mockCircleEntries);

      const result = await recoveryJournalService.list(childId, guardianUserId, ['VOLUNTEER']);
      expect(result).toHaveLength(1);
      expect(prisma.recoveryJournalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { childId, privacy: 'CARE_CIRCLE', deletedAt: null },
        })
      );
    });

    it('rejects access if user is not in Care Circle', async () => {
      (prisma.careCircleMember.findFirst as any).mockResolvedValue(null);

      await expect(
        recoveryJournalService.list(childId, 'stranger-user-id', ['VOLUNTEER'])
      ).rejects.toThrow(ForbiddenError);
    });

    it('rejects access if Care Circle member lacks VIEW_JOURNAL permission', async () => {
      (prisma.careCircleMember.findFirst as any).mockResolvedValue({
        id: 'member-2',
        childId,
        userId: 'companion-user',
        role: 'PEER',
        permissions: [{ permission: 'SEND_MESSAGE' }],
      });

      await expect(
        recoveryJournalService.list(childId, 'companion-user', ['CHILD'])
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Disaster Response SafeConnect Authorization (SAFE-01..03)', () => {
    it('allows AUTHORIZED_OFFICER to register a child during disaster incident', async () => {
      (prisma.disasterIncident.findUnique as any).mockResolvedValue({ id: 'incident-padang' });
      (prisma.incidentChildRecord.create as any).mockResolvedValue({
        id: 'record-1',
        incidentId: 'incident-padang',
        childName: 'Ahmad',
        status: 'REPORTED',
      });

      const result = await disasterIncidentsService.registerChild(
        'incident-padang',
        { childName: 'Ahmad', approximateAge: 9 },
        'officer-bpbd',
        ['AUTHORIZED_OFFICER']
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('record-1');
    });

    it('rejects unauthorized roles from registering children in incident records', async () => {
      await expect(
        disasterIncidentsService.registerChild(
          'incident-padang',
          { childName: 'Ahmad' },
          'volunteer-user',
          ['VOLUNTEER']
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('protects child location updates, requiring AUTHORIZED_OFFICER or SUPER_ADMIN', async () => {
      await expect(
        disasterIncidentsService.updateLocation(
          'record-1',
          { shelterId: 'shelter-a', locationDescription: 'Tenda 4' },
          'public-user',
          ['PARENT_GUARDIAN']
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('allows AUTHORIZED_OFFICER to verify reunification requests', async () => {
      (prisma.reunificationRequest.findUnique as any).mockResolvedValue({
        id: 'req-reunion-1',
        status: 'PENDING',
      });
      (prisma.identityVerification.create as any).mockResolvedValue({
        id: 'verif-1',
        reunificationRequestId: 'req-reunion-1',
        outcome: 'APPROVED',
      });
      (prisma.reunificationRequest.update as any).mockResolvedValue({
        id: 'req-reunion-1',
        status: 'VERIFICATION_APPROVED',
      });

      const result = await disasterIncidentsService.verifyReunification(
        'req-reunion-1',
        { method: 'FAMILY_CARD_CHECK', notes: 'KK verified', outcome: 'APPROVED' },
        'officer-id',
        ['AUTHORIZED_OFFICER']
      );

      expect(result.outcome).toBe('APPROVED');
      expect(prisma.reunificationRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'req-reunion-1' },
          data: { status: 'VERIFICATION_APPROVED' },
        })
      );
    });
  });
});

