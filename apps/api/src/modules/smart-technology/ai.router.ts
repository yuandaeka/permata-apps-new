import { Router } from 'express';
import { aiService } from './ai.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { aiRateLimiter } from '../../middlewares/rateLimiter.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.post('/conversations', authenticate, aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await aiService.createConversation(req.user.id, req.body.childId, req.body.title, req.body.context));
  } catch (err) { next(err); }
});

router.post('/conversations/:conversationId/messages', authenticate, aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await aiService.sendMessage(req.params.conversationId, req.body.content, req.user.id));
  } catch (err) { next(err); }
});

router.get('/conversations/:conversationId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await aiService.getConversation(req.params.conversationId, req.user.id));
  } catch (err) { next(err); }
});

router.post('/feedback', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    sendSuccess(res, await aiService.recordFeedback(req.body.conversationId, req.body.rating, req.body.comment, req.user?.id));
  } catch (err) { next(err); }
});

export { router as aiRouter };
