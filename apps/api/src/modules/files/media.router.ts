import { Router } from 'express';
import { mediaService } from './media.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.post('/upload-intents', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await mediaService.createUploadIntent(req.body, req.user.id));
  } catch (err) { next(err); }
});

router.post('/:mediaId/complete', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await mediaService.completeUpload(req.params.mediaId, req.user.id));
  } catch (err) { next(err); }
});

export { router as mediaRouter };
