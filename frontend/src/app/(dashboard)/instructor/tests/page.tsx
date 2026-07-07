"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function TestManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        if (res.data.status === "success") {
          setCourses(res.data.courses);
        }
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-foreground-secondary">Loading courses...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">
          Test Management
        </h1>
        <p className="text-foreground-secondary">Manage quizzes and tests for your courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="p-5 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-foreground-secondary">Manage tests for this course.</p>
            </div>
            
            <div className="mt-auto">
              <Link href={`/instructor/tests/${course._id}`}>
                <Button className="w-full" rightIcon={<ArrowRight size={16} />}>
                  View Quizzes
                </Button>
              </Link>
            </div>
          </Card>
        ))}
        
        {courses.length === 0 && (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-foreground-secondary">
            No courses found. Create a course first to add tests.
          </div>
        )}
      </div>
    </div>
  );
}
