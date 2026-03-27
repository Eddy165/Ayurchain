import { Router } from "express";
import { verifyBatch } from "../controllers/consumerController";

const router = Router();

// GET /api/consumer/verify/:token — public endpoint, no auth needed
router.get("/verify/:token", verifyBatch);

export default router;
