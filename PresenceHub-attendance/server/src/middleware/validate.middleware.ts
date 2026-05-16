// ============================================
// Zod Validation Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Validate request body, query, or params against a Zod schema.
 * Usage: router.post('/create', validate(mySchema), handler)
 *        router.get('/list', validate(paginationSchema, 'query'), handler)
 */
export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed + transformed data
      (req as any)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(err.message);
        });
        next(AppError.badRequest('Validation failed', fieldErrors));
      } else {
        next(error);
      }
    }
  };
}
