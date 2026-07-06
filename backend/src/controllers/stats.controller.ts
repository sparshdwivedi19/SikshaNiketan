import { Response } from "express";
import { User, UserRole } from "../models/User";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Enrollment";
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
