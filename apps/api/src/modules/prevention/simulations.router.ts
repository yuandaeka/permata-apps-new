import { Router } from 'express';
import { simulationsController } from './simulations.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';
import { simulationResponseSchema } from './simulations.schema';

const router = Router();

router.get('/', optionalAuth, simulationsController.list);
router.get('/:scenarioId', optionalAuth, simulationsController.getById);
router.post('/:scenarioId/attempts', authenticate, simulationsController.startAttempt);
router.post('/attempts/:attemptId/responses', authenticate, validate(simulationResponseSchema), simulationsController.saveResponse);
router.post('/attempts/:attemptId/complete', authenticate, simulationsController.completeAttempt);

export { router as simulationsRouter };
