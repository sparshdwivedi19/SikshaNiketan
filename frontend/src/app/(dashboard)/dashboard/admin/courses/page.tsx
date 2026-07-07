"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Edit2, Play, Users, Clock, Filter, Eye, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

import api, { API_BASE_URL } from "@/utils/api";

interface Course {
  _id: string;
  title: string;
  slug: string;
  instructor: { name: string; avatar?: string };
  price: number;
  discountPrice: number;
  isPublished: boolean;
  studentsCount?: number;
  rating?: number;
  thumbnail?: string;
}

export default function AllCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        if (response.data.status === "success") {
          setCourses(response.data.courses);
        }
      } catch (error) {
        toast.error("Failed to load courses from database.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (course.instructor && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This cannot be undone.`)) return;
    
    setDeletingId(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c._id !== courseId));
      toast.success(`"${courseTitle}" has been deleted.`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAction = (action: string, courseTitle: string) => {
    toast.success(`${action} action triggered for ${courseTitle}.`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">
            Global Course Catalog
          </h1>
          <p className="text-foreground-secondary">Monitor and manage all courses across the platform.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Filter size={18} />} onClick={() => toast.success("Filters panel opened.")}>Filters</Button>
          <Link href="/dashboard/admin/courses/create">
            <Button>Create Global Course</Button>
          </Link>
        </div>
      </div>

      <Card className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
        <div className="w-full max-w-md">
          <Input 
            placeholder="Search courses by title or instructor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2 text-sm text-foreground-secondary">
          <span className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg font-medium border border-brand-100 dark:border-brand-900/30">Total Courses: {courses.length}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-foreground-secondary">
            Loading courses from database...
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course._id} className="group flex flex-col bg-white dark:bg-background-secondary border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.thumbnail ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${API_BASE_URL}${course.thumbnail}`) : `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg backdrop-blur-md ${
                    course.isPublished ? 'bg-green-500/90 text-white' : 
                    'bg-amber-500/90 text-white'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold font-heading text-lg text-foreground-primary mb-2 line-clamp-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-foreground-secondary mb-4 flex-grow">
                  By {course.instructor ? course.instructor.name : 'Unknown Instructor'}
                </p>

                <div className="flex items-center justify-between text-xs text-foreground-secondary font-medium mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                    <Users size={14} className="text-brand-500" /> {course.studentsCount || 0}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                    <span className="text-yellow-500">★</span> {course.rating || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Edit2 size={14} />} onClick={() => handleAction("edit", course.title)}>Edit</Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-10 p-0 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500" 
                  isLoading={deletingId === course._id}
                  onClick={() => handleDelete(course._id, course.title)}
                >
                  {deletingId !== course._id && <Trash2 size={14} />}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-foreground-secondary">
            No courses found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More Courses</Button>
      </div>
    </div>
  );
}
