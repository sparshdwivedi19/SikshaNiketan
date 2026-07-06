import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { protect, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cloudinary configuration
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Storage Strategy: Use Memory Storage if Cloudinary is enabled, else Disk Storage
const isCloudinaryConfigured = !!(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME);

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const storage = isCloudinaryConfigured ? multer.memoryStorage() : diskStorage;

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

// Helper to upload to Cloudinary via stream
const streamUploadToCloudinary = (buffer: Buffer, resourceType: "video" | "image" | "auto" = "auto"): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "shiksha-uploads" },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/v1/upload/video
router.post(
  "/video",
  protect,
  requireRole("faculty", "admin"),
  videoUpload.single("video"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No file uploaded." });
        return;
      }
      
      let fileUrl = "";
      if (isCloudinaryConfigured) {
        fileUrl = await streamUploadToCloudinary(req.file.buffer, "video");
      } else {
        fileUrl = `/uploads/videos/${req.file.filename}`;
      }
      
      res.status(200).json({ status: "success", url: fileUrl });
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
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No file uploaded." });
        return;
      }
      
      let fileUrl = "";
      if (isCloudinaryConfigured) {
        fileUrl = await streamUploadToCloudinary(req.file.buffer, "image");
      } else {
        fileUrl = `/uploads/images/${req.file.filename}`;
      }
      
      res.status(200).json({ status: "success", url: fileUrl });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
);

export default router;
