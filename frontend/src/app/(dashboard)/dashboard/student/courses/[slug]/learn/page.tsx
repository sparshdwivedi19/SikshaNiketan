"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle, ChevronDown, BookOpen, Clock, BrainCircuit, ShieldCheck, Sparkles, Send } from "lucide-react";
import api, { API_BASE_URL } from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

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
  const [activeTab, setActiveTab] = useState<"curriculum" | "doubts">("curriculum");
  const [doubtText, setDoubtText] = useState("");
  const [submittedDoubt, setSubmittedDoubt] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [unwrappedParams.slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${unwrappedParams.slug}`);
      if (res.data.status === "success") {
        const courseData = res.data.course;
        setCourse(courseData);
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

  const modules = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.moduleTitle]) acc[lesson.moduleTitle] = [];
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleTitle]: !prev[moduleTitle] }));
  };

  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText) return;
    setSubmittedDoubt(true);
    toast.success("Doubt submitted to AI Co-Pilot & Faculty!");
    setTimeout(() => {
      setDoubtText("");
      setSubmittedDoubt(false);
    }, 2000);
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen pt-28 text-white flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-300 text-sm font-semibold">Opening Theater Player...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Link href="/dashboard/student/courses" className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft size={18} /> Back to My Courses
          </Link>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            {course.title}
          </span>
        </div>

        {/* Theater Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Video Viewport */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative w-full aspect-video rounded-3xl bg-slate-950 border border-white/15 overflow-hidden shadow-2xl shadow-indigo-500/10">
              {activeLesson?.videoUrl ? (
                <iframe
                  src={activeLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={activeLesson.title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-slate-950 via-indigo-950/40 to-slate-950 text-center">
                  <PlayCircle size={64} className="text-indigo-400 mb-4 animate-pulse" />
                  <h3 className="text-2xl font-black text-white mb-2">{activeLesson?.title || "Select a Lesson"}</h3>
                  <p className="text-slate-300 text-xs max-w-sm">Interactive HD video stream with transcript and smart note taking.</p>
                </div>
              )}
            </div>

            {/* Video Meta Details */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl backdrop-blur-xl">
              <h2 className="text-2xl font-black text-white mb-2">{activeLesson?.title || "Rotational Dynamics — Lecture 04"}</h2>
              <p className="text-xs text-slate-300 font-semibold mb-4">Module: {activeLesson?.moduleTitle || "Physics Core"}</p>

              {/* Doubt / Note Switcher Tabs */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                <button
                  onClick={() => setActiveTab("curriculum")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "curriculum" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Lesson Details
                </button>
                <button
                  onClick={() => setActiveTab("doubts")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "doubts" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <BrainCircuit size={14} className="text-cyan-400" /> Ask AI Assistant
                </button>
              </div>

              {activeTab === "doubts" && (
                <form onSubmit={handleDoubtSubmit} className="mt-4 space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Have a doubt in this lecture? Ask our AI assistant or faculty..."
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <Button variant="primary" size="sm" type="submit" className="rounded-xl font-bold" rightIcon={<Send size={14} />}>
                    Submit Doubt
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side: Collapsible Lesson Drawer */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
              <h3 className="text-lg font-black text-white mb-4 flex items-center justify-between">
                <span>Course Content</span>
                <span className="text-xs text-indigo-400 font-bold">{lessons.length} Lessons</span>
              </h3>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {Object.keys(modules).map((moduleTitle, idx) => (
                  <div key={idx} className="rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleModule(moduleTitle)}
                      className="w-full p-4 flex items-center justify-between text-left font-bold text-xs text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{moduleTitle}</span>
                      <ChevronDown size={16} className={`transition-transform ${expandedModules[moduleTitle] ? "rotate-180" : ""}`} />
                    </button>

                    {expandedModules[moduleTitle] && (
                      <div className="p-2 space-y-1.5 border-t border-white/5">
                        {modules[moduleTitle].map((lesson) => (
                          <button
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-all ${
                              activeLesson?._id === lesson._id
                                ? "bg-indigo-600/30 border border-indigo-500/40 text-white"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <PlayCircle size={14} className="text-indigo-400 shrink-0" />
                              <span className="truncate">{lesson.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">{lesson.duration || "15m"}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
