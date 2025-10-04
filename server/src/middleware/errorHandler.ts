import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, 'Resource not found'));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (createHttpError.isHttpError(err)) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal Server Error', status: 500 });
};
