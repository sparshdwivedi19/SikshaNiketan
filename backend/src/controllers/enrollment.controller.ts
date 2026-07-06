import { Response } from "express";
import { Enrollment } from "../models/Enrollment";
import { Course } from "../models/Course";
import { AuthRequest } from "../middleware/auth.middleware";

// POST /api/v1/enrollments — Enroll the logged-in user in a course
export const enrollInCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found." });
      return;
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) {
      res.status(400).json({ status: "error", message: "You are already enrolled in this course." });
      return;
    }

    const enrollment = await Enrollment.create({ user: userId, course: courseId });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.status(201).json({ status: "success", enrollment });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/enrollments/my — Get logged-in user's enrollments
export const getMyEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const enrollments = await Enrollment.find({ user: userId })
      .populate("course", "title slug thumbnail instructor category level price discountPrice ratings enrollmentCount")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", count: enrollments.length, enrollments });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/enrollments/check/:courseId — Check if user is enrolled in a course
export const checkEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    res.status(200).json({ status: "success", isEnrolled: !!enrollment, enrollment });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/enrollments/course/:courseId — Get all students for a course (instructor/admin)
export const getCourseEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("user", "name email avatar createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", count: enrollments.length, enrollments });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
