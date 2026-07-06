"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, Clock, Users, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

interface Enrollment {
  _id: string;
  progress: number;
  enrolledAt: string;
  course: {
    _id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    category: string;
    level: string;
    instructor: { name: string };
    totalLessons: number;
    duration: string;
    enrollmentCount: number;
  };
}

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get("/enrollments/my");
        if (response.data.status === "success") {
          setEnrollments(response.data.enrollments);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">My Courses</h1>
          <p className="text-foreground-secondary">
            {isLoading ? "Loading..." : `${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>
        <Link href="/courses">
          <Button rightIcon={<ArrowRight size={18} />}>Browse More Courses</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment._id} className="group overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                <BookOpen size={48} className="text-brand-500 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play size={22} className="text-brand-600 fill-brand-600 ml-1" />
                  </div>
                </button>
              </div>

              <div className="p-5">
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md">
                  {enrollment.course.category}
                </span>
                <h3 className="font-bold text-lg text-foreground-primary mt-3 mb-2 line-clamp-2 leading-tight">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  By {enrollment.course.instructor?.name || "Shiksha Niketan"}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-foreground-secondary mb-1.5">
                    <span>{enrollment.progress}% Complete</span>
                    <span className="flex items-center gap-1">
                      {enrollment.progress === 100 && <CheckCircle2 size={12} className="text-green-500" />}
                      {enrollment.progress === 100 ? "Completed!" : "In Progress"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        enrollment.progress === 100 ? "bg-green-500" : "bg-brand-500"
                      }`}
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {enrollment.course.duration || "Self-paced"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {enrollment.course.enrollmentCount || 0} students
                  </span>
                </div>

                <Link href={`/dashboard/student/courses/${enrollment.course.slug}/learn`}>
                  <Button className="w-full" variant={enrollment.progress > 0 ? "primary" : "outline"}>
                    {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-6">
            <BookOpen size={40} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground-primary mb-2">No Courses Yet</h2>
          <p className="text-foreground-secondary max-w-md mb-8">
            You haven't enrolled in any courses. Browse our catalog to find your perfect course.
          </p>
          <Link href="/courses">
            <Button size="lg" rightIcon={<ArrowRight size={18} />}>Explore Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
