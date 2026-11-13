import { Router } from 'express';
import { contentService } from './content.service';
import { sendSuccess } from '../../common/response';

const router = Router();

router.get('/recommended', async (req, res, next) => {
  try {
    const result = await contentService.getRecommended({
      regionCode: req.query.regionCode as string,
      languageCode: req.query.languageCode as string,
      disasterTypeCode: req.query.disasterTypeCode as string,
      ageGroup: req.query.ageGroup as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    sendSuccess(res, result.items, 200, result.meta);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    sendSuccess(res, await contentService.getById(req.params.id, req.query.language as string));
  } catch (err) { next(err); }
});

export { router as contentRouter };
