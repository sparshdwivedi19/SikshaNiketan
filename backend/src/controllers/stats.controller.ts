import { Response } from "express";
import { User, UserRole } from "../models/User";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Enrollment";
import { Transaction } from "../models/Transaction";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/v1/stats/admin — Platform-wide stats for admin dashboard
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalParents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "student" as UserRole }),
      User.countDocuments({ role: "faculty" as UserRole }),
      User.countDocuments({ role: "parent" as UserRole }),
      Course.countDocuments({}),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments({}),
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Aggregate Revenue
    const revenueResult = await Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Latest Enrollments
    const latestEnrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email avatar")
      .populate("course", "title price");

    // Pending Payments
    const pendingPayments = await Transaction.countDocuments({ status: "pending" });

    // Active Students (Students with at least one enrollment)
    const activeStudentsResult = await Enrollment.distinct("user");
    const activeStudents = activeStudentsResult.length;

    // Monthly enrollment trends — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const enrollmentTrend = monthlyEnrollments.map((m) => ({
      month: monthNames[m._id.month - 1],
      enrollments: m.count,
    }));

    // Popular courses (top 5 by enrollmentCount)
    const popularCourses = await Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .select("title enrollmentCount ratings thumbnail")
      .populate("instructor", "name");

    res.status(200).json({
      status: "success",
      stats: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalParents,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        recentUsers,
        totalRevenue,
        latestEnrollments,
        pendingPayments,
        activeStudents,
        enrollmentTrend,
        popularCourses,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/stats/instructor — Stats for the logged-in instructor
export const getInstructorStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.user!.id;

    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    const [totalStudents, totalEnrollments] = await Promise.all([
      Enrollment.distinct("user", { course: { $in: courseIds } }),
      Enrollment.countDocuments({ course: { $in: courseIds } }),
    ]);

    const totalRevenue = courses.reduce((sum, course) => {
      const price = course.discountPrice || course.price;
      return sum + price * (course.enrollmentCount || 0);
    }, 0);

    const avgRating = courses.length
      ? courses.reduce((sum, c) => sum + (c.ratings?.avg || 0), 0) / courses.length
      : 0;

    res.status(200).json({
      status: "success",
      stats: {
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.isPublished).length,
        totalStudents: totalStudents.length,
        totalEnrollments,
        totalRevenue,
        avgRating: parseFloat(avgRating.toFixed(1)),
        courses,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/stats/leaderboard — Top students by enrollment count
export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leaderboard = await Enrollment.aggregate([
      { $group: { _id: "$user", enrollmentCount: { $sum: 1 } } },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          avatar: "$user.avatar",
          enrollmentCount: 1,
        },
      },
    ]);

    res.status(200).json({ status: "success", leaderboard });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
