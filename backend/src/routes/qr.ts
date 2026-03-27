import { Router } from "express";
import { regenerateQR, scanQR } from "../controllers/qrController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";

const router = Router();

// GET /api/qr/generate/:batchId — regenerate QR (BRAND only)
router.get("/generate/:batchId", requireAuth, requireRole("brand", "admin"), regenerateQR);

// GET /api/qr/scan/:token — alias for consumer verify
router.get("/scan/:token", scanQR);

export default router;
