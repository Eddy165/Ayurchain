import { Request } from "express";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "processor" | "lab" | "certifier" | "brand" | "admin" | "consumer";
  walletAddress?: string;
  isVerified: boolean;
  kycStatus: "pending" | "approved" | "rejected";
  orgName?: string;
  location?: string;
  phone?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export interface TransferEvent {
  stage: number;
  actorAddress: string;
  actorId: string;
  notes: string;
  ipfsHash: string;
  timestamp: string;
}

// ─── User roles as enum (used by routes via authorize(UserRole.X)) ──────────

export enum UserRole {
  FARMER = "farmer",
  PROCESSOR = "processor",
  LAB = "lab",
  CERTIFIER = "certifier",
  BRAND = "brand",
  ADMIN = "admin",
  CONSUMER = "consumer",
}

// ─── Batch status values used by the original data model ────────────────────

export enum BatchStatus {
  CREATED = "CREATED",
  IN_PROCESSING = "IN_PROCESSING",
  UNDER_TEST = "UNDER_TEST",
  CERTIFIED = "CERTIFIED",
  REJECTED = "REJECTED",
  READY = "READY",
  IN_MARKET = "IN_MARKET",
}

// ─── IBatch — full schema used by Batch model and routes ────────────────────

export interface IBatch {
  _id?: string;
  batchId: string;
  shortBatchRef?: string;
  farmerId: string | IUser;
  currentOwnerId?: string | IUser;
  herbName?: string;
  speciesName?: string;
  scientificName?: string;
  harvestLocation?: string;
  geoLocation?: string;
  harvestDate?: Date;
  quantity?: string;
  unit: "kg" | "g" | "tonnes" | "litres";
  currentStage: number;
  status?: BatchStatus;
  isCertified: boolean;
  blockchainTxHash?: string;
  metadataHash?: string;
  ipfsDocHash?: string;
  qrCodeUrl?: string;
  qrToken?: string;
  isPublic: boolean;
  photos?: string[];
  initialQualityGrade?: string;
  transferHistory: Array<{
    stage: number;
    actorId: string | IUser;
    actorName: string;
    notes: string;
    ipfsHash: string;
    txHash: string;
    timestamp: Date;
  }>;
}

// ─── Certificate types ───────────────────────────────────────────────────────

/** Certificate types (AYUSH-style) */
export enum CertificateType {
  AYUSH_GMP = "AYUSH_GMP",
  ISO_22000 = "ISO_22000",
  ORGANIC = "ORGANIC",
  FSSAI = "FSSAI",
  EU_ORGANIC = "EU_ORGANIC",
  HALAL = "HALAL",
  KOSHER = "KOSHER",
  FAIR_TRADE = "FAIR_TRADE",
  HEAVY_METAL_FREE = "HEAVY_METAL_FREE",
  PESTICIDE_FREE = "PESTICIDE_FREE",
}

/** Interface for the Certification Mongoose model */
export interface ICertification {
  batchId: string | object;
  certifierId: string | object;
  certificateType: CertificateType;
  expiryDate: Date;
  certificateFileHash: string;
  blockchainTxHash?: string;
  revoked: boolean;
  revokeReasonHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Processing Event ────────────────────────────────────────────────────────

export interface IProcessingEvent {
  batchId: string | object;
  processorId: string | object;
  eventType: string;
  metadataHash?: string;
  blockchainTxHash?: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Transfer ────────────────────────────────────────────────────────────────

export interface ITransfer {
  batchId: string | object;
  fromUserId: string | object;
  toUserId: string | object;
  transferType: string;
  metadataHash?: string;
  blockchainTxHash?: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
