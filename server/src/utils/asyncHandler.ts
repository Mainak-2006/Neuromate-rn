import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <Req extends Request = Request, Res extends Response = Response>(
  handler: (req: Req, res: Res, next: NextFunction) => Promise<void | Response>
): RequestHandler => {
  return (req, res, next) => {
    handler(req as Req, res as Res, next).catch(next);
  };
};
