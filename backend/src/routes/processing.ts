import express from "express";
import { ProcessingEvent } from "../models";
import { Batch } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { blockchainService } from "../services/blockchain";
import { ipfsService } from "../services/ipfs";
import { UserRole } from "../types";

const router = express.Router();

// Add processing event
router.post(
  "/events",
  authenticate,
  authorize(UserRole.PROCESSOR),
  async (req: AuthRequest, res) => {
    try {
      const { batchId, eventType, metadata } = req.body;

      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Check ownership
      if (batch.currentOwnerId?.toString() !== req.userId) {
        return res.status(403).json({ error: "Not authorized to process this batch" });
      }

      // Upload metadata to IPFS if provided
      let metadataHash: string | undefined;
      if (metadata) {
        metadataHash = await ipfsService.uploadJSON(metadata);
      }

      // Create processing event
      const event = new ProcessingEvent({
        batchId,
        processorId: req.userId,
        eventType,
        metadataHash,
      });

      await event.save();

      // Write to blockchain
      try {
        const txHash = await blockchainService.addProcessingEvent(
          batch.batchId,
          metadataHash ? `ipfs://${metadataHash}` : ""
        );
        event.blockchainTxHash = txHash;
        await event.save();
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }

      res.status(201).json({
        id: event._id,
        batchId,
        eventType,
        timestamp: event.timestamp,
        blockchainTxHash: event.blockchainTxHash,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get processing events for a batch
router.get("/events/batch/:batchId", authenticate, async (req: AuthRequest, res) => {
  try {
    const { batchId } = req.params;

    const events = await ProcessingEvent.find({ batchId })
      .populate("processorId", "name email")
      .sort({ timestamp: 1 });

    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
