import { Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { sendSuccess } from '../../common/response';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';
import type { UpdateProfileDto } from './users.schema';

export const usersController = {
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await usersService.getMe(req.user.id);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await usersService.updateMe(req.user.id, req.body as UpdateProfileDto);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
