import { Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../types";
import * as blockchainService from "../services/blockchainService";

/**
 * GET /api/farmers — list all verified farmers (public)
 */
export async function listFarmers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const farmers = await User.find({ role: "farmer", isVerified: true })
      .select("name orgName location phone isVerified kycStatus")
      .lean();

    res.status(200).json({ success: true, data: { farmers, count: farmers.length } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/farmers/:id — get single farmer profile
 */
export async function getFarmer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const farmer = await User.findById(req.params["id"])
      .select("name orgName location phone isVerified kycStatus walletAddress")
      .lean();

    if (!farmer || farmer.role !== "farmer") {
      throw new AppError("Farmer not found", 404, "NOT_FOUND");
    }

    res.status(200).json({ success: true, data: { farmer } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/farmers/:id/register-onchain — register farmer on blockchain (ADMIN only)
 */
export async function registerFarmerOnChain(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const farmer = await User.findById(req.params["id"]).select("+aadhaarHash").lean();
    if (!farmer) throw new AppError("Farmer not found", 404, "NOT_FOUND");

    const txHash = await blockchainService.registerFarmerOnChain(
      farmer._id.toString(),
      farmer.name,
      farmer.location || "",
      "", // cropTypes not in User model - extend if needed
      farmer.aadhaarHash || farmer._id.toString()
    );

    await User.findByIdAndUpdate(farmer._id, { isVerified: true, kycStatus: "approved" });

    res.status(200).json({ success: true, data: { txHash, farmerId: farmer._id } });
  } catch (err) {
    next(err);
  }
}
