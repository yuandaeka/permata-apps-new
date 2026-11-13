import { Router } from 'express';
import { organizationsController } from './organizations.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { createOrganizationSchema, updateOrganizationSchema, addMemberSchema } from './organizations.schema';

const router = Router();

router.post('/', authenticate, validate(createOrganizationSchema), organizationsController.create);
router.get('/:orgId', authenticate, organizationsController.getById);
router.patch('/:orgId', authenticate, validate(updateOrganizationSchema), organizationsController.update);
router.post('/:orgId/members', authenticate, validate(addMemberSchema), organizationsController.addMember);
router.get('/:orgId/members', authenticate, organizationsController.getMembers);

export { router as organizationsRouter };
