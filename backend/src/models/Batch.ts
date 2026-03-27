import mongoose, { Document, Schema } from "mongoose";
import { IBatch, BatchStatus } from "../types";

export interface IBatchDocument extends Omit<IBatch, "_id">, Document {}

const BatchSchema = new Schema<IBatchDocument>(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    shortBatchRef: { type: String },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    currentOwnerId: { type: Schema.Types.ObjectId, ref: "User" },
    herbName: { type: String },
    speciesName: { type: String },
    scientificName: { type: String },
    harvestLocation: { type: String },
    geoLocation: { type: String },
    harvestDate: { type: Date },
    quantity: { type: String },
    unit: { type: String, enum: ["kg", "g", "tonnes", "litres"], default: "kg" },
    currentStage: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(BatchStatus),
      default: BatchStatus.CREATED,
    },
    isCertified: { type: Boolean, default: false },
    blockchainTxHash: { type: String },
    metadataHash: { type: String },
    ipfsDocHash: { type: String },
    qrCodeUrl: { type: String },
    qrToken: { type: String, unique: true, index: true, sparse: true },
    isPublic: { type: Boolean, default: true },
    photos: [{ type: String }],
    initialQualityGrade: { type: String },
    transferHistory: [
      {
        stage: { type: Number, required: true },
        actorId: { type: Schema.Types.ObjectId, ref: "User" },
        actorName: { type: String },
        notes: { type: String },
        ipfsHash: { type: String },
        txHash: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Batch = mongoose.model<IBatchDocument>("Batch", BatchSchema);
