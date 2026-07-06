import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
  price: number;
  discountPrice?: number;
  instructor: mongoose.Types.ObjectId;
  duration: string;
  totalLessons: number;
  isPublished: boolean;
  ratings: {
    avg: number;
    count: number;
  };
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnail: { 
      type: String, 
      default: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=800"
    },
    category: { type: String, required: true },
    level: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    duration: { type: String, default: "0 hours" },
    totalLessons: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    ratings: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    enrollmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
