import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, IUser, UserRole } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "changeme_min_32_chars_secret_key";

/**
 * JWT Auth Middleware — verifies the Bearer token and attaches user to req.user and req.userId
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" } });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IUser & { id?: string };
    req.user = decoded;
    req.userId = decoded._id || decoded.id || "";
    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: { code: "TOKEN_EXPIRED", message: "Access token has expired" } });
    } else {
      res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid access token" } });
    }
  }
}

/** Alias used by scaffolded routes */
export const authenticate = requireAuth;

/**
 * Role-based access control middleware.
 * Usage: authorize(UserRole.FARMER) or authorize("farmer")
 */
export function authorize(...roles: (UserRole | string)[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } });
      return;
    }
    next();
  };
}

// Re-export AuthRequest for direct imports from this module
export type { AuthRequest };
