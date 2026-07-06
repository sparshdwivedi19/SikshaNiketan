import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db";
import authRoutes from "./src/routes/auth.routes";
import courseRoutes from "./src/routes/course.routes";
import userRoutes from "./src/routes/user.routes";
import enrollmentRoutes from "./src/routes/enrollment.routes";
import statsRoutes from "./src/routes/stats.routes";
import doubtRoutes from "./src/routes/doubt.routes";
import uploadRoutes from "./src/routes/upload.routes";

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many auth attempts, please try again later." },
});

app.use(generalLimiter);

// Database Connection
connectDB();

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/doubts", doubtRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Health Check
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is running perfectly!", timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: `Route ${req.originalUrl} not found.` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
