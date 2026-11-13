import { Router } from 'express';
import { careCircleService } from './careCircle.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await careCircleService.listMembers(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:childId/invitations', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await careCircleService.createInvitation(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/invitations/:invitationId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await careCircleService.respondInvitation(req.params.invitationId, req.body.status, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/members/:memberId/permissions', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await careCircleService.updatePermissions(req.params.memberId, req.body.permissions, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:childId/referrals', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await careCircleService.createReferral(req.params.childId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as careCircleRouter };
