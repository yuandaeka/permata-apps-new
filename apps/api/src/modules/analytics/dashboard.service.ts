import { prisma } from '../../config/database';
import { ForbiddenError } from '../../common/errors';

const SMALL_CELL_THRESHOLD = 5;

function applySmallCellSuppression(count: number): number | string {
  if (count === 0) return 0;
  if (count < SMALL_CELL_THRESHOLD) return `< ${SMALL_CELL_THRESHOLD}`;
  return count;
}

export const dashboardService = {
  async getCommunityResilience(requesterRoles: string[], organizationId?: string, regionCode?: string) {
    const isAuthorized = requesterRoles.some(r => ['SUPER_ADMIN', 'PROGRAM_MANAGER', 'AUTHORIZED_OFFICER'].includes(r));
    if (!isAuthorized) {
      throw new ForbiddenError('Dashboard access requires program manager or administrative role');
    }

    const [
      totalSimulations,
      completedSimulations,
      totalChildren,
      supportRequests,
      activeShelters,
      childFriendlyShelters,
    ] = await Promise.all([
      prisma.simulationAttempt.count(),
      prisma.simulationAttempt.count({ where: { status: 'COMPLETED' } }),
      prisma.childProfile.count({ where: { isActive: true } }),
      prisma.supportRequest.groupBy({
        by: ['requestType', 'status'],
        _count: { id: true },
      }),
      prisma.shelter.count({ where: { isActive: true } }),
      prisma.shelter.count({ where: { isActive: true, hasChildFacility: true } }),
    ]);

    // Aggregate support request counts by category with small-cell suppression
    const supportNeedSummary: Record<string, number | string> = {};
    for (const group of supportRequests) {
      const type = group.requestType ?? 'GENERAL';
      const current = (typeof supportNeedSummary[type] === 'number' ? (supportNeedSummary[type] as number) : 0) + group._count.id;
      supportNeedSummary[type] = current;
    }

    // Apply suppression to all categories
    for (const key of Object.keys(supportNeedSummary)) {
      if (typeof supportNeedSummary[key] === 'number') {
        supportNeedSummary[key] = applySmallCellSuppression(supportNeedSummary[key] as number);
      }
    }

    const completionRate = totalSimulations > 0 ? Math.round((completedSimulations / totalSimulations) * 100) : 0;

    return {
      overview: {
        totalSimulationsCount: applySmallCellSuppression(totalSimulations),
        completedSimulationsCount: applySmallCellSuppression(completedSimulations),
        completionRatePercentage: completionRate,
        registeredChildrenCount: applySmallCellSuppression(totalChildren),
      },
      facilities: {
        activeShelters: applySmallCellSuppression(activeShelters),
        childFriendlyFacilities: applySmallCellSuppression(childFriendlyShelters),
      },
      psychosocialSupportNeeds: supportNeedSummary,
      dataPrivacy: {
        smallCellSuppressed: true,
        threshold: SMALL_CELL_THRESHOLD,
        notice: 'Individual records are strictly isolated. All metrics are aggregated.',
      },
    };
  },

  async exportReport(requesterRoles: string[]) {
    const data = await this.getCommunityResilience(requesterRoles);
    return {
      exportedAt: new Date().toISOString(),
      format: 'JSON_AGGREGATE',
      report: data,
    };
  },
};

