import { Router } from "express";
import { createBatch, transferBatch, getBatchHistory, listBatches } from "../controllers/batchController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";

const router = Router();

// GET /api/batches — list batches (filtered by role)
router.get("/", requireAuth, listBatches);

// POST /api/batches — create new batch (FARMER only)
router.post("/", requireAuth, requireRole("farmer", "admin"), createBatch);

// PUT /api/batches/:id/transfer — move to next stage
router.put("/:id/transfer", requireAuth, requireRole("processor", "lab", "certifier", "brand", "admin"), transferBatch);

// GET /api/batches/:id/history — get full history
router.get("/:id/history", requireAuth, getBatchHistory);

export default router;
