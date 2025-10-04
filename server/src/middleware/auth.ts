import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import createHttpError from 'http-errors';

export const clerkMiddleware = ClerkExpressWithAuth();

type ClerkAuthShape = {
  userId: string;
};

type AuthenticatedRequest = Request & { auth: ClerkAuthShape };

function ensureAuth(req: Request): asserts req is AuthenticatedRequest {
  const maybeAuth = req as Request & { auth?: ClerkAuthShape };
  if (!maybeAuth.auth?.userId) {
    throw createHttpError(401, 'Unauthorized');
  }
}

export const requireAuth: RequestHandler = (req, _res, next: NextFunction) => {
  try {
    ensureAuth(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const getUserId = (req: Request) => {
  ensureAuth(req);
  return (req as AuthenticatedRequest).auth.userId;
};
