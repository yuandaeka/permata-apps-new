import { prisma } from '../../config/database';
import { NotFoundError } from '../../common/errors';

export const regionsService = {
  async list(level?: number, parentCode?: string) {
    const where: any = { isActive: true };
    if (level !== undefined) where.level = level;
    if (parentCode !== undefined) where.parentCode = parentCode;

    return prisma.region.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 100,
    });
  },

  async getById(regionId: string) {
    const region = await prisma.region.findFirst({
      where: { OR: [{ id: regionId }, { code: regionId }], isActive: true },
      include: {
        culturalProfiles: { include: { language: true } },
        evacuationMaps: true,
        emergencyContacts: true,
      },
    });

    if (!region) throw new NotFoundError('Region', regionId);
    return region;
  },

  async getContent(regionCode: string) {
    return prisma.contentItem.findMany({
      where: {
        status: 'PUBLISHED',
        regions: { some: { regionCode } },
      },
      include: {
        translations: true,
        disasterType: true,
      },
    });
  },
};

