import { Router } from "express";
import { enrollInCourse, getMyEnrollments, checkEnrollment, getCourseEnrollments } from "../controllers/enrollment.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, enrollInCourse);
router.get("/my", protect, getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);
router.get("/course/:courseId", protect, requireRole("admin", "faculty"), getCourseEnrollments);

export default router;
