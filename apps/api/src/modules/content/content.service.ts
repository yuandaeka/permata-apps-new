import { prisma } from '../../config/database';
import { NotFoundError } from '../../common/errors';

export interface RecommendedContentQuery {
  regionCode?: string;
  languageCode?: string;
  disasterTypeCode?: string;
  ageGroup?: string;
  page?: number;
  limit?: number;
}

export const contentService = {
  async getRecommended(query: RecommendedContentQuery) {
    const languageCode = query.languageCode ?? 'id';
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 50);
    const skip = (page - 1) * limit;

    const where: any = { status: 'PUBLISHED' };

    if (query.disasterTypeCode) {
      const dt = await prisma.disasterType.findUnique({ where: { code: query.disasterTypeCode } });
      if (dt) where.disasterTypeId = dt.id;
    }

    if (query.regionCode) {
      where.regions = { some: { regionCode: query.regionCode } };
    }

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        include: {
          disasterType: true,
          translations: {
            where: { languageCode: { in: [languageCode, 'id'] } },
          },
          mediaAssets: { where: { isPublic: true }, take: 1 },
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.contentItem.count({ where }),
    ]);

    // Apply cultural adaptations if regional profile is available
    let culturalTerms: Record<string, string> = {};
    if (query.regionCode) {
      const profile = await prisma.culturalProfile.findUnique({
        where: { regionCode_languageCode: { regionCode: query.regionCode, languageCode } },
      });
      if (profile?.localTerms) {
        culturalTerms = profile.localTerms as Record<string, string>;
      }
    }

    const formatted = items.map((item) => {
      // Find requested translation or fallback to Indonesian
      const translation = item.translations.find(t => t.languageCode === languageCode) ?? item.translations[0];
      let title = translation?.title ?? item.slug;
      let body = translation?.body ?? '';

      // Replace known terms with local equivalents if available
      for (const [term, localTerm] of Object.entries(culturalTerms)) {
        title = title.replaceAll(term, localTerm);
        body = body.replaceAll(term, localTerm);
      }

      return {
        id: item.id,
        slug: item.slug,
        type: item.type,
        disasterType: item.disasterType?.name,
        title,
        body,
        summary: translation?.summary,
        thumbnailUrl: item.mediaAssets[0]?.thumbnailUrl ?? item.mediaAssets[0]?.url,
        languageCode: translation?.languageCode ?? 'id',
        publishedAt: item.publishedAt,
      };
    });

    return {
      items: formatted,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string, languageCode = 'id') {
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        disasterType: true,
        translations: true,
        regions: { include: { region: true } },
        mediaAssets: true,
      },
    });

    if (!item) throw new NotFoundError('Content item', id);

    const translation = item.translations.find(t => t.languageCode === languageCode) ?? item.translations[0];
    return { ...item, activeTranslation: translation };
  },
};

