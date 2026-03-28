import { Response, NextFunction } from "express";
import { Batch } from "../models/Batch";
import { Certification } from "../models/Certification";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";
import * as ipfsService from "../services/ipfsService";
import * as blockchainService from "../services/blockchainService";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/certifications — Issue a certificate (CERTIFIER role only)
 */
export async function issueCertificate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { batchId, certType, certifierOrgName, expiresAt } = req.body;
    const file = req.file; // from multer
    const user = req.user!;

    if (!batchId || !certType || !certifierOrgName) {
      throw new AppError("batchId, certType, and certifierOrgName are required", 400, "VALIDATION_ERROR");
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    let ipfsHash = "PLACEHOLDER_NO_FILE";
    if (file) {
      ipfsHash = await ipfsService.uploadFileToPinata(file.buffer, file.originalname);
    }

    const certId = uuidv4();
    const expiresTimestamp = expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : 0;

    const txHash = await blockchainService.issueCertOnChain(
      certId,
      batchId,
      certifierOrgName,
      certType,
      ipfsHash,
      expiresTimestamp
    );

    const certificate = await Certification.create({
      batchId: batch._id,
      certifierId: user._id,
      certificateType: certType,
      certificateFileHash: ipfsHash,
      blockchainTxHash: txHash,
      expiryDate: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
      revoked: false,
    });

    batch.isCertified = true;
    batch.currentStage = 3; // Certified Stage
    batch.transferHistory.push({
      stage: 3,
      actorId: user._id,
      actorName: certifierOrgName,
      notes: `Batch certified with ${certType}`,
      ipfsHash,
      txHash,
      timestamp: new Date(),
    });
    await batch.save();

    res.status(201).json({ success: true, data: { certificate } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/certifications/batch/:batchId — Get all certs for a batch
 */
export async function getCertificatesByBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId });
    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    const certificates = await Certification.find({ batchId: batch._id })
      .populate("certifierId", "name orgName")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: { certificates, count: certificates.length } });
  } catch (err) {
    next(err);
  }
}
