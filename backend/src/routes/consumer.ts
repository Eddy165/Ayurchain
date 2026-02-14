import express from "express";
import jwt from "jsonwebtoken";
import { Batch, Transfer, LabReport, Certification, ProcessingEvent } from "../models";
import { config } from "../config";
import { blockchainService } from "../services/blockchain";
import { ipfsService } from "../services/ipfs";

const router = express.Router();

// Verify QR token and return traceability info
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as {
      batchId: string;
      batchDbId: string;
    };

    const batch = await Batch.findById(decoded.batchDbId)
      .populate("farmerId", "name email organization location")
      .populate("currentOwnerId", "name email role organization");

    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // Get full history
    const transfers = await Transfer.find({ batchId: batch._id })
      .populate("fromUserId", "name email role")
      .populate("toUserId", "name email role")
      .sort({ timestamp: 1 });

    const processingEvents = await ProcessingEvent.find({ batchId: batch._id })
      .populate("processorId", "name email")
      .sort({ timestamp: 1 });

    const labReports = await LabReport.find({ batchId: batch._id })
      .populate("labId", "name email organization")
      .sort({ createdAt: 1 });

    const certifications = await Certification.find({
      batchId: batch._id,
      revoked: false,
    })
      .populate("certifierId", "name email organization")
      .sort({ createdAt: -1 });

    // Get blockchain data
    let blockchainTransfers: any[] = [];
    let blockchainCertificates: any[] = [];
    try {
      blockchainTransfers = await blockchainService.getTransfers(batch.batchId);
      blockchainCertificates = await blockchainService.getCertificates(batch.batchId);
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }

    // Build timeline
    const timeline = [];
    
    // Harvest
    timeline.push({
      type: "HARVEST",
      timestamp: batch.harvestDate,
      actor: batch.farmerId,
      location: batch.geoLocation,
      description: `Harvested ${batch.quantity} ${batch.unit} of ${batch.speciesName}`,
    });

    // Transfers
    transfers.forEach((transfer) => {
      timeline.push({
        type: "TRANSFER",
        timestamp: transfer.timestamp,
        from: transfer.fromUserId,
        to: transfer.toUserId,
        transferType: transfer.transferType,
        description: `Transferred from ${(transfer.fromUserId as any).name} to ${(transfer.toUserId as any).name}`,
      });
    });

    // Processing events
    processingEvents.forEach((event) => {
      timeline.push({
        type: "PROCESSING",
        timestamp: event.timestamp,
        actor: event.processorId,
        eventType: event.eventType,
        description: `Processing: ${event.eventType}`,
      });
    });

    // Lab reports
    labReports.forEach((report) => {
      timeline.push({
        type: "LAB_TEST",
        timestamp: report.createdAt,
        actor: report.labId,
        resultStatus: report.resultStatus,
        description: `Lab test: ${report.resultStatus}`,
        reportFileHash: report.reportFileHash,
      });
    });

    // Certifications
    certifications.forEach((cert) => {
      timeline.push({
        type: "CERTIFICATION",
        timestamp: cert.createdAt,
        actor: cert.certifierId,
        certificateType: cert.certificateType,
        expiryDate: cert.expiryDate,
        description: `Certified: ${cert.certificateType}`,
        certificateFileHash: cert.certificateFileHash,
      });
    });

    // Sort timeline by timestamp
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Authenticity check
    const authenticityChecks = {
      blockchainVerified: batch.blockchainTxHash ? true : false,
      hasCertifications: certifications.length > 0,
      allTestsPassed: labReports.every((r) => r.resultStatus === "PASS"),
      noRevokedCertificates: certifications.every((c) => !c.revoked),
    };

    const isAuthentic =
      authenticityChecks.blockchainVerified &&
      authenticityChecks.hasCertifications &&
      authenticityChecks.allTestsPassed &&
      authenticityChecks.noRevokedCertificates;

    res.json({
      product: {
        batchId: batch.batchId,
        shortBatchRef: batch.shortBatchRef,
        speciesName: batch.speciesName,
        quantity: batch.quantity,
        unit: batch.unit,
        harvestDate: batch.harvestDate,
        status: batch.status,
      },
      origin: {
        farmer: batch.farmerId,
        location: batch.geoLocation,
        harvestDate: batch.harvestDate,
      },
      timeline,
      labStatus: {
        reports: labReports.map((r) => ({
          lab: r.labId,
          resultStatus: r.resultStatus,
          testParameters: r.testParameters,
          reportFileUrl: r.reportFileHash
            ? ipfsService.getGatewayURL(r.reportFileHash)
            : null,
          createdAt: r.createdAt,
        })),
      },
      certifications: certifications.map((c) => ({
        type: c.certificateType,
        certifier: c.certifierId,
        expiryDate: c.expiryDate,
        certificateFileUrl: ipfsService.getGatewayURL(c.certificateFileHash),
        createdAt: c.createdAt,
      })),
      authenticity: {
        isAuthentic,
        checks: authenticityChecks,
        verdict: isAuthentic
          ? "AUTHENTIC - This product has been verified through the blockchain traceability system."
          : "VERIFICATION INCOMPLETE - Some verification steps are missing or incomplete.",
      },
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired QR code" });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
