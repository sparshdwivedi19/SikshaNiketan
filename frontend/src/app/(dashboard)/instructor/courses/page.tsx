"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "@/utils/api";

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  discountPrice?: number;
  enrollmentCount: number;
  isPublished: boolean;
  instructor: { name: string };
  ratings: { avg: number; count: number };
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const statsRes = await api.get("/stats/instructor");
      if (statsRes.data.status === "success") {
        setCourses(statsRes.data.stats.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load your courses.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This cannot be undone.`)) return;
    setDeletingId(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success(`"${courseTitle}" has been deleted.`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">My Courses</h1>
          <p className="text-foreground-secondary">
            {isLoading ? "Loading..." : `${courses.length} course${courses.length !== 1 ? "s" : ""} in your catalog`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchCourses} leftIcon={<RefreshCw size={16} />}>Refresh</Button>
          <Link href="/instructor/courses/create">
            <Button rightIcon={<Plus size={18} />}>Create New Course</Button>
          </Link>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 flex gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-foreground-secondary bg-gray-50/50 dark:bg-gray-800/30">
                <th className="p-4 font-medium">Course Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Students</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="p-4 font-bold text-sm text-foreground-primary group-hover:text-brand-600 transition-colors max-w-xs">
                      <span className="line-clamp-2">{course.title}</span>
                    </td>
                    <td className="p-4 text-sm text-foreground-secondary">{course.category}</td>
                    <td className="p-4 text-sm text-foreground-secondary">{course.enrollmentCount || 0}</td>
                    <td className="p-4 text-sm font-medium text-green-600">
                      ₹{(course.discountPrice || course.price).toLocaleString()}
                      {course.discountPrice && (
                        <span className="text-xs text-foreground-secondary line-through ml-1">₹{course.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        course.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                      }`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/courses/${course.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/instructor/courses/create?edit=${course._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-brand-600">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          isLoading={deletingId === course._id}
                          onClick={() => handleDelete(course._id, course.title)}
                        >
                          {deletingId !== course._id && <Trash2 size={16} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-foreground-secondary">
                    {searchQuery ? `No courses found for "${searchQuery}".` : (
                      <div>
                        <p className="mb-4">You haven't created any courses yet.</p>
                        <Link href="/instructor/courses/create">
                          <Button leftIcon={<Plus size={16} />}>Create Your First Course</Button>
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
