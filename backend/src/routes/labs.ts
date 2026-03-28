import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types";
import { submitReport, getPendingQueue } from "../controllers/labController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/reports",
  authenticate,
  authorize(UserRole.LAB),
  upload.single("reportFile"),
  submitReport
);

router.get("/queue", authenticate, authorize(UserRole.LAB), getPendingQueue);

export default router;
