import { Response, NextFunction } from "express";
import { Batch } from "../models/Batch";
import { LabReport } from "../models/LabReport";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";
import * as ipfsService from "../services/ipfsService";
import * as blockchainService from "../services/blockchainService";

/**
 * POST /api/labs/reports — submit a lab report (LAB role only)
 */
export async function submitReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { batchId, reportType, findings, testDate, reportTitle } = req.body;
    const file = req.file; // from multer middleware
    const user = req.user!;

    if (!batchId || !reportType || !testDate) {
      throw new AppError("batchId, reportType, and testDate are required", 400, "VALIDATION_ERROR");
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    // Upload report file to IPFS
    let ipfsHash = "PLACEHOLDER_NO_FILE";
    let fileUrl = "";
    if (file) {
      ipfsHash = await ipfsService.uploadFileToPinata(file.buffer, file.originalname);
      fileUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    }

    // Save report to DB
    const report = await LabReport.create({
      batchId: batch._id,
      labId: user._id,
      reportTitle: reportTitle || `${reportType} Report - ${batchId}`,
      reportType,
      ipfsHash,
      fileUrl,
      status: "pending",
      findings,
      testDate: new Date(testDate),
    });

    // Update batch stage to LabTesting if not already there
    if (batch.currentStage < 2) {
      const txHash = await blockchainService.transferBatchOnChain(
        batchId, 2, user._id, "Lab report submitted", ipfsHash
      );
      batch.currentStage = 2;
      batch.transferHistory.push({
        stage: 2,
        actorId: user._id,
        actorName: "Lab",
        notes: `Lab report submitted: ${reportType}`,
        ipfsHash,
        txHash,
        timestamp: new Date(),
      });
      await batch.save();
    }

    res.status(201).json({ success: true, data: { report } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/labs/queue — get batches pending lab review
 */
export async function getPendingQueue(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const batches = await Batch.find({ currentStage: { $in: [1, 2] } })
      .populate("farmerId", "name location orgName")
      .sort({ updatedAt: 1 })
      .lean();

    res.status(200).json({ success: true, data: { batches, count: batches.length } });
  } catch (err) {
    next(err);
  }
}
