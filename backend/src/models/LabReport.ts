import mongoose, { Document, Schema } from "mongoose";

export interface ILabReport {
  batchId: mongoose.Types.ObjectId | string;
  labId: mongoose.Types.ObjectId | string;
  reportTitle: string;
  reportType: "HeavyMetal" | "Pesticide" | "Microbial" | "Authenticity" | "Nutritional";
  ipfsHash: string;
  fileUrl?: string;
  status: "pending" | "passed" | "failed";
  findings?: string;
  testDate: Date;
  txHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILabReportDocument extends ILabReport, Document {}

const LabReportSchema = new Schema<ILabReportDocument>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    labId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportTitle: { type: String },
    reportType: {
      type: String,
      enum: ["HeavyMetal", "Pesticide", "Microbial", "Authenticity", "Nutritional"],
      required: true,
    },
    ipfsHash: { type: String, required: true },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
    },
    findings: { type: String },
    testDate: { type: Date, required: true },
    txHash: { type: String },
  },
  { timestamps: true }
);

export const LabReport = mongoose.model<ILabReportDocument>("LabReport", LabReportSchema);
