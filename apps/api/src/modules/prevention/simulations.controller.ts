import { Request, Response, NextFunction } from 'express';
import { simulationsService } from './simulations.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

export const simulationsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await simulationsService.list({
        disasterTypeId: req.query.disasterTypeId as string,
        ageGroup: req.query.ageGroup as string,
        language: req.query.language as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });
      sendSuccess(res, result.scenarios, 200, result.meta);
    } catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, await simulationsService.getById(req.params.scenarioId));
    } catch (err) { next(err); }
  },
  async startAttempt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendCreated(res, await simulationsService.startAttempt(req.params.scenarioId, req.user.id));
    } catch (err) { next(err); }
  },
  async saveResponse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendCreated(res, await simulationsService.saveResponse(req.params.attemptId, req.body, req.user.id));
    } catch (err) { next(err); }
  },
  async completeAttempt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendSuccess(res, await simulationsService.completeAttempt(req.params.attemptId, req.user.id));
    } catch (err) { next(err); }
  },
  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendSuccess(res, await simulationsService.getHistory(req.params.childId, req.user.id, req.user.roles));
    } catch (err) { next(err); }
  },
};
