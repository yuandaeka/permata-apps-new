import { Response, NextFunction } from 'express';
import { childrenService } from './children.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

export const childrenController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.create(req.body, req.user.id);
      sendCreated(res, result);
    } catch (err) { next(err); }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.getById(req.params.childId, req.user.id, req.user.roles);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.update(req.params.childId, req.body, req.user.id, req.user.roles);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async addGuardian(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.addGuardian(req.params.childId, req.body, req.user.id, req.user.roles);
      sendCreated(res, result);
    } catch (err) { next(err); }
  },

  async updateGuardianRelation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.updateGuardianRelation(
        req.params.childId, req.params.relationshipId, req.body.status, req.user.id, req.user.roles
      );
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async recordConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.recordConsent(req.params.childId, req.body, req.user.id);
      sendCreated(res, result);
    } catch (err) { next(err); }
  },

  async getConsents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await childrenService.getConsents(req.params.childId, req.user.id, req.user.roles);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },
};
