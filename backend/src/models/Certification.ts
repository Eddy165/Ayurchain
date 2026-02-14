import mongoose, { Schema, Document } from "mongoose";
import { ICertification, CertificateType } from "../types";

export interface ICertificationDocument extends ICertification, Document {}

const CertificationSchema = new Schema<ICertificationDocument>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    certifierId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    certificateType: {
      type: String,
      enum: Object.values(CertificateType),
      required: true,
    },
    expiryDate: { type: Date, required: true },
    certificateFileHash: { type: String, required: true },
    blockchainTxHash: { type: String },
    revoked: { type: Boolean, default: false },
    revokeReasonHash: { type: String },
  },
  {
    timestamps: true,
  }
);

CertificationSchema.index({ batchId: 1 });
CertificationSchema.index({ certifierId: 1 });
CertificationSchema.index({ expiryDate: 1 });

export const Certification = mongoose.model<ICertificationDocument>(
  "Certification",
  CertificationSchema
);
