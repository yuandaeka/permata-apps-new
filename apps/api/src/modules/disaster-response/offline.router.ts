import { Router } from 'express';
import { offlineService } from './offline.service';
import { sendSuccess } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/packages', authenticate, async (_req, res, next) => {
  try {
    sendSuccess(res, await offlineService.listPackages());
  } catch (err) { next(err); }
});

router.get('/packages/:packageId', authenticate, async (req, res, next) => {
  try {
    sendSuccess(res, await offlineService.getPackageManifest(req.params.packageId));
  } catch (err) { next(err); }
});

router.post('/sync', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await offlineService.sync(req.body.operations ?? [], req.user.id));
  } catch (err) { next(err); }
});

export { router as offlineRouter };
