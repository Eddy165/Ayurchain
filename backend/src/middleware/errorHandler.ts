import { Request, Response, NextFunction } from "express";

/**
 * Custom application error class for structured error handling.
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express error handler. Must be registered as the last middleware.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      error: {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
    })
  );

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: err.message },
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      error: { code: "DUPLICATE_KEY", message: "A record with that value already exists" },
    });
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      error: { code: "AUTH_ERROR", message: err.message },
    });
    return;
  }

  // Default internal server error
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === "production" ? "An internal error occurred" : err.message,
    },
  });
}
