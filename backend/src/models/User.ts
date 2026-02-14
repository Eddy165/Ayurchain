import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserRole, KYCStatus } from "../types";

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    kycStatus: {
      type: String,
      enum: Object.values(KYCStatus),
      default: KYCStatus.PENDING,
    },
    walletAddress: { type: String },
    languages: { type: [String], default: ["en"] },
    organization: { type: String },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    passwordHash: { type: String, required: true, select: false },
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUserDocument>("User", UserSchema);
