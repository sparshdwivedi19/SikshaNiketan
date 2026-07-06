import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect, requireRole } from "../middleware/auth.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const videoUpload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for MVP
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Not a video! Please upload only videos."));
    }
  },
});

const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."));
    }
  },
});

// POST /api/v1/upload/video
router.post(
  "/video",
  protect,
  requireRole("faculty", "admin"),
  videoUpload.single("video"),
  (req: AuthRequest, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No file uploaded." });
        return;
      }
      
      // Construct the URL to access the file
      // In production, this would be an S3 URL
      const fileUrl = `/uploads/videos/${req.file.filename}`;
      
      res.status(200).json({
        status: "success",
        url: fileUrl,
        size: req.file.size,
        filename: req.file.originalname
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
);

// POST /api/v1/upload/image
router.post(
  "/image",
  protect,
  requireRole("faculty", "admin"),
  imageUpload.single("image"),
  (req: AuthRequest, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No file uploaded." });
        return;
      }
      
      const fileUrl = `/uploads/videos/${req.file.filename}`; // reusing the same folder for MVP
      
      res.status(200).json({
        status: "success",
        url: fileUrl,
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
);

export default router;
