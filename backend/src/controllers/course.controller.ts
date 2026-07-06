import { Request, Response } from "express";
import { Course } from "../models/Course";
import { Lesson } from "../models/Lesson";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/v1/courses — Get all published courses (or all for admin)
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level } = req.query;
    const authReq = req as AuthRequest;

    // Admins can see all courses; public only sees published
    const query: Record<string, any> = authReq.user?.role === "admin" ? {} : { isPublished: true };

    if (category) query.category = new RegExp(String(category), "i");
    if (level) query.level = level;

    const courses = await Course.find(query)
      .populate("instructor", "name avatar")
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", count: courses.length, courses });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/courses/:slug — Get single course by slug
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).populate("instructor", "name avatar");

    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found." });
      return;
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });

    res.status(200).json({ status: "success", course, lessons });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// POST /api/v1/courses — Create a new course
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Auto-assign instructor to the logged-in user if not admin
    if (req.user?.role !== "admin" && !req.body.instructor) {
      req.body.instructor = req.user!.id;
    }

    const course = await Course.create(req.body);
    const populated = await course.populate("instructor", "name avatar");
    res.status(201).json({ status: "success", course: populated });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// PUT /api/v1/courses/:id — Update a course
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate("instructor", "name");
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found." });
      return;
    }
    res.status(200).json({ status: "success", course });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// DELETE /api/v1/courses/:id — Delete a course and its lessons
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found." });
      return;
    }
    await Lesson.deleteMany({ courseId: id });
    res.status(200).json({ status: "success", message: "Course and all related lessons deleted successfully." });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
