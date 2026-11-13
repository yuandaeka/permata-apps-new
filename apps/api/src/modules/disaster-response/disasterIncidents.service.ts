import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

export const disasterIncidentsService = {
  async list(requesterId: string, requesterRoles: string[], organizationId?: string) {
    const isAdmin = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER', 'PROGRAM_MANAGER'].includes(r));
    if (!isAdmin) throw new ForbiddenError('Access denied');

    return prisma.disasterIncident.findMany({
      where: organizationId ? { managingOrganizationId: organizationId } : undefined,
      include: { disasterType: true, managingOrganization: true },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  },

  async create(data: any, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER', 'PROGRAM_MANAGER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to create incident');

    const incident = await prisma.disasterIncident.create({
      data: {
        ...data,
        status: 'ACTIVE',
        createdByUserId: requesterId,
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'INCIDENT_CREATE',
      resourceType: 'DisasterIncident',
      resourceId: incident.id,
    });

    return incident;
  },

  async registerChild(incidentId: string, childData: any, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Only authorized officers can register children to incidents');

    const incident = await prisma.disasterIncident.findUnique({ where: { id: incidentId } });
    if (!incident) throw new NotFoundError('Incident', incidentId);

    const record = await prisma.incidentChildRecord.create({
      data: { incidentId, ...childData, status: 'REPORTED', registeredByUserId: requesterId },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'INCIDENT_CHILD_REGISTER',
      resourceType: 'IncidentChildRecord',
      resourceId: record.id,
      metadata: { incidentId },
    });

    return record;
  },

  async updateStatus(recordId: string, status: string, notes: string | undefined, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to update status');

    const record = await prisma.incidentChildRecord.findUnique({ where: { id: recordId } });
    if (!record) throw new NotFoundError('Record', recordId);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.childSafetyStatus.create({
        data: {
          incidentChildRecordId: recordId,
          status,
          notes,
          recordedByUserId: requesterId,
        },
      });

      return tx.incidentChildRecord.update({
        where: { id: recordId },
        data: { status: status as any },
      });
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CHILD_SAFETY_STATUS_UPDATE',
      resourceType: 'IncidentChildRecord',
      resourceId: recordId,
      metadata: { status, notes },
    });

    return updated;
  },

  async updateLocation(recordId: string, locationData: any, requesterId: string, requesterRoles: string[]) {
    // Location data is highly sensitive: authorized officers only, always audited
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Location access requires authorized officer role');

    const record = await prisma.incidentChildRecord.findUnique({ where: { id: recordId } });
    if (!record) throw new NotFoundError('Record', recordId);

    const locationRecord = await prisma.childLocationRecord.create({
      data: {
        incidentChildRecordId: recordId,
        shelterId: locationData.shelterId,
        locationDescription: locationData.locationDescription,
        recordedByUserId: requesterId,
        accessLevel: 'RESTRICTED',
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'CHILD_LOCATION_UPDATE',
      resourceType: 'ChildLocationRecord',
      resourceId: locationRecord.id,
      metadata: { recordId, reason: locationData.reason },
    });

    return locationRecord;
  },

  async createReunificationRequest(recordId: string, data: any, requesterId: string) {
    const record = await prisma.incidentChildRecord.findUnique({ where: { id: recordId } });
    if (!record) throw new NotFoundError('Record', recordId);

    const request = await prisma.reunificationRequest.create({
      data: {
        incidentChildRecordId: recordId,
        requestedByUserId: requesterId,
        claimantName: data.claimantName,
        claimantRelationship: data.claimantRelationship,
        claimantContact: data.claimantContact,
        status: 'PENDING',
      },
    });

    await auditService.log({
      actorId: requesterId,
      action: 'REUNIFICATION_REQUEST_CREATE',
      resourceType: 'ReunificationRequest',
      resourceId: request.id,
      metadata: { recordId },
    });

    return request;
  },

  async verifyReunification(requestId: string, verificationData: any, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to verify reunification');

    const request = await prisma.reunificationRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError('Reunification request', requestId);

    const verification = await prisma.identityVerification.create({
      data: {
        reunificationRequestId: requestId,
        verifiedByUserId: requesterId,
        verificationMethod: verificationData.method,
        verificationNotes: verificationData.notes,
        outcome: verificationData.outcome,
      },
    });

    if (verificationData.outcome === 'APPROVED') {
      await prisma.reunificationRequest.update({
        where: { id: requestId },
        data: { status: 'VERIFICATION_APPROVED' },
      });
    }

    await auditService.log({
      actorId: requesterId,
      action: 'REUNIFICATION_VERIFY',
      resourceType: 'ReunificationRequest',
      resourceId: requestId,
      metadata: { outcome: verificationData.outcome },
    });

    return verification;
  },

  async completeReunification(requestId: string, handoverData: any, requesterId: string, requesterRoles: string[]) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) throw new ForbiddenError('Not authorized to complete reunification');

    const request = await prisma.reunificationRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError('Reunification request', requestId);

    await prisma.$transaction(async (tx) => {
      await tx.handoverRecord.create({
        data: {
          reunificationRequestId: requestId,
          handedOverByUserId: requesterId,
          receivedByName: handoverData.receivedByName,
          receivedByRelationship: handoverData.receivedByRelationship,
          handoverNotes: handoverData.notes,
          handoverAt: new Date(),
        },
      });

      await tx.reunificationRequest.update({
        where: { id: requestId },
        data: { status: 'REUNITED' },
      });
    });

    await auditService.log({
      actorId: requesterId,
      action: 'REUNIFICATION_COMPLETE',
      resourceType: 'ReunificationRequest',
      resourceId: requestId,
      metadata: { receivedBy: handoverData.receivedByName },
    });

    return { message: 'Reunification completed' };
  },
};
