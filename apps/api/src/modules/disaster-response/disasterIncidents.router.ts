import { Router } from 'express';
import { disasterIncidentsService } from './disasterIncidents.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';
import rateLimit from 'express-rate-limit';

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Search rate limit exceeded' } },
});

const router = Router();

router.get('/', authenticate, searchLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await disasterIncidentsService.list(req.user.id, req.user.roles, req.query.organizationId as string));
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await disasterIncidentsService.create(req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/:incidentId/children', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await disasterIncidentsService.registerChild(req.params.incidentId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.patch('/children/:recordId/status', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await disasterIncidentsService.updateStatus(req.params.recordId, req.body.status, req.body.notes, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.patch('/children/:recordId/location', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await disasterIncidentsService.updateLocation(req.params.recordId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/children/:recordId/reunification-requests', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await disasterIncidentsService.createReunificationRequest(req.params.recordId, req.body, req.user.id));
  } catch (err) { next(err); }
});

router.post('/reunification-requests/:requestId/verify', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await disasterIncidentsService.verifyReunification(req.params.requestId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

router.post('/reunification-requests/:requestId/complete', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await disasterIncidentsService.completeReunification(req.params.requestId, req.body, req.user.id, req.user.roles));
  } catch (err) { next(err); }
});

export { router as disasterIncidentsRouter };
