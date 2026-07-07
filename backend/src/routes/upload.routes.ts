import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { protect, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ─────────────────────────────────────────────────────────
// Ensure upload directories exist (local dev only)
// ─────────────────────────────────────────────────────────
const videosDir = path.join(process.cwd(), "public", "uploads", "videos");
const imagesDir = path.join(process.cwd(), "public", "uploads", "images");

if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// ─────────────────────────────────────────────────────────
// Cloudinary configuration (used in production / Vercel)
// ─────────────────────────────────────────────────────────
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_URL ||
  process.env.CLOUDINARY_CLOUD_NAME
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ─────────────────────────────────────────────────────────
// Disk storage — separate destinations per media type
// ─────────────────────────────────────────────────────────
const videoDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, videosDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// When Cloudinary is configured, buffer files in memory; else write to disk
const videoStorage = isCloudinaryConfigured ? multer.memoryStorage() : videoDiskStorage;
const imageStorage = isCloudinaryConfigured ? multer.memoryStorage() : imageDiskStorage;

// ─────────────────────────────────────────────────────────
// Multer instances
// ─────────────────────────────────────────────────────────
const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed."));
    }
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// ─────────────────────────────────────────────────────────
// Helper: stream buffer → Cloudinary
// ─────────────────────────────────────────────────────────
const streamToCloudinary = (
  buffer: Buffer,
  resourceType: "video" | "image" | "auto" = "auto",
  folder = "shiksha-uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// ─────────────────────────────────────────────────────────
// POST /api/v1/upload/video
// ─────────────────────────────────────────────────────────
router.post(
  "/video",
  protect,
  requireRole("faculty", "admin"),
  videoUpload.single("video"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No video file received." });
        return;
      }

      let fileUrl: string;

      if (isCloudinaryConfigured) {
        // Production: upload to Cloudinary, returns a CDN URL
        fileUrl = await streamToCloudinary(req.file.buffer, "video");
      } else {
        // Local dev: file is already on disk, return relative path
        fileUrl = `/uploads/videos/${req.file.filename}`;
      }

      res.status(200).json({ status: "success", url: fileUrl });
    } catch (error: any) {
      console.error("[Upload Video Error]", error);
      res.status(500).json({ status: "error", message: error.message ?? "Video upload failed." });
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /api/v1/upload/image
// ─────────────────────────────────────────────────────────
router.post(
  "/image",
  protect,
  requireRole("faculty", "admin"),
  imageUpload.single("image"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ status: "error", message: "No image file received." });
        return;
      }

      let fileUrl: string;

      if (isCloudinaryConfigured) {
        // Production: upload to Cloudinary
        fileUrl = await streamToCloudinary(req.file.buffer, "image");
      } else {
        // Local dev: file is already on disk, return relative path
        fileUrl = `/uploads/images/${req.file.filename}`;
      }

      res.status(200).json({ status: "success", url: fileUrl });
    } catch (error: any) {
      console.error("[Upload Image Error]", error);
      res.status(500).json({ status: "error", message: error.message ?? "Image upload failed." });
    }
  }
);

export default router;
