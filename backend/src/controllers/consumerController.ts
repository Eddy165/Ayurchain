import { Request, Response, NextFunction } from "express";
import { Batch } from "../models/Batch";
import { Certification } from "../models/Certification";
import { AppError } from "../middleware/errorHandler";
import * as blockchainService from "../services/blockchainService";

/**
 * GET /api/consumer/verify/:token — Consumers verify product authenticity
 */
export async function verifyByToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.params;
    
    // Find batch by QR token
    const batch = await Batch.findOne({ qrToken: token })
      .populate<{ farmerId: any }>("farmerId", "name location")
      .populate<{ "transferHistory.actorId": any }>("transferHistory.actorId", "name role")
      .lean();
      
    if (!batch) {
      throw new AppError("Product not found", 404, "NOT_FOUND");
    }

    // Get certifications
    const certificates = await Certification.find({ batchId: batch._id })
      .populate<{ certifierId: any }>("certifierId", "orgName")
      .sort({ createdAt: -1 })
      .lean();

    // Get blockchain history for verification
    let blockchainVerified = false;
    try {
      const blockchainHistory = await blockchainService.getBatchHistoryFromChain(batch.batchId);
      blockchainVerified = blockchainHistory.length > 0;
    } catch {
      blockchainVerified = false;
    }

    // Calculate trustScore 0-100
    // +20 per completed stage in: ['Farming', 'Processing', 'LabTesting', 'Certification', 'Branded']
    let trustScore = 0;
    const stagesCompleted = batch.currentStage;
    
    trustScore += (Math.min(stagesCompleted + 1, 5)) * 20;

    // Bonus +10 if isCertified
    if (batch.isCertified) {
      trustScore += 10;
    }
    
    if (trustScore > 100) trustScore = 100;

    // Construct response matching expected timeline requirements
    const journey = batch.transferHistory.map((historyItem: any) => ({
      stage: historyItem.stage,
      actorName: historyItem.actorName || (historyItem.actorId ? historyItem.actorId.name : "Unknown Actor"),
      actorRole: historyItem.actorId ? historyItem.actorId.role : undefined,
      timestamp: historyItem.timestamp,
      notes: historyItem.notes,
      ipfsHash: historyItem.ipfsHash,
      txHash: historyItem.txHash,
    }));

    const mappedCertificates = certificates.map((cert: any) => ({
      certType: cert.certificateType,
      certifierOrgName: cert.certifierId?.orgName || "Independent Certifier",
      issuedAt: cert.createdAt,
      expiresAt: cert.expiryDate,
      ipfsHash: cert.certificateFileHash,
    }));

    const farmerData: any = batch.farmerId || {};

    res.status(200).json({
      success: true,
      data: {
        batchId: batch.batchId,
        herbName: batch.herbName,
        scientificName: batch.scientificName || "Withania somnifera",
        farmerName: farmerData.name || "Unknown Farmer",
        farmerLocation: farmerData.location || "Unknown Location",
        harvestDate: batch.harvestDate,
        currentStage: batch.currentStage,
        isCertified: batch.isCertified,
        journey,
        certificates: mappedCertificates,
        blockchainVerified,
        trustScore,
      }
    });
  } catch (err) {
    next(err);
  }
}
