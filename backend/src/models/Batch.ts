import mongoose, { Schema, Document } from "mongoose";
import { IBatch, BatchStatus } from "../types";

export interface IBatchDocument extends IBatch, Document {}

const BatchSchema = new Schema<IBatchDocument>(
  {
    batchId: { type: String, required: true, unique: true },
    shortBatchRef: { type: String, required: true, unique: true },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    speciesName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    harvestDate: { type: Date, required: true },
    geoLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    initialQualityGrade: { type: String, required: true },
    photos: [{ type: String }], // IPFS hashes
    status: {
      type: String,
      enum: Object.values(BatchStatus),
      default: BatchStatus.CREATED,
    },
    currentOwnerId: { type: Schema.Types.ObjectId, ref: "User" },
    blockchainTxHash: { type: String },
    metadataHash: { type: String },
  },
  {
    timestamps: true,
  }
);

BatchSchema.index({ batchId: 1 });
BatchSchema.index({ farmerId: 1 });
BatchSchema.index({ status: 1 });
BatchSchema.index({ currentOwnerId: 1 });

export const Batch = mongoose.model<IBatchDocument>("Batch", BatchSchema);
