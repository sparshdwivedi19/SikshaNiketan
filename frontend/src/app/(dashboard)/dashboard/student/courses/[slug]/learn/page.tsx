"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import api, { API_BASE_URL } from "@/utils/api";
import { toast } from "react-hot-toast";

interface Lesson {
  _id: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "live";
  videoUrl?: string;
  duration?: string;
  moduleTitle: string;
  quizQuestions?: { question: string; options: string[]; correctOptionIndex: number }[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function CoursePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [unwrappedParams.slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${unwrappedParams.slug}`);
      if (res.data.status === "success") {
        setCourse(res.data.course);
        setLessons(res.data.lessons || []);
        if (res.data.lessons?.length > 0) {
          setActiveLesson(res.data.lessons[0]);
          setExpandedModules({ [res.data.lessons[0].moduleTitle]: true });
        }
      }
    } catch (err) {
      toast.error("Failed to load course materials");
      router.push("/dashboard/student/courses");
    } finally {
      setLoading(false);
    }
  };

  // Group lessons by moduleTitle
  const modules = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.moduleTitle]) acc[lesson.moduleTitle] = [];
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleTitle]: !prev[moduleTitle] }));
  };

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    // reset quiz state
    setCurrentQuizIndex(0);
    setSelectedOptions({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleQuizSubmit = () => {
    if (!activeLesson?.quizQuestions) return;
    let score = 0;
    activeLesson.quizQuestions.forEach((q, i) => {
      if (selectedOptions[i] === q.correctOptionIndex) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Course content not found</h2>
        <Button onClick={() => router.push("/dashboard/student/courses")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      
      {/* Left side: Player/Viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4">
          <Button variant="ghost" className="mb-2 p-0 h-auto hover:bg-transparent text-foreground-secondary hover:text-brand-600" onClick={() => router.push("/dashboard/student/courses")}>
            <ArrowLeft size={16} className="mr-2" /> Back to My Courses
          </Button>
          <h1 className="text-2xl font-bold font-heading text-foreground-primary truncate">{activeLesson.title}</h1>
          <p className="text-sm text-foreground-secondary">{course.title}</p>
        </div>

        <Card className="w-full flex-1 bg-black overflow-hidden flex flex-col rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
          {activeLesson.type === "video" && activeLesson.videoUrl && (
            <video 
              key={activeLesson._id}
              src={activeLesson.videoUrl.startsWith('http') ? activeLesson.videoUrl : `${API_BASE_URL}${activeLesson.videoUrl}`} 
              controls 
              className="w-full h-full object-contain"
              autoPlay
              crossOrigin="anonymous"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {activeLesson.type === "quiz" && (
            <div className="w-full h-full bg-white dark:bg-background-secondary p-8 flex flex-col items-center justify-center text-center">
              <HelpCircle size={64} className="text-brand-500 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Quiz: {activeLesson.title}</h2>
              <p className="text-foreground-secondary mb-8 max-w-md">
                This lesson contains a Computer-Based Test (CBT). Click the button below to start your test session in a focused environment.
              </p>
              {activeLesson.testId ? (
                <Link href={`/test/${activeLesson.testId}`} target="_blank">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-105 transition-transform">
                    Start Test Now
                  </Button>
                </Link>
              ) : (
                <div className="bg-orange-50 text-orange-600 p-4 rounded-xl border border-orange-200">
                  <p className="font-bold">Test not yet configured.</p>
                  <p className="text-sm">The instructor has not added questions for this test yet.</p>
                </div>
              )}
            </div>
          )}

          {activeLesson.type === "video" && !activeLesson.videoUrl && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.277A1 1 0 0121 8.617V15.38a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">Video Not Available</h3>
              <p className="text-sm">The video for this lesson hasn&apos;t been uploaded yet.</p>
            </div>
          )}

          {activeLesson.type !== "video" && activeLesson.type !== "quiz" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-foreground-secondary p-8 text-center">
              <FileText size={64} className="mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2">Unsupported Media Type</h3>
              <p>This lesson type ({activeLesson.type}) is currently being viewed outside the main player or requires a download.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Right side: Curriculum Navigation */}
      <div className="w-full md:w-80 flex flex-col min-w-0">
        <h3 className="font-bold font-heading text-lg mb-4">Course Content</h3>
        <Card className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary shadow-sm">
          {Object.entries(modules).map(([moduleTitle, moduleLessons], mIndex) => (
            <div key={mIndex} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
              <button 
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left font-medium"
                onClick={() => toggleModule(moduleTitle)}
              >
                <span className="text-sm">{moduleTitle}</span>
                {expandedModules[moduleTitle] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedModules[moduleTitle] && (
                <div className="py-2">
                  {moduleLessons.map((l, lIndex) => {
                    const isActive = activeLesson._id === l._id;
                    return (
                      <button 
                        key={l._id}
                        onClick={() => handleLessonClick(l)}
                        className={`w-full flex items-start gap-3 p-3 pl-4 text-left transition-colors ${
                          isActive ? "bg-brand-50 dark:bg-brand-900/20 border-l-2 border-brand-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-2 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {l.type === "video" ? <PlayCircle size={16} className={isActive ? "text-brand-600" : "text-gray-400"} /> : 
                           l.type === "quiz" ? <HelpCircle size={16} className={isActive ? "text-brand-600" : "text-gray-400"} /> : 
                           <FileText size={16} className={isActive ? "text-brand-600" : "text-gray-400"} />}
                        </div>
                        <div>
                          <p className={`text-sm ${isActive ? "font-bold text-brand-700 dark:text-brand-400" : "font-medium text-foreground-primary"}`}>
                            {lIndex + 1}. {l.title}
                          </p>
                          <p className="text-xs text-foreground-secondary mt-1 flex items-center gap-2">
                            <span>{l.type === "video" ? l.duration || "0:00" : l.type === "quiz" ? "Interactive Quiz" : "Document"}</span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
