import { Router } from "express";
import multer from "multer";
import { submitReport, getPendingBatches } from "../controllers/labController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";

// Use memory storage so files are available as Buffer for IPFS upload
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// GET /api/labs/queue — pending batches for lab
router.get("/queue", requireAuth, requireRole("lab", "admin"), getPendingBatches);

// POST /api/labs/reports — submit a lab report
router.post("/reports", requireAuth, requireRole("lab", "admin"), upload.single("file"), submitReport);

export default router;
