import mongoose, { Document, Schema } from "mongoose";

export interface ITestAttempt extends Document {
  testId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: {
    questionId: mongoose.Types.ObjectId;
    selectedAnswer?: string | string[]; // User's answer
    status: "answered" | "not_answered" | "marked" | "answered_marked" | "not_visited";
    marksObtained: number; // calculated after submission
  }[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  isPassed: boolean;
  status: "in_progress" | "submitted";
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testAttemptSchema = new Schema<ITestAttempt>(
  {
    testId: { type: Schema.Types.ObjectId, ref: "CourseTest", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        selectedAnswer: { type: Schema.Types.Mixed },
        status: { 
          type: String, 
          enum: ["answered", "not_answered", "marked", "answered_marked", "not_visited"],
          default: "not_visited"
        },
        marksObtained: { type: Number, default: 0 }
      }
    ],
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false },
    status: { type: String, enum: ["in_progress", "submitted"], default: "in_progress" },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date }
  },
  { timestamps: true }
);

export const TestAttempt = mongoose.model<ITestAttempt>("TestAttempt", testAttemptSchema);
