import express from "express";
import multer from "multer";
import { LabReport } from "../models";
import { Batch } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { blockchainService } from "../services/blockchain";
import { ipfsService } from "../services/ipfs";
import { UserRole, BatchStatus } from "../types";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Submit lab report
router.post(
  "/reports",
  authenticate,
  authorize(UserRole.LAB),
  upload.single("reportFile"),
  async (req: AuthRequest, res) => {
    try {
      const { batchId, testParameters, resultStatus } = req.body;

      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Parse test parameters
      const params = typeof testParameters === "string" 
        ? JSON.parse(testParameters) 
        : testParameters;

      // Upload report file to IPFS if provided
      let reportFileHash = "";
      if (req.file) {
        reportFileHash = await ipfsService.uploadFile(
          req.file.buffer,
          req.file.originalname
        );
      } else if (req.body.reportFileHash) {
        reportFileHash = req.body.reportFileHash;
      }

      // Create lab report
      const labReport = new LabReport({
        batchId,
        labId: req.userId,
        testParameters: params,
        resultStatus: resultStatus || "PENDING",
        reportFileHash,
      });

      await labReport.save();

      // Update batch status
      if (resultStatus === "PASS") {
        batch.status = BatchStatus.CERTIFIED;
      } else if (resultStatus === "FAIL") {
        batch.status = BatchStatus.REJECTED;
      } else {
        batch.status = BatchStatus.UNDER_TEST;
      }
      await batch.save();

      // Write to blockchain
      try {
        const txHash = await blockchainService.addLabReport(
          batch.batchId,
          reportFileHash,
          resultStatus || "PENDING"
        );
        labReport.txHash = txHash;
        await labReport.save();
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }

      res.status(201).json({
        id: labReport._id,
        batchId,
        resultStatus: labReport.status,
        reportFileHash,
        blockchainTxHash: labReport.txHash,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get batches awaiting testing
router.get("/queue", authenticate, authorize(UserRole.LAB), async (req: AuthRequest, res) => {
  try {
    const batches = await Batch.find({
      status: BatchStatus.UNDER_TEST,
      currentOwnerId: req.userId,
    })
      .populate("farmerId", "name email")
      .sort({ createdAt: -1 });

    res.json(batches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get lab reports
router.get("/reports", authenticate, authorize(UserRole.LAB), async (req: AuthRequest, res) => {
  try {
    const reports = await LabReport.find({ labId: req.userId })
      .populate("batchId")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
