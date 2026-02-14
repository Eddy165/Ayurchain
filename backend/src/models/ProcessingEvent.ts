import mongoose, { Schema, Document } from "mongoose";
import { IProcessingEvent } from "../types";

export interface IProcessingEventDocument extends IProcessingEvent, Document {}

const ProcessingEventSchema = new Schema<IProcessingEventDocument>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    processorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, required: true },
    metadataHash: { type: String },
    blockchainTxHash: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ProcessingEventSchema.index({ batchId: 1 });
ProcessingEventSchema.index({ processorId: 1 });

export const ProcessingEvent = mongoose.model<IProcessingEventDocument>(
  "ProcessingEvent",
  ProcessingEventSchema
);
