"use client";

import { QuizBuilder } from "@/components/dashboard/QuizBuilder";

export default function AdminQuizBuilderPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  return (
    <QuizBuilder 
      courseId={params.courseId} 
      lessonId={params.lessonId} 
      backUrl={`/dashboard/admin/tests/${params.courseId}`} 
    />
  );
}
