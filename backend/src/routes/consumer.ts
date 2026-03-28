import { Router } from "express";
import { verifyByToken } from "../controllers/consumerController";

const router = Router();

router.get("/verify/:token", verifyByToken);

export default router;
