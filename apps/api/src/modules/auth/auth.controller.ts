import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendCreated } from '../../common/response';
import { AuthenticatedRequest } from '../../common/types';
import { UnauthorizedError } from '../../common/errors';
import type { RegisterDto, LoginDto, RefreshTokenDto } from './auth.schema';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body as RegisterDto);
      sendCreated(res, result);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body as LoginDto);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body as RefreshTokenDto);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new UnauthorizedError('Refresh token required');
      await authService.logout(refreshToken, req.user!.id);
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Generic response regardless of whether email exists (prevent enumeration)
      // TODO: implement email sending with token when email provider is configured
      sendSuccess(res, { message: 'If the email exists, a reset link has been sent' });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: implement when email/token system is configured
      sendSuccess(res, { message: 'Password reset successful' });
    } catch (err) {
      next(err);
    }
  },
};
