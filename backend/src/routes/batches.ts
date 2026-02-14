import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Batch, Transfer, ProcessingEvent } from "../models/index";
import { BatchStatus } from "../types";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { validate, batchCreateValidation } from "../middleware/validation";
import { blockchainService } from "../services/blockchain";
import { ipfsService } from "../services/ipfs";
import { UserRole } from "../types";

const router = express.Router();

// Create batch (FARMER only)
router.post(
  "/",
  authenticate,
  authorize(UserRole.FARMER),
  validate(batchCreateValidation),
  async (req: AuthRequest, res) => {
    try {
      const {
        speciesName,
        quantity,
        unit,
        harvestDate,
        geoLocation,
        initialQualityGrade,
        photos,
      } = req.body;

      const batchId = uuidv4();
      const shortBatchRef = `BATCH-${Date.now().toString(36).toUpperCase()}`;

      // Upload photos to IPFS if provided
      let photoHashes: string[] = [];
      if (photos && Array.isArray(photos)) {
        // In production, photos would be uploaded as files via multer
        // For now, assuming they're already IPFS hashes
        photoHashes = photos;
      }

      // Create batch metadata JSON
      const metadata = {
        speciesName,
        quantity,
        unit,
        harvestDate,
        geoLocation,
        initialQualityGrade,
        photos: photoHashes,
      };

      const metadataHash = await ipfsService.uploadJSON(metadata);

      // Create batch in DB
      const batch = new Batch({
        batchId,
        shortBatchRef,
        farmerId: req.userId,
        speciesName,
        quantity,
        unit,
        harvestDate: new Date(harvestDate),
        geoLocation,
        initialQualityGrade,
        photos: photoHashes,
        status: BatchStatus.CREATED,
        currentOwnerId: req.userId,
        metadataHash,
      });

      await batch.save();

      // Write to blockchain
      try {
        const { User } = await import("../models/User");
        const farmer = await User.findById(req.userId);
        const txHash = await blockchainService.createBatch(
          batchId,
          farmer?.walletAddress || req.userId!,
          `ipfs://${metadataHash}`
        );
        batch.blockchainTxHash = txHash;
        await batch.save();

        // Initialize ownership
        await blockchainService.initializeOwner(
          batchId,
          farmer?.walletAddress || req.userId!
        );
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
        // Continue even if blockchain fails - batch is saved in DB
      }

      res.status(201).json({
        id: batch._id,
        batchId: batch.batchId,
        shortBatchRef: batch.shortBatchRef,
        status: batch.status,
        blockchainTxHash: batch.blockchainTxHash,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Transfer batch
router.put(
  "/:id/transfer",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { toUserId, transferType, metadata } = req.body;

      const batch = await Batch.findById(id);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Check ownership
      if (batch.currentOwnerId?.toString() !== req.userId) {
        return res.status(403).json({ error: "Not authorized to transfer this batch" });
      }

      const { User } = await import("../models/User");
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ error: "Recipient user not found" });
      }

      // Upload transfer metadata to IPFS
      let metadataHash: string | undefined;
      if (metadata) {
        metadataHash = await ipfsService.uploadJSON(metadata);
      }

      // Create transfer record
      const transfer = new Transfer({
        batchId: batch._id,
        fromUserId: req.userId,
        toUserId,
        transferType,
        metadataHash,
      });

      await transfer.save();

      // Update batch owner
      batch.currentOwnerId = toUserId;
      
      // Update status based on transfer type
      if (transferType === "HARVEST_TO_PROCESSOR") {
        batch.status = BatchStatus.IN_PROCESSING;
      } else if (transferType === "PROCESSOR_TO_LAB") {
        batch.status = BatchStatus.UNDER_TEST;
      }

      await batch.save();

      // Log transfer on blockchain
      try {
        const { User } = await import("../models/User");
        const fromUser = await User.findById(req.userId);
        const txHash = await blockchainService.logTransfer(
          batch.batchId,
          toUser.walletAddress || toUserId,
          metadataHash ? `ipfs://${metadataHash}` : ""
        );
        transfer.blockchainTxHash = txHash;
        await transfer.save();
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }

      res.json({
        transferId: transfer._id,
        batchId: batch.batchId,
        newOwner: toUserId,
        status: batch.status,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get batch history
router.get("/:id/history", async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id)
      .populate("farmerId", "name email")
      .populate("currentOwnerId", "name email role");

    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // Get transfers
    const transfers = await Transfer.find({ batchId: batch._id })
      .populate("fromUserId", "name email role")
      .populate("toUserId", "name email role")
      .sort({ timestamp: 1 });

    // Get processing events
    const processingEvents = await ProcessingEvent.find({ batchId: batch._id })
      .populate("processorId", "name email")
      .sort({ timestamp: 1 });

    // Get lab reports
    const { LabReport } = await import("../models/LabReport");
    const labReports = await LabReport.find({
      batchId: batch._id,
    })
      .populate("labId", "name email")
      .sort({ createdAt: 1 });

    // Get certifications
    const { Certification } = await import("../models/Certification");
    const certifications = await Certification.find({
      batchId: batch._id,
    })
      .populate("certifierId", "name email")
      .sort({ createdAt: 1 });

    // Get blockchain events (if available)
    let blockchainTransfers: any[] = [];
    try {
      blockchainTransfers = await blockchainService.getTransfers(batch.batchId);
    } catch (error) {
      console.error("Error fetching blockchain transfers:", error);
    }

    res.json({
      batch: {
        id: batch._id,
        batchId: batch.batchId,
        shortBatchRef: batch.shortBatchRef,
        speciesName: batch.speciesName,
        quantity: batch.quantity,
        unit: batch.unit,
        harvestDate: batch.harvestDate,
        geoLocation: batch.geoLocation,
        status: batch.status,
        farmer: batch.farmerId,
        currentOwner: batch.currentOwnerId,
        photos: batch.photos,
      },
      history: {
        transfers,
        processingEvents,
        labReports,
        certifications,
        blockchainTransfers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List batches (with filters)
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, role } = req.query;
    const query: any = {};

    // Filter by role
    if (role === "FARMER") {
      query.farmerId = req.userId;
    } else if (role === "PROCESSOR" || role === "LAB" || role === "CERTIFIER") {
      query.currentOwnerId = req.userId;
    }

    if (status) {
      query.status = status;
    }

    const batches = await Batch.find(query)
      .populate("farmerId", "name email")
      .populate("currentOwnerId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(batches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
