import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "../config";
import { authenticate } from "../middleware/auth";
import { validate, registerValidation, loginValidation } from "../middleware/validation";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

// Register
router.post("/register", validate(registerValidation), async (req, res) => {
  try {
    const { name, email, phone, password, role, walletAddress, languages, organization, location } =
      req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      role,
      walletAddress,
      languages: languages || ["en"],
      organization,
      location,
    });

    await user.save();

    // Generate tokens
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwtRefreshSecret,
      {
        expiresIn: config.jwtRefreshExpiresIn,
      }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", validate(loginValidation), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwtRefreshSecret,
      {
        expiresIn: config.jwtRefreshExpiresIn,
      }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
      walletAddress: user.walletAddress,
      languages: user.languages,
      organization: user.organization,
      location: user.location,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

export default router;
