import { Router } from "express";
import { register, login, getMe, refresh } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/refresh
router.post("/refresh", refresh);

// GET /api/auth/me (protected)
router.get("/me", requireAuth, getMe);

export default router;
