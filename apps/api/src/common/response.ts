import { Response } from 'express';
import { ApiSuccessResponse } from './types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ApiSuccessResponse<T>['meta']
): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendCreated<T>(res: Response, data: T, meta?: ApiSuccessResponse<T>['meta']): void {
  sendSuccess(res, data, 201, meta);
}

