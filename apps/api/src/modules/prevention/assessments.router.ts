import { Router } from 'express';
import { assessmentsService } from './assessments.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    sendSuccess(res, await assessmentsService.list(req.query));
  } catch (err) { next(err); }
});

router.get('/:assessmentId', async (req, res, next) => {
  try {
    sendSuccess(res, await assessmentsService.getById(req.params.assessmentId));
  } catch (err) { next(err); }
});

router.post('/:assessmentId/submissions', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await assessmentsService.submit(req.params.assessmentId, req.user.id, req.body.responses));
  } catch (err) { next(err); }
});

router.get('/submissions/:submissionId/result', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await assessmentsService.getResult(req.params.submissionId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as assessmentsRouter };
