import mongoose, { Document, Schema } from "mongoose";

export interface IExam extends Document {
  title: string;
  description: string;
  category: "JEE Main" | "JEE Advanced" | "NEET" | "Foundation" | "Custom";
  durationMinutes: number;
  totalMarks: number;
  instructions: string;
  isPublished: boolean;
  sections: {
    name: string; // e.g., "Physics", "Chemistry", "Mathematics"
    totalQuestions: number;
    marksPerQuestion: number;
    negativeMarks: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["JEE Main", "JEE Advanced", "NEET", "Foundation", "Custom"],
      required: true 
    },
    durationMinutes: { type: Number, required: true, default: 180 }, // 3 hours default
    totalMarks: { type: Number, required: true },
    instructions: { type: String },
    isPublished: { type: Boolean, default: false },
    sections: [
      {
        name: { type: String, required: true },
        totalQuestions: { type: Number, required: true },
        marksPerQuestion: { type: Number, required: true, default: 4 },
        negativeMarks: { type: Number, required: true, default: 1 },
      }
    ],
  },
  { timestamps: true }
);

export const Exam = mongoose.model<IExam>("Exam", examSchema);
