import { Router } from 'express';
import { supportService } from './support.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/materials', async (req, res, next) => {
  try {
    sendSuccess(res, await supportService.getMaterials(req.query.language as string));
  } catch (err) { next(err); }
});

router.post('/requests', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await supportService.createRequest(req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/requests/:requestId/assign', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await supportService.assignSupport(req.params.requestId, req.body.assigneeId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.patch('/requests/:requestId/status', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await supportService.updateStatus(req.params.requestId, req.body.status, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as supportRouter };
