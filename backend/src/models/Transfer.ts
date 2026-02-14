import mongoose, { Schema, Document } from "mongoose";
import { ITransfer } from "../types";

export interface ITransferDocument extends ITransfer, Document {}

const TransferSchema = new Schema<ITransferDocument>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transferType: { type: String, required: true },
    metadataHash: { type: String },
    blockchainTxHash: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

TransferSchema.index({ batchId: 1 });
TransferSchema.index({ fromUserId: 1 });
TransferSchema.index({ toUserId: 1 });

export const Transfer = mongoose.model<ITransferDocument>("Transfer", TransferSchema);
