import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  password?: string;
  aadhaarHash?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["farmer", "processor", "lab", "certifier", "brand", "admin", "consumer"],
      required: true,
    },
    walletAddress: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    orgName: { type: String },
    location: { type: String },
    phone: { type: String },
    aadhaarHash: { type: String, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: any) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.virtual("fullProfile").get(function () {
  return `${this.name} (${this.role}) - ${this.orgName || "Indepent"}`;
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
