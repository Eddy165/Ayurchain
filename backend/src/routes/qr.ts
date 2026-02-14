import express from "express";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { Batch } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { config } from "../config";
import { UserRole } from "../types";

const router = express.Router();

// Generate QR code for batch (BRAND only)
router.post(
  "/batches/:id/qr",
  authenticate,
  authorize(UserRole.BRAND),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const batch = await Batch.findById(id);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Generate signed token for QR code
      const token = jwt.sign(
        { batchId: batch.shortBatchRef, batchDbId: batch._id },
        config.jwtSecret,
        { expiresIn: "365d" } // Long expiry for QR codes
      );

      const qrUrl = `${config.corsOrigin}/consumer/verify/${token}`;

      // Generate QR code image
      const qrCodeDataURL = await QRCode.toDataURL(qrUrl);

      res.json({
        qrUrl,
        token,
        qrCodeImage: qrCodeDataURL,
        batchId: batch.batchId,
        shortBatchRef: batch.shortBatchRef,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
