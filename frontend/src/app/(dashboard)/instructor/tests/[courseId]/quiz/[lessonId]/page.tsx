"use client";

import { QuizBuilder } from "@/components/dashboard/QuizBuilder";

export default function InstructorQuizBuilderPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  return (
    <QuizBuilder 
      courseId={params.courseId} 
      lessonId={params.lessonId} 
      backUrl={`/instructor/tests/${params.courseId}`} 
    />
  );
}
