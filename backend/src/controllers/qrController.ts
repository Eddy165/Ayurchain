import { Response, NextFunction, Request } from "express";
import { Batch } from "../models/Batch";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";
import * as qrService from "../services/qrService";

/**
 * GET /api/qr/generate/:batchId — regenerate a new QR code for a batch (BRAND only)
 */
export async function regenerateQR(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId });
    if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

    const newToken = qrService.generateQRToken(batchId);
    const qrCodeUrl = await qrService.generateQRCode(newToken, batchId);

    await Batch.findByIdAndUpdate(batch._id, { qrToken: newToken, qrCodeUrl });

    res.status(200).json({ success: true, data: { qrCodeUrl, qrToken: newToken } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/qr/scan/:token — alias for consumer verify (redirects to consumer controller data)
 */
export async function scanQR(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.params;

    const batch = await Batch.findOne({ qrToken: token, isPublic: true })
      .populate("farmerId", "name location orgName")
      .lean();

    if (!batch) throw new AppError("Invalid or expired QR code", 404, "NOT_FOUND");

    res.redirect(`/api/consumer/verify/${token}`);
  } catch (err) {
    next(err);
  }
}
