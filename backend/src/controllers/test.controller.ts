import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose from "mongoose";
import { CourseTest, QuestionType } from "../models/CourseTest";
import { Lesson } from "../models/Lesson";
import { Course } from "../models/Course";

// ─────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────

// Create a new test or get existing for a lesson
export const createOrGetTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;

    // Check if user owns the course
    const course = await Course.findOne({ _id: courseId, instructor: req.user?.id });
    if (!course && req.user?.role !== "admin") {
      res.status(403).json({ status: "error", message: "Not authorized to manage this course" });
      return;
    }

    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      res.status(404).json({ status: "error", message: "Lesson not found" });
      return;
    }

    // See if test already exists
    let test = await CourseTest.findOne({ courseId, lessonId });
    if (test) {
      res.status(200).json({ status: "success", test });
      return;
    }

    // Create new test
    test = new CourseTest({
      courseId,
      lessonId,
      title: `${lesson.title} - Quiz`,
      durationMinutes: 60,
      isPublished: false,
      questions: []
    });
    
    await test.save();

    // Link test to lesson
    lesson.testId = test._id as mongoose.Types.ObjectId;
    await lesson.save();

    res.status(201).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get test by lesson ID (public/student view - filters out correct answers if not attempt/admin)
export const getTestByLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const test = await CourseTest.findOne({ lessonId });
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // If student, they should only see published tests and shouldn't see correct answers
    if (req.user?.role === "student") {
      if (!test.isPublished) {
        res.status(403).json({ status: "error", message: "Test not published" });
        return;
      }
      // Remove correct answers from response
      const sanitizedTest = test.toObject();
      sanitizedTest.questions.forEach(q => {
        delete (q as any).correctAnswer;
        delete (q as any).explanation;
      });
      res.status(200).json({ status: "success", test: sanitizedTest });
      return;
    }

    // Faculty/Admin can see everything
    res.status(200).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get test by test ID directly (Public/Student view)
export const getTestById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const test = await CourseTest.findById(testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    if (req.user?.role === "student") {
      if (!test.isPublished) {
        res.status(403).json({ status: "error", message: "Test not published" });
        return;
      }
      const sanitizedTest = test.toObject();
      sanitizedTest.questions.forEach(q => {
        delete (q as any).correctAnswer;
        delete (q as any).explanation;
      });
      res.status(200).json({ status: "success", test: sanitizedTest });
      return;
    }

    res.status(200).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update test settings (title, duration, etc)
export const updateTestSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { title, description, durationMinutes, passingMarks, isPublished } = req.body;

    const test = await CourseTest.findById(testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Auth check
    const course = await Course.findById(test.courseId);
    if (!course || (course.instructor.toString() !== req.user?.id.toString() && req.user?.role !== "admin")) {
      res.status(403).json({ status: "error", message: "Not authorized" });
      return;
    }

    if (title) test.title = title;
    if (description !== undefined) test.description = description;
    if (durationMinutes) test.durationMinutes = durationMinutes;
    if (passingMarks !== undefined) test.passingMarks = passingMarks;
    if (isPublished !== undefined) test.isPublished = isPublished;

    await test.save();
    res.status(200).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────

// Add question
export const addQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const questionData = req.body;

    const test = await CourseTest.findById(testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Auth check
    const course = await Course.findById(test.courseId);
    if (!course || (course.instructor.toString() !== req.user?.id.toString() && req.user?.role !== "admin")) {
      res.status(403).json({ status: "error", message: "Not authorized" });
      return;
    }

    // Validate minimal required fields
    if (!questionData.type || !questionData.text || questionData.correctAnswer === undefined) {
      res.status(400).json({ status: "error", message: "Missing required fields" });
      return;
    }

    test.questions.push(questionData);
    await test.save();

    res.status(201).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update question
export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId, questionId } = req.params;
    const updateData = req.body;

    const test = await CourseTest.findById(testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Auth check
    const course = await Course.findById(test.courseId);
    if (!course || (course.instructor.toString() !== req.user?.id.toString() && req.user?.role !== "admin")) {
      res.status(403).json({ status: "error", message: "Not authorized" });
      return;
    }

    const questionIndex = test.questions.findIndex(q => q._id?.toString() === questionId);
    if (questionIndex === -1) {
      res.status(404).json({ status: "error", message: "Question not found" });
      return;
    }

    // Update fields
    const currentQ = test.questions[questionIndex];
    test.questions[questionIndex] = { ...(currentQ as any).toObject(), ...updateData };

    await test.save();
    res.status(200).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Delete question
export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId, questionId } = req.params;

    const test = await CourseTest.findById(testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Auth check
    const course = await Course.findById(test.courseId);
    if (!course || (course.instructor.toString() !== req.user?.id.toString() && req.user?.role !== "admin")) {
      res.status(403).json({ status: "error", message: "Not authorized" });
      return;
    }

    test.questions = test.questions.filter(q => q._id?.toString() !== questionId);
    await test.save();

    res.status(200).json({ status: "success", test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
