import { Response, NextFunction } from 'express';
import { organizationsService } from './organizations.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';

export const organizationsController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendCreated(res, await organizationsService.create(req.body, req.user.id));
    } catch (err) { next(err); }
  },
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, await organizationsService.getById(req.params.orgId));
    } catch (err) { next(err); }
  },
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendSuccess(res, await organizationsService.update(req.params.orgId, req.body, req.user.id, req.user.roles));
    } catch (err) { next(err); }
  },
  async addMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendCreated(res, await organizationsService.addMember(req.params.orgId, req.body, req.user.id, req.user.roles));
    } catch (err) { next(err); }
  },
  async getMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      sendSuccess(res, await organizationsService.getMembers(req.params.orgId, req.user.id, req.user.roles));
    } catch (err) { next(err); }
  },
};
