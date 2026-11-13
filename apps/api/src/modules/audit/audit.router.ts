import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/auth.middleware';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../common/response';

const router = Router();

router.get('/', authenticate, requireRoles('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count(),
    ]);

    sendSuccess(res, logs, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

export { router as auditRouter };
