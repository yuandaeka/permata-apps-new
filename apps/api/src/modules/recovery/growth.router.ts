import { Router } from 'express';
import { growthService } from './growth.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await growthService.list(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await growthService.create(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.get('/children/:childId/summary', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await growthService.getSummary(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as growthRouter };
