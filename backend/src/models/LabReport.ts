import mongoose, { Schema, Document } from "mongoose";
import { ILabReport } from "../types";

export interface ILabReportDocument extends ILabReport, Document {}

const LabReportSchema = new Schema<ILabReportDocument>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    labId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testParameters: { type: Schema.Types.Mixed, required: true },
    resultStatus: {
      type: String,
      enum: ["PASS", "FAIL", "PENDING"],
      required: true,
    },
    reportFileHash: { type: String, required: true },
    blockchainTxHash: { type: String },
  },
  {
    timestamps: true,
  }
);

LabReportSchema.index({ batchId: 1 });
LabReportSchema.index({ labId: 1 });

export const LabReport = mongoose.model<ILabReportDocument>("LabReport", LabReportSchema);
