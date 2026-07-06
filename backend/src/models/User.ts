import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  STUDENT = "student",
  PARENT = "parent",
  TUTOR = "tutor",
  FACULTY = "faculty",
  ADMIN = "admin",
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
