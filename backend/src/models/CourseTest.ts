import mongoose, { Document, Schema } from "mongoose";

export type QuestionType = "mcq-single" | "mcq-multiple" | "numerical" | "truefalse" | "subjective";

export interface ICourseTest extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  durationMinutes: number;
  passingMarks?: number;
  isPublished: boolean;
  questions: {
    _id?: mongoose.Types.ObjectId;
    type: QuestionType;
    text: string;
    options?: { id: string; text: string; }[];
    correctAnswer: string | string[]; // Single string for mcq-single/numerical/truefalse, array for mcq-multiple
    marks: number;
    negativeMarks: number;
    explanation?: string;
    difficulty: "easy" | "medium" | "hard";
    topic?: string;
    imageUrl?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const courseTestSchema = new Schema<ICourseTest>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    title: { type: String, required: true },
    description: { type: String },
    durationMinutes: { type: Number, required: true, default: 60 },
    passingMarks: { type: Number },
    isPublished: { type: Boolean, default: false },
    questions: [
      {
        type: { 
          type: String, 
          enum: ["mcq-single", "mcq-multiple", "numerical", "truefalse", "subjective"], 
          required: true 
        },
        text: { type: String, required: true },
        options: [
          {
            id: { type: String, required: true },
            text: { type: String, required: true }
          }
        ],
        correctAnswer: { type: Schema.Types.Mixed, required: true }, // Mixed because it can be string or string array
        marks: { type: Number, required: true, default: 4 },
        negativeMarks: { type: Number, required: true, default: 0 },
        explanation: { type: String },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
        topic: { type: String },
        imageUrl: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const CourseTest = mongoose.model<ICourseTest>("CourseTest", courseTestSchema);
