// ============================================
// Rate Limiting Middleware
// ============================================

import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints: stricter limit — 50 requests per 15 minutes (relaxed for dev)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
