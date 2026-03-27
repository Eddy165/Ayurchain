import { Router } from "express";
import { listFarmers, getFarmer, registerFarmerOnChain } from "../controllers/farmerController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";

const router = Router();

// GET /api/farmers — list verified farmers (public)
router.get("/", listFarmers);

// GET /api/farmers/:id — get single farmer
router.get("/:id", getFarmer);

// POST /api/farmers/:id/register-onchain — admin registers farmer on blockchain
router.post("/:id/register-onchain", requireAuth, requireRole("admin"), registerFarmerOnChain);

export default router;
