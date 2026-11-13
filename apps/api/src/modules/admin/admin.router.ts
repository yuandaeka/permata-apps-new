import { Router } from 'express';
import { adminService } from './admin.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { authenticate, requireRoles } from '../../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';
import { prisma } from '../../config/database';

const router = Router();

// Content Admin routes
router.get('/content', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await adminService.listContent({ page, limit });
    sendSuccess(res, result.items, 200, result.meta);
  } catch (err) { next(err); }
});

router.post('/content', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await adminService.createContent(req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/content/:id', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await adminService.updateContent(req.params.id, req.body, req.user.id));
  } catch (err) { next(err); }
});

// Simulation Scenarios Admin routes
router.post('/simulations', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await adminService.createSimulationScenario(req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/simulations/:id', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await adminService.updateSimulationScenario(req.params.id, req.body, req.user.id));
  } catch (err) { next(err); }
});

// Assessments Admin routes
router.post('/assessments', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendCreated(res, await adminService.createAssessment(req.body, req.user.id));
  } catch (err) { next(err); }
});

router.patch('/assessments/:id', authenticate, requireRoles('SUPER_ADMIN', 'CONTENT_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    sendSuccess(res, await adminService.updateAssessment(req.params.id, req.body, req.user.id));
  } catch (err) { next(err); }
});

// Audit Logs route
router.get('/audit-logs', authenticate, requireRoles('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    sendSuccess(res, logs, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

export { router as adminRouter };
