import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

/**
 * Role-based Access Control Middleware.
 * Usage: requireRole("admin", "certifier")
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Role '${req.user.role}' is not permitted. Required: [${roles.join(", ")}]`,
        },
      });
      return;
    }

    next();
  };
}
