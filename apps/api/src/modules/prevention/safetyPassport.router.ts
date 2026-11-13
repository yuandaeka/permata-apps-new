import { Router } from 'express';
import { safetyPassportService } from './safetyPassport.service';
import { sendSuccess } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await safetyPassportService.get(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.put('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await safetyPassportService.upsert(req.params.childId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as safetyPassportRouter };
