"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/utils/api";
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
              src={activeLesson.videoUrl} 
              controls 
              className="w-full h-full object-contain"
              autoPlay
            />
          )}

          {activeLesson.type === "quiz" && (
            <div className="w-full h-full bg-white dark:bg-background-secondary p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2"><HelpCircle className="text-brand-500" /> Quiz: {activeLesson.title}</h2>
                  <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-sm font-medium">
                    {activeLesson.quizQuestions?.length || 0} Questions
                  </span>
                </div>

                {!activeLesson.quizQuestions || activeLesson.quizQuestions.length === 0 ? (
                  <p className="text-foreground-secondary text-center py-10">No questions available for this quiz.</p>
                ) : (
                  <div className="space-y-8">
                    {activeLesson.quizQuestions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-foreground-primary mb-4">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-3">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = selectedOptions[qIndex] === optIndex;
                            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
                            
                            if (quizSubmitted) {
                              const isCorrect = q.correctOptionIndex === optIndex;
                              if (isCorrect) btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700";
                              else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";
                              else btnClass += "border-gray-200 dark:border-gray-700 opacity-50";
                            } else {
                              btnClass += isSelected ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700" : "border-gray-200 dark:border-gray-700 hover:border-brand-300";
                            }

                            return (
                              <button 
                                key={optIndex} 
                                disabled={quizSubmitted}
                                className={btnClass}
                                onClick={() => setSelectedOptions(prev => ({ ...prev, [qIndex]: optIndex }))}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="pt-6 border-t flex items-center justify-between">
                      {quizSubmitted ? (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="text-green-500" size={24} />
                          <span className="font-bold text-lg">Score: {quizScore} / {activeLesson.quizQuestions.length}</span>
                        </div>
                      ) : (
                        <Button onClick={handleQuizSubmit} className="ml-auto" disabled={Object.keys(selectedOptions).length < activeLesson.quizQuestions.length}>
                          Submit Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
