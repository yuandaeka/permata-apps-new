import { Router } from 'express';
import { recoveryJournalService } from './recoveryJournal.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

const router = Router();

router.get('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await recoveryJournalService.list(req.params.childId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:childId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await recoveryJournalService.create(req.params.childId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/:entryId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await recoveryJournalService.update(req.params.entryId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.delete('/:entryId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await recoveryJournalService.delete(req.params.entryId, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as recoveryJournalRouter };
