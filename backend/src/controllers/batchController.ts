import { Response, NextFunction } from "express";
import { Batch } from "../models/Batch";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";
import * as blockchainService from "../services/blockchainService";
import * as ipfsService from "../services/ipfsService";
import * as qrService from "../services/qrService";

// Maps DB stage number to allowed roles for that transfer target
const STAGE_ROLE_MAP: Record<number, string[]> = {
  1: ["processor", "admin"], // Processing
  2: ["lab", "admin"],       // LabTesting
  3: ["certifier", "admin"], // Certified
  4: ["brand", "admin"],     // BrandPackaged
  5: ["brand", "admin"],     // RetailReady
};

/**
 * POST /api/batches — create a new batch (FARMER only)
 */
export async function createBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { herbName, scientificName, harvestLocation, harvestDate, quantity, unit } = req.body;

    if (!herbName || !quantity || !unit) {
      throw new AppError("herbName, quantity, and unit are required", 400, "VALIDATION_ERROR");
    }

    const user = req.user!;
    const timestamp = Date.now();
    const batchId = `BATCH-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
    const qrToken = qrService.generateQRToken(batchId);

    // Upload initial metadata to IPFS
    const metadata = {
      batchId,
      farmerId: user._id,
      herbName,
      scientificName,
      harvestLocation,
      harvestDate,
      quantity,
      unit,
      createdAt: new Date().toISOString(),
    };
    const ipfsDocHash = await ipfsService.uploadJSONToPinata(metadata, `batch_${batchId}`);

    // Write to blockchain
    const harvestTimestamp = harvestDate ? Math.floor(new Date(harvestDate).getTime() / 1000) : Math.floor(timestamp / 1000);
    const txHash = await blockchainService.createBatchOnChain(
      batchId,
      user._id,
      herbName,
      harvestLocation || "",
      harvestTimestamp,
      quantity,
      ipfsDocHash
    );

    // Persist in MongoDB
    const batch = await Batch.create({
      batchId,
      farmerId: user._id,
      herbName,
      scientificName,
      harvestLocation,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      quantity,
      unit,
      currentStage: 0,
      blockchainTxHash: txHash,
      ipfsDocHash,
      qrToken,
      isPublic: true,
    });

    // Generate QR code image
    const qrCodeUrl = await qrService.generateQRCode(qrToken, batchId);
    await Batch.findByIdAndUpdate(batch._id, { qrCodeUrl });

    res.status(201).json({
      success: true,
      data: { batch: { ...batch.toObject(), qrCodeUrl }, qrCodeUrl },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/batches/:id/transfer — move a batch to the next supply chain stage
 */
export async function transferBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { newStage, notes, ipfsHash } = req.body;
    const user = req.user!;

    if (newStage === undefined) throw new AppError("newStage is required", 400, "VALIDATION_ERROR");

    const allowedRoles = STAGE_ROLE_MAP[Number(newStage)];
    if (!allowedRoles || !allowedRoles.includes(user.role)) {
      throw new AppError(`Role '${user.role}' cannot transfer to stage ${newStage}`, 403, "FORBIDDEN");
    }

    const batch = await Batch.findOne({ batchId: id });
    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    const resolvedIpfsHash = ipfsHash || batch.ipfsDocHash || "";
    const txHash = await blockchainService.transferBatchOnChain(id, Number(newStage), user._id, notes || "", resolvedIpfsHash);

    const dbUser = await User.findById(user._id).lean();

    batch.currentStage = Number(newStage);
    batch.transferHistory.push({
      stage: Number(newStage),
      actorId: user._id,
      actorName: dbUser?.name || "",
      notes: notes || "",
      ipfsHash: resolvedIpfsHash,
      txHash,
      timestamp: new Date(),
    });
    await batch.save();

    res.status(200).json({ success: true, data: { batch } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/batches/:id/history — fetch batch history from DB + blockchain
 */
export async function getBatchHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const batch = await Batch.findOne({ batchId: id })
      .populate("farmerId", "name location orgName")
      .populate("transferHistory.actorId", "name orgName role")
      .lean();

    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    let chainHistory: any[] = [];
    let blockchainVerified = false;
    try {
      chainHistory = await blockchainService.getBatchHistoryFromChain(id);
      blockchainVerified = true;
    } catch {
      // Non-critical — return DB data even if chain call fails
      blockchainVerified = false;
    }

    res.status(200).json({
      success: true,
      data: { batch, history: batch.transferHistory, chainHistory, blockchainVerified },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/batches — list batches, filtered by requester's role
 */
export async function listBatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user!;
    let filter: Record<string, unknown> = {};

    if (user.role === "farmer") filter = { farmerId: user._id };
    else if (user.role === "lab") filter = { currentStage: { $in: [1, 2] } };
    else if (user.role === "brand") filter = { currentStage: 3 };
    // admin, certifier, processor see all

    const batches = await Batch.find(filter)
      .populate("farmerId", "name location orgName")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: { batches, count: batches.length } });
  } catch (err) {
    next(err);
  }
}
