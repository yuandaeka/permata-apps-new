import { Router } from 'express';
import { griefJourneyService } from './griefJourney.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/activities', async (_req, res, next) => {
  try {
    sendSuccess(res, await griefJourneyService.getActivities());
  } catch (err) { next(err); }
});

router.post('/children/:childId/emotion-check-ins', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await griefJourneyService.recordEmotionCheckIn(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.post('/children/:childId/memory-box', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await griefJourneyService.createMemoryBoxEntry(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.get('/children/:childId/memory-box', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await griefJourneyService.getMemoryBox(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:childId/little-steps', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await griefJourneyService.createLittleStep(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/little-steps/:stepId/complete', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await griefJourneyService.completeLittleStep(req.params.stepId, req.body.celebrationNote, req.user.id));
  } catch (err) { next(err); }
});

export { router as griefJourneyRouter };
