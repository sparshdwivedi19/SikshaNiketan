import { Request, Response } from "express";
import { Lesson } from "../models/Lesson";
import { Course } from "../models/Course";
import { AuthRequest } from "../middleware/auth.middleware";

export const saveCurriculum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { modules } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found." });
      return;
    }

    // Verify ownership or admin
    if (course.instructor.toString() !== req.user?.id && req.user?.role !== "admin") {
      res.status(403).json({ status: "error", message: "Not authorized to modify this course." });
      return;
    }

    // First, clear existing lessons for this course to replace with the new curriculum
    await Lesson.deleteMany({ courseId });

    const newLessons = [];
    let globalOrder = 1;

    for (const module of modules) {
      for (const lesson of module.lessons) {
        newLessons.push({
          courseId,
          moduleTitle: module.title,
          title: lesson.title,
          type: lesson.type.toLowerCase() === "video" ? "video" : "quiz",
          videoUrl: lesson.videoUrl, // this will be the URL returned from /upload/video
          duration: lesson.size || "0 mins", // reusing the size field from frontend as duration for MVP
          quizQuestions: lesson.quizQuestions || [],
          order: globalOrder++,
        });
      }
    }

    const createdLessons = await Lesson.insertMany(newLessons);
    
    // Update course total lessons count
    course.totalLessons = createdLessons.length;
    // Set published to true if there are lessons, else false (or let user decide, but we'll leave it as is, just update count)
    await course.save();

    res.status(200).json({ status: "success", count: createdLessons.length, lessons: createdLessons });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
