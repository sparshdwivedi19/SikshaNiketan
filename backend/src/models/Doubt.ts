import mongoose, { Document, Schema } from "mongoose";

export interface IDoubt extends Document {
  student: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "open" | "answered" | "closed";
  answer?: string;
  answeredBy?: mongoose.Types.ObjectId;
  answeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const doubtSchema = new Schema<IDoubt>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    answer: { type: String },
    answeredBy: { type: Schema.Types.ObjectId, ref: "User" },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model<IDoubt>("Doubt", doubtSchema);
