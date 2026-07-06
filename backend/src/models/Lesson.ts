import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleTitle: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "live";
  videoUrl?: string;
  duration: string;
  order: number;
  isPreview: boolean;
  resources: { title: string; url: string }[];
  quizQuestions?: {
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    moduleTitle: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["video", "pdf", "quiz", "live"], required: true },
    videoUrl: { type: String },
    duration: { type: String, default: "0:00" },
    order: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
    resources: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
    quizQuestions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
