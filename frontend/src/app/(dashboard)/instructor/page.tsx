"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, BookOpen, IndianRupee, TrendingUp, Plus, PlayCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";
import api from "@/utils/api";

interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  courses: Array<{
    _id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number;
    enrollmentCount: number;
    isPublished: boolean;
    ratings: { avg: number; count: number };
  }>;
}

// Placeholder monthly chart data (in production would be aggregated from transactions)
const revenueData = [
  { name: "Jan", revenue: 0 },
  { name: "Feb", revenue: 0 },
  { name: "Mar", revenue: 0 },
  { name: "Apr", revenue: 0 },
  { name: "May", revenue: 0 },
  { name: "Jun", revenue: 0 },
];

export default function InstructorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/instructor");
      if (response.data.status === "success") {
        setStats(response.data.stats);
        // We leave revenueData empty until a real transactional trend API is added for instructors.
        revenueData.forEach(d => {
          d.revenue = 0;
        });
      }
    } catch (error) {
      console.error("Failed to fetch instructor stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Instructor Dashboard</h1>
          <p className="text-foreground-secondary">Monitor your courses, students, and performance.</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button rightIcon={<Plus size={18} />}>Create New Course</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <IndianRupee size={16} className="text-brand-500" /> Total Revenue
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            ₹{isLoading ? "—" : (stats?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">Based on enrollments</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <Users size={16} className="text-purple-500" /> Total Students
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : stats?.totalStudents || 0}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">Enrolled in your courses</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <BookOpen size={16} className="text-blue-500" /> Published Courses
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : stats?.publishedCourses || 0}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">
            {isLoading ? "—" : (stats?.totalCourses || 0) - (stats?.publishedCourses || 0)} in draft
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <TrendingUp size={16} className="text-green-500" /> Avg. Rating
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : stats?.avgRating || "N/A"}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">Across all courses</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-xl font-bold font-heading text-foreground-primary mb-6">Revenue Analytics</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <RechartsTooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold font-heading text-foreground-primary">My Courses</h3>
            <Link href="/instructor/courses" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                ))}
              </div>
            ) : stats?.courses?.length ? (
              stats.courses.slice(0, 3).map((course) => (
                <Link href={`/courses/${course.slug}`} key={course._id}>
                  <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer">
                    <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center shrink-0">
                      <PlayCircle className="text-gray-800 group-hover:text-brand-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground-primary group-hover:text-brand-600 transition-colors line-clamp-1">{course.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-foreground-secondary">
                        <span>₹{(course.discountPrice || course.price).toLocaleString()}</span>
                        <span>•</span>
                        <span>{course.enrollmentCount} Students</span>
                        {!course.isPublished && <span className="text-amber-500 font-bold">Draft</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <BookOpen size={32} className="text-gray-700 mb-3" />
                <p className="text-sm text-foreground-secondary">No courses yet.</p>
                <Link href="/instructor/courses/create" className="mt-3">
                  <Button variant="outline" size="sm">Create First Course</Button>
                </Link>
              </div>
            )}
          </div>
          {(stats?.courses?.length || 0) > 3 && (
            <Link href="/instructor/courses">
              <Button variant="outline" className="w-full mt-4">View All Courses</Button>
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
