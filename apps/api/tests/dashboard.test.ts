import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from '../src/modules/analytics/dashboard.service';
import { prisma } from '../src/config/database';
import { ForbiddenError } from '../src/common/errors';

vi.mock('../src/config/database', () => ({
  prisma: {
    simulationAttempt: { count: vi.fn() },
    childProfile: { count: vi.fn() },
    supportRequest: { groupBy: vi.fn() },
    shelter: { count: vi.fn() },
  },
}));

describe('Community Resilience Dashboard (SMART-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects access for non-manager roles', async () => {
    await expect(dashboardService.getCommunityResilience(['CHILD'])).rejects.toThrow(ForbiddenError);
    await expect(dashboardService.getCommunityResilience(['VOLUNTEER'])).rejects.toThrow(ForbiddenError);
  });

  it('allows access for PROGRAM_MANAGER and SUPER_ADMIN', async () => {
    (prisma.simulationAttempt.count as any)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(10);
    (prisma.childProfile.count as any).mockResolvedValueOnce(20);
    (prisma.supportRequest.groupBy as any).mockResolvedValueOnce([
      { requestType: 'EMOTIONAL_SUPPORT', status: 'OPEN', _count: { id: 7 } },
    ]);
    (prisma.shelter.count as any)
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(6);

    const result = await dashboardService.getCommunityResilience(['PROGRAM_MANAGER']);
    expect(result).toBeDefined();
    expect(result.overview.totalSimulationsCount).toBe(12);
    expect(result.overview.completedSimulationsCount).toBe(10);
    expect(result.overview.completionRatePercentage).toBe(83);
    expect(result.dataPrivacy.smallCellSuppressed).toBe(true);
  });

  it('enforces small-cell suppression when counts are under threshold (< 5)', async () => {
    (prisma.simulationAttempt.count as any)
      .mockResolvedValueOnce(3) // < 5
      .mockResolvedValueOnce(2); // < 5
    (prisma.childProfile.count as any).mockResolvedValueOnce(4); // < 5
    (prisma.supportRequest.groupBy as any).mockResolvedValueOnce([
      { requestType: 'GRIEF_SUPPORT', status: 'OPEN', _count: { id: 2 } }, // < 5
    ]);
    (prisma.shelter.count as any)
      .mockResolvedValueOnce(1) // < 5
      .mockResolvedValueOnce(0);

    const result = await dashboardService.getCommunityResilience(['SUPER_ADMIN']);
    expect(result.overview.totalSimulationsCount).toBe('< 5');
    expect(result.overview.completedSimulationsCount).toBe('< 5');
    expect(result.overview.registeredChildrenCount).toBe('< 5');
    expect(result.facilities.activeShelters).toBe('< 5');
    expect(result.facilities.childFriendlyFacilities).toBe(0);
    expect(result.psychosocialSupportNeeds['GRIEF_SUPPORT']).toBe('< 5');
  });
});

