// ============================================
// JWT Authentication Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(AppError.unauthorized('Access token has expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(AppError.unauthorized('Invalid access token'));
    } else {
      next(error);
    }
  }
}
