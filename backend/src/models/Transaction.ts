import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paymentGateway: "razorpay" | "stripe";
  gatewayTransactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { 
      type: String, 
      enum: ["pending", "success", "failed"], 
      default: "pending" 
    },
    paymentGateway: { 
      type: String, 
      enum: ["razorpay", "stripe"], 
      required: true 
    },
    gatewayTransactionId: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
