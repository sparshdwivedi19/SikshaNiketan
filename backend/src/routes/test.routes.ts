import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.middleware";
import { 
  createOrGetTest, 
  getTestByLesson, 
  getTestById,
  updateTestSettings,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  createCourseTest,
  getCourseTests,
  deleteTest
} from "../controllers/test.controller";
import { 
  startAttempt,
  syncAttempt,
  submitAttempt,
  getMyAttempts,
  getAttemptDetails
} from "../controllers/testAttempt.controller";

const router = Router();

// Test Management (Faculty/Admin)
router.post("/course/:courseId", protect, requireRole("instructor", "admin"), createCourseTest);
router.post("/lesson/:courseId/:lessonId", protect, requireRole("instructor", "admin"), createOrGetTest);
router.put("/:testId", protect, requireRole("instructor", "admin"), updateTestSettings);
router.delete("/:testId", protect, requireRole("instructor", "admin"), deleteTest);

// Get tests for a course
router.get("/course/:courseId", protect, getCourseTests);

// Question Management (Faculty/Admin)
router.post("/:testId/questions", protect, requireRole("instructor", "admin"), addQuestion);
router.put("/:testId/questions/:questionId", protect, requireRole("instructor", "admin"), updateQuestion);
router.delete("/:testId/questions/:questionId", protect, requireRole("instructor", "admin"), deleteQuestion);

// Get test for taking (Student/Public)
router.get("/lesson/:lessonId", protect, getTestByLesson);
router.get("/:testId", protect, getTestById);

// Test Attempts (Student)
router.post("/:testId/attempt/start", protect, startAttempt);
router.put("/attempt/:attemptId/sync", protect, syncAttempt);
router.post("/attempt/:attemptId/submit", protect, submitAttempt);
router.get("/:testId/attempts/me", protect, getMyAttempts);
router.get("/attempt/:attemptId", protect, getAttemptDetails);

export default router;
