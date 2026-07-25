import mongoose, { Document, Schema } from "mongoose";

export type QuestionType = "mcq-single" | "mcq-multiple" | "numerical" | "truefalse" | "subjective";
export type TestType = "unit" | "chapter" | "mock" | "practice" | "assignment" | "lesson_quiz";

export interface ICourseTest extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId; // Optional for course-level tests
  testType: TestType;
  title: string;
  description?: string;
  instructions?: string;
  durationMinutes: number;
  startDate?: Date;
  endDate?: Date;
  attemptsAllowed: number; // 0 for unlimited
  passingMarks?: number;
  randomizeQuestions: boolean;
  isPublished: boolean;
  questions: {
    _id?: mongoose.Types.ObjectId;
    type: QuestionType;
    text: string;
    options?: { id: string; text: string; }[];
    correctAnswer: string | string[];
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
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" }, // Now optional
    testType: { 
      type: String, 
      enum: ["unit", "chapter", "mock", "practice", "assignment", "lesson_quiz"],
      default: "lesson_quiz"
    },
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    durationMinutes: { type: Number, required: true, default: 60 },
    startDate: { type: Date },
    endDate: { type: Date },
    attemptsAllowed: { type: Number, default: 0 }, // 0 = unlimited
    passingMarks: { type: Number },
    randomizeQuestions: { type: Boolean, default: false },
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
        correctAnswer: { type: Schema.Types.Mixed, required: true },
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
