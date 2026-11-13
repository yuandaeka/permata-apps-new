import { prisma } from '../../config/database';

export const offlineService = {
  async listPackages() {
    return prisma.offlineContentPackage.findMany({
      where: { isActive: true },
      select: { id: true, name: true, version: true, language: true, packageType: true, sizeBytes: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getPackageManifest(packageId: string) {
    const pkg = await prisma.offlineContentPackage.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error('Package not found');

    return {
      id: pkg.id,
      name: pkg.name,
      version: pkg.version,
      language: pkg.language,
      packageType: pkg.packageType,
      checksum: pkg.checksum,
      sizeBytes: pkg.sizeBytes,
      contentManifest: pkg.contentManifest,
      updatedAt: pkg.updatedAt,
    };
  },

  async sync(operations: Array<{ type: string; resourceType: string; resourceId: string; data: unknown; clientTimestamp: string }>, userId: string) {
    const results = [];

    for (const op of operations) {
      try {
        const record = await prisma.syncOperation.create({
          data: {
            userId,
            operationType: op.type,
            resourceType: op.resourceType,
            resourceId: op.resourceId,
            payload: op.data as any,
            clientTimestamp: new Date(op.clientTimestamp),
            status: 'PENDING',
          },
        });
        results.push({ operationId: record.id, status: 'QUEUED' });
      } catch {
        results.push({ resourceId: op.resourceId, status: 'FAILED' });
      }
    }

    return { processed: results.length, results };
  },
};
