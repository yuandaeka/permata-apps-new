import { Router } from 'express';
import { usersController } from './users.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { updateProfileSchema } from './users.schema';

const router = Router();

router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), usersController.updateMe);

export { router as usersRouter };
