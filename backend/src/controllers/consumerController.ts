import { Request, Response, NextFunction } from "express";
import { Batch } from "../models/Batch";
import { AppError } from "../middleware/errorHandler";
import * as blockchainService from "../services/blockchainService";

const STAGE_LABELS: Record<number, string> = {
  0: "Farm Harvest",
  1: "Processing",
  2: "Lab Testing",
  3: "Certified",
  4: "Brand Packaged",
  5: "Retail Ready",
};

/**
 * GET /api/consumer/verify/:token — public batch verification by QR token
 */
export async function verifyBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.params;

    const batch = await Batch.findOne({ qrToken: token, isPublic: true })
      .populate<{ farmerId: any }>("farmerId", "name location orgName")
      .populate<{ "transferHistory.actorId": any }>("transferHistory.actorId", "name orgName role")
      .lean();

    if (!batch) throw new AppError("Batch not found or not publicly available", 404, "NOT_FOUND");

    // Attempt blockchain enrichment for trust badge
    let blockchainVerified = false;
    let chainHistory: any[] = [];
    try {
      chainHistory = await blockchainService.getBatchHistoryFromChain(batch.batchId);
      blockchainVerified = true;
    } catch {
      blockchainVerified = false;
    }

    // Build consumer-friendly journey
    const journey = batch.transferHistory.map((t) => ({
      stage: STAGE_LABELS[t.stage] || `Stage ${t.stage}`,
      actorName: (t.actorId as any)?.name || t.actorName || "Unknown",
      actorOrg: (t.actorId as any)?.orgName || "",
      date: t.timestamp,
      notes: t.notes,
      ipfsHash: t.ipfsHash,
    }));

    const farmer = batch.farmerId as any;

    res.status(200).json({
      success: true,
      data: {
        batchId: batch.batchId,
        herbName: batch.herbName,
        scientificName: batch.scientificName,
        currentStage: STAGE_LABELS[batch.currentStage],
        isCertified: batch.isCertified,
        farmerName: farmer?.name || "Unknown",
        farmerLocation: farmer?.location || "Unknown",
        farmerOrg: farmer?.orgName || "",
        journey,
        chainHistory,
        blockchainVerified,
      },
    });
  } catch (err) {
    next(err);
  }
}
