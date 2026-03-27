import rateLimit from "express-rate-limit";

/**
 * Global rate limiter: 100 requests per 15 minutes across all routes.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." },
  },
});

/**
 * Auth-specific rate limiter: 10 requests per 15 minutes.
 * Applied to /api/auth/* routes to protect against brute force.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many authentication attempts, please try again later." },
  },
});
