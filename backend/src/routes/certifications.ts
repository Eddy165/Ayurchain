import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types";
import { issueCertificate, getCertificatesByBatch } from "../controllers/certifierController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authenticate,
  authorize(UserRole.CERTIFIER),
  upload.single("certificateFile"),
  issueCertificate
);

router.get("/batch/:batchId", authenticate, getCertificatesByBatch);

export default router;
