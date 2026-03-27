import express from "express";
import { Batch, LabReport, Certification } from "../models";
import { authenticate, AuthRequest } from "../middleware/auth";
import { UserRole, BatchStatus } from "../types";

const router = express.Router();

// Get analytics/KPIs
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { User } = await import("../models/User");
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let analytics: any = {};

    switch (user.role) {
      case UserRole.FARMER:
        const farmerBatches = await Batch.find({ farmerId: req.userId });
        const certifiedBatches = farmerBatches.filter(
          (b) => b.status === BatchStatus.CERTIFIED
        );
        analytics = {
          totalBatches: farmerBatches.length,
          certifiedBatches: certifiedBatches.length,
          acceptanceRate: farmerBatches.length > 0
            ? (certifiedBatches.length / farmerBatches.length) * 100
            : 0,
          batchesByStatus: Object.values(BatchStatus).reduce((acc: any, status) => {
            acc[status] = farmerBatches.filter((b) => b.status === status).length;
            return acc;
          }, {}),
        };
        break;

      case UserRole.LAB:
        const labReports = await LabReport.find({ labId: req.userId });
        const passedReports = labReports.filter((r) => r.status === "passed");
        analytics = {
          totalTests: labReports.length,
          passedTests: passedReports.length,
          failedTests: labReports.filter((r) => r.status === "failed").length,
          passRate: labReports.length > 0
            ? (passedReports.length / labReports.length) * 100
            : 0,
        };
        break;

      case UserRole.BRAND:
        // QR scan counts would be tracked separately
        const brandBatches = await Batch.find({ status: BatchStatus.IN_MARKET });
        const certifiedBrandBatches = await Batch.find({
          status: BatchStatus.CERTIFIED,
        });
        analytics = {
          totalBatchesInMarket: brandBatches.length,
          certifiedBatches: certifiedBrandBatches.length,
          certificationRate: brandBatches.length > 0
            ? (certifiedBrandBatches.length / brandBatches.length) * 100
            : 0,
          qrScans: 0, // Would be tracked in a separate collection
        };
        break;

      default:
        analytics = { message: "No analytics available for this role" };
    }

    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
