import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "changeme_min_32_chars_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "changeme_refresh_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

const VALID_ROLES = ["farmer", "processor", "lab", "certifier", "brand", "admin", "consumer"];

function generateTokens(payload: object) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
  return { token, refreshToken };
}

/**
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role, orgName, location, phone, walletAddress } = req.body;

    // Input validation
    if (!name || !email || !password || !role) {
      throw new AppError("name, email, password, and role are required", 400, "VALIDATION_ERROR");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email format", 400, "VALIDATION_ERROR");
    }
    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400, "VALIDATION_ERROR");
    }
    if (!VALID_ROLES.includes(role)) {
      throw new AppError(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`, 400, "VALIDATION_ERROR");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existingUser) {
      throw new AppError("An account with this email already exists", 409, "DUPLICATE_EMAIL");
    }

    const user = await User.create({ name, email, password, role, orgName, location, phone, walletAddress });

    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const { token, refreshToken } = generateTokens(payload);

    res.status(201).json({
      success: true,
      data: { token, refreshToken, user: payload },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400, "VALIDATION_ERROR");
    }

    // Must explicitly select password since it's select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const { token, refreshToken } = generateTokens(payload);

    res.status(200).json({
      success: true,
      data: { token, refreshToken, user: payload },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me — returns the current authenticated user
 */
export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user?._id).lean();
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh — issue new access token from refresh token
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Refresh token is required", 400, "VALIDATION_ERROR");

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const { iat, exp, ...payload } = decoded; // strip JWT metadata fields
    const { token, refreshToken: newRefreshToken } = generateTokens(payload);

    res.status(200).json({ success: true, data: { token, refreshToken: newRefreshToken } });
  } catch (err) {
    next(err);
  }
}
