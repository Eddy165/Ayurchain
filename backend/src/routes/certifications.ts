import express from "express";
import multer from "multer";
import { Certification } from "../models";
import { Batch } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { blockchainService } from "../services/blockchain";
import { ipfsService } from "../services/ipfs";
import { UserRole, CertificateType, BatchStatus } from "../types";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Add certification
router.post(
  "/",
  authenticate,
  authorize(UserRole.CERTIFIER),
  upload.single("certificateFile"),
  async (req: AuthRequest, res) => {
    try {
      const { batchId, certificateType, expiryDate } = req.body;

      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Upload certificate file to IPFS
      let certificateFileHash = "";
      if (req.file) {
        certificateFileHash = await ipfsService.uploadFile(
          req.file.buffer,
          req.file.originalname
        );
      } else if (req.body.certificateFileHash) {
        certificateFileHash = req.body.certificateFileHash;
      }

      // Create certification
      const certification = new Certification({
        batchId,
        certifierId: req.userId,
        certificateType: certificateType as CertificateType,
        expiryDate: new Date(expiryDate),
        certificateFileHash,
      });

      await certification.save();

      // Update batch status
      batch.status = BatchStatus.CERTIFIED;
      await batch.save();

      // Write to blockchain
      try {
        const validUntil = Math.floor(new Date(expiryDate).getTime() / 1000);
        const txHash = await blockchainService.addCertificate(
          batch.batchId,
          certificateFileHash,
          certificateType,
          validUntil
        );
        certification.blockchainTxHash = txHash;
        await certification.save();
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }

      res.status(201).json({
        id: certification._id,
        batchId,
        certificateType,
        expiryDate: certification.expiryDate,
        certificateFileHash,
        blockchainTxHash: certification.blockchainTxHash,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get certifications for a batch
router.get("/batch/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;

    const certifications = await Certification.find({ batchId })
      .populate("certifierId", "name email")
      .sort({ createdAt: -1 });

    res.json(certifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Revoke certification
router.post(
  "/:id/revoke",
  authenticate,
  authorize(UserRole.CERTIFIER),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { reasonHash } = req.body;

      const certification = await Certification.findById(id);
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }

      certification.revoked = true;
      certification.revokeReasonHash = reasonHash;
      await certification.save();

      // Revoke on blockchain
      try {
        const batch = await Batch.findById(certification.batchId);
        if (batch) {
          // Find certificate index (simplified - in production, track index)
          const certs = await blockchainService.getCertificates(batch.batchId);
          const index = certs.findIndex(
            (c: any) => c.certHash === certification.certificateFileHash
          );
          if (index >= 0) {
            await blockchainService.revokeCertificate(
              batch.batchId,
              index,
              reasonHash
            );
          }
        }
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }

      res.json({ message: "Certification revoked", certification });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
