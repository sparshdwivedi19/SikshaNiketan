import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, UserRole } from "./models/User";
import { Course } from "./models/Course";
import { CourseTest } from "./models/CourseTest";
import { Doubt } from "./models/Doubt";
import { Enrollment } from "./models/Enrollment";
import { Exam } from "./models/Exam";
import { Lesson } from "./models/Lesson";
import { Question } from "./models/Question";
import { TestAttempt } from "./models/TestAttempt";
import { Transaction } from "./models/Transaction";
import connectDB from "./config/db";

dotenv.config();

const cleanDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to DB. Starting cleanup...");

    // 1. Delete all users except admin
    const deletedUsers = await User.deleteMany({ role: { $ne: UserRole.ADMIN } });
    console.log(`Deleted ${deletedUsers.deletedCount} non-admin users.`);

    // 2. Delete all other collections entirely
    const deletedCourses = await Course.deleteMany({});
    console.log(`Deleted ${deletedCourses.deletedCount} courses.`);

    const deletedTests = await CourseTest.deleteMany({});
    console.log(`Deleted ${deletedTests.deletedCount} tests.`);

    const deletedDoubts = await Doubt.deleteMany({});
    console.log(`Deleted ${deletedDoubts.deletedCount} doubts.`);

    const deletedEnrollments = await Enrollment.deleteMany({});
    console.log(`Deleted ${deletedEnrollments.deletedCount} enrollments.`);

    const deletedExams = await Exam.deleteMany({});
    console.log(`Deleted ${deletedExams.deletedCount} legacy exams.`);

    const deletedLessons = await Lesson.deleteMany({});
    console.log(`Deleted ${deletedLessons.deletedCount} lessons.`);

    const deletedQuestions = await Question.deleteMany({});
    console.log(`Deleted ${deletedQuestions.deletedCount} legacy questions.`);

    const deletedTestAttempts = await TestAttempt.deleteMany({});
    console.log(`Deleted ${deletedTestAttempts.deletedCount} test attempts.`);

    const deletedTransactions = await Transaction.deleteMany({});
    console.log(`Deleted ${deletedTransactions.deletedCount} transactions.`);

    console.log("Database cleanup completed successfully! Admin users have been preserved.");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup error:", error);
    process.exit(1);
  }
};

cleanDatabase();
