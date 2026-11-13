import { Router } from "express";
import { childrenController } from "./children.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  createChildSchema,
  updateChildSchema,
  guardianRelationSchema,
  consentSchema,
} from "./children.schema";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createChildSchema),
  childrenController.create,
);
router.get("/:childId", authenticate, childrenController.getById);
router.patch(
  "/:childId",
  authenticate,
  validate(updateChildSchema),
  childrenController.update,
);
router.post(
  "/:childId/guardians",
  authenticate,
  validate(guardianRelationSchema),
  childrenController.addGuardian,
);
router.patch(
  "/:childId/guardians/:relationshipId",
  authenticate,
  childrenController.updateGuardianRelation,
);
router.post(
  "/:childId/consents",
  authenticate,
  validate(consentSchema),
  childrenController.recordConsent,
);
router.get("/:childId/consents", authenticate, childrenController.getConsents);

export { router as childrenRouter };
