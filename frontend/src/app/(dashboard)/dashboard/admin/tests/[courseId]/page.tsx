"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, ArrowLeft, PenTool, ExternalLink } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function AdminCourseQuizzesPage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${params.courseId}`);
        if (res.data.status === "success") {
          setCourse(res.data.course);
        }
        
        const modRes = await api.get(`/courses/${params.courseId}/lessons`);
        if (modRes.data.status === "success") {
          setModules(modRes.data.modules);
        }
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [params.courseId]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  // Flatten lessons and filter by type 'quiz'
  const quizLessons = modules.flatMap(m => m.lessons).filter(l => l.type === 'quiz' || l.type === 'Quiz');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard/admin/tests">
          <Button variant="outline" size="icon"><ArrowLeft size={16} /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary">
            Quizzes: {course?.title}
          </h1>
          <p className="text-foreground-secondary">Manage tests embedded in this course's curriculum.</p>
        </div>
      </div>

      <div className="space-y-4">
        {quizLessons.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-foreground-secondary">
            No quiz lessons found in this course. Add a Quiz lesson in the course curriculum first.
          </div>
        ) : (
          quizLessons.map((lesson) => (
            <Card key={lesson._id} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{lesson.title}</h3>
                  <p className="text-sm text-foreground-secondary">Manage questions for this test.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/admin/tests/${params.courseId}/quiz/${lesson._id}`}>
                  <Button leftIcon={<PenTool size={16} />}>
                    Manage Questions
                  </Button>
                </Link>
                {lesson.testId && (
                  <Link href={`/test/${lesson.testId}`} target="_blank">
                    <Button variant="outline" leftIcon={<ExternalLink size={16} />}>
                      Preview
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
