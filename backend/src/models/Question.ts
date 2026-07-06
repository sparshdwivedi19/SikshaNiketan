import mongoose, { Document, Schema } from "mongoose";

export type QuestionType = "mcq-single" | "mcq-multiple" | "integer" | "comprehension";

export interface IQuestion extends Document {
  examId: mongoose.Types.ObjectId;
  section: string; // Must match one of the sections in the Exam
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options?: {
    id: string; // e.g., "A", "B", "C", "D"
    text: string;
    imageUrl?: string;
  }[];
  correctAnswer: string | string[]; // For integer, it's string. For MCQ, it's option ID(s)
  solutionText?: string;
  solutionImageUrl?: string;
}

const questionSchema = new Schema<IQuestion>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    section: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["mcq-single", "mcq-multiple", "integer", "comprehension"], 
      required: true 
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    options: [
      {
        id: { type: String, required: true },
        text: { type: String },
        imageUrl: { type: String },
      }
    ],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    solutionText: { type: String },
    solutionImageUrl: { type: String },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>("Question", questionSchema);
