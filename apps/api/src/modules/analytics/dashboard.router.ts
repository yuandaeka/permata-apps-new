import { Router } from 'express';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/community-resilience', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const result = await dashboardService.getCommunityResilience(
      req.user.roles,
      req.query.organizationId as string,
      req.query.regionCode as string
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.get('/community-resilience/export', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await dashboardService.exportReport(req.user.roles));
  } catch (err) { next(err); }
});

export { router as dashboardRouter };
