import { Router } from "express";
import { getAllCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } from "../controllers/course.controller";
import { saveCurriculum } from "../controllers/lesson.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllCourses);
router.get("/:slug", getCourseBySlug);

// Protected routes
router.post("/", protect, requireRole("faculty", "admin"), createCourse);
router.post("/:courseId/lessons", protect, requireRole("faculty", "admin"), saveCurriculum);
router.put("/:id", protect, requireRole("faculty", "admin"), updateCourse);
router.delete("/:id", protect, requireRole("admin"), deleteCourse);

export default router;
