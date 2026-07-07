import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { CourseTest } from "../models/CourseTest";
import { TestAttempt } from "../models/TestAttempt";
import mongoose from "mongoose";

// Start a new test attempt
export const startAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const studentId = req.user?.id;

    const test = await CourseTest.findById(testId);
    if (!test || !test.isPublished) {
      res.status(404).json({ status: "error", message: "Test not found or not published" });
      return;
    }

    // Check if there's an ongoing attempt
    const ongoingAttempt = await TestAttempt.findOne({ testId, studentId, status: "in_progress" });
    if (ongoingAttempt) {
      res.status(200).json({ status: "success", attempt: ongoingAttempt });
      return;
    }

    // Initialize answers array
    const initialAnswers = test.questions.map(q => ({
      questionId: q._id as mongoose.Types.ObjectId,
      status: "not_visited" as const,
      marksObtained: 0
    }));

    const attempt = new TestAttempt({
      testId,
      courseId: test.courseId,
      studentId,
      answers: initialAnswers,
      status: "in_progress"
    });

    await attempt.save();

    res.status(201).json({ status: "success", attempt });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Sync attempt state (save answers periodically without submitting)
export const syncAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const studentId = req.user?.id;

    const attempt = await TestAttempt.findOne({ _id: attemptId, studentId, status: "in_progress" });
    if (!attempt) {
      res.status(404).json({ status: "error", message: "Ongoing attempt not found" });
      return;
    }

    // Only update provided answers
    if (answers && Array.isArray(answers)) {
      answers.forEach(newAns => {
        const existingAns = attempt.answers.find(a => a.questionId.toString() === newAns.questionId.toString());
        if (existingAns) {
          if (newAns.selectedAnswer !== undefined) existingAns.selectedAnswer = newAns.selectedAnswer;
          if (newAns.status) existingAns.status = newAns.status;
        }
      });
      await attempt.save();
    }

    res.status(200).json({ status: "success", attempt });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Submit test and calculate score
export const submitAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body; // Array of final answers
    const studentId = req.user?.id;

    const attempt = await TestAttempt.findOne({ _id: attemptId, studentId, status: "in_progress" });
    if (!attempt) {
      res.status(404).json({ status: "error", message: "Ongoing attempt not found" });
      return;
    }

    const test = await CourseTest.findById(attempt.testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Merge incoming final answers
    if (answers && Array.isArray(answers)) {
      answers.forEach(newAns => {
        const existingAns = attempt.answers.find(a => a.questionId.toString() === newAns.questionId.toString());
        if (existingAns) {
          if (newAns.selectedAnswer !== undefined) existingAns.selectedAnswer = newAns.selectedAnswer;
          if (newAns.status) existingAns.status = newAns.status;
        }
      });
    }

    // Calculate score
    let totalPossibleMarks = 0;
    let obtainedMarks = 0;

    attempt.answers.forEach(ans => {
      const question = test.questions.find(q => q._id?.toString() === ans.questionId.toString());
      if (!question) return;

      totalPossibleMarks += question.marks;

      if (!ans.selectedAnswer || (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length === 0)) {
        // Not answered
        ans.marksObtained = 0;
        if (ans.status !== "marked") ans.status = "not_answered";
        return;
      }

      // Check correctness
      let isCorrect = false;

      if (question.type === "mcq-multiple") {
        const correctArr = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        const selectedArr = Array.isArray(ans.selectedAnswer) ? ans.selectedAnswer : [ans.selectedAnswer];
        
        // Check if arrays contain exact same elements
        if (correctArr.length === selectedArr.length && correctArr.every(val => selectedArr.includes(val))) {
          isCorrect = true;
        }
      } else {
        // Single correct / numerical / true-false
        // For numerical, we might want to convert to float to compare, but string comparison is safer for now if stored correctly
        if (String(ans.selectedAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        ans.marksObtained = question.marks;
        obtainedMarks += question.marks;
      } else {
        ans.marksObtained = -question.negativeMarks;
        obtainedMarks -= question.negativeMarks;
      }
    });

    attempt.totalMarks = totalPossibleMarks;
    attempt.obtainedMarks = obtainedMarks;
    attempt.percentage = totalPossibleMarks > 0 ? (obtainedMarks / totalPossibleMarks) * 100 : 0;
    
    // Pass logic (if passingMarks is defined)
    if (test.passingMarks !== undefined && test.passingMarks > 0) {
      attempt.isPassed = obtainedMarks >= test.passingMarks;
    } else {
      // Default passing is 40%
      attempt.isPassed = attempt.percentage >= 40;
    }

    attempt.status = "submitted";
    attempt.submittedAt = new Date();

    await attempt.save();

    res.status(200).json({ status: "success", attempt });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get all attempts for a test by current user
export const getMyAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const studentId = req.user?.id;

    const attempts = await TestAttempt.find({ testId, studentId }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", attempts });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get details of a specific attempt
export const getAttemptDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user?.id;

    const attempt = await TestAttempt.findOne({ _id: attemptId, studentId });
    if (!attempt) {
      res.status(404).json({ status: "error", message: "Attempt not found" });
      return;
    }

    // Only allow viewing full details (with correct answers) if submitted
    if (attempt.status !== "submitted") {
      res.status(200).json({ status: "success", attempt });
      return;
    }

    // Fetch the test to include correct answers and explanations
    const test = await CourseTest.findById(attempt.testId);
    if (!test) {
      res.status(404).json({ status: "error", message: "Test not found" });
      return;
    }

    // Combine attempt data with test questions for easy rendering on frontend
    const detailedAnswers = attempt.answers.map(ans => {
      const q = test.questions.find(tq => tq._id?.toString() === ans.questionId.toString());
      return {
        ...(ans as any).toObject(),
        question: q
      };
    });

    res.status(200).json({ status: "success", attempt, detailedAnswers, test });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
