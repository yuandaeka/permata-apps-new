import { Router } from 'express';
import { regionsService } from './regions.service';
import { sendSuccess } from '../../common/response';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const level = req.query.level ? parseInt(req.query.level as string) : undefined;
    sendSuccess(res, await regionsService.list(level, req.query.parentCode as string));
  } catch (err) { next(err); }
});

router.get('/:regionId', async (req, res, next) => {
  try {
    sendSuccess(res, await regionsService.getById(req.params.regionId));
  } catch (err) { next(err); }
});

router.get('/:regionCode/content', async (req, res, next) => {
  try {
    sendSuccess(res, await regionsService.getContent(req.params.regionCode));
  } catch (err) { next(err); }
});

export { router as regionsRouter };
