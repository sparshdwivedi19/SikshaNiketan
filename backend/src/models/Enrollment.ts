import mongoose, { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  progress: number; // 0-100
  completedLessons: mongoose.Types.ObjectId[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
