"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, Users, Clock, BookOpen, CheckCircle2, ArrowRight, Lock, Play, ShieldCheck, Award, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import api, { API_BASE_URL } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  instructor: { name: string; avatar?: string; _id: string };
  ratings: { avg: number; count: number };
  enrollmentCount: number;
  duration: string;
  totalLessons: number;
  isPublished: boolean;
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/courses/${slug}`);
        if (response.data.status === "success") {
          setCourse(response.data.course);

          if (isAuthenticated) {
            try {
              const enrollRes = await api.get(`/enrollments/check/${response.data.course._id}`);
              setIsEnrolled(enrollRes.data.isEnrolled);
            } catch {
              // Not enrolled
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchCourse();
  }, [slug, isAuthenticated, router]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll in this batch.");
      router.push("/login");
      return;
    }

    if (isEnrolled) {
      router.push("/dashboard/student/courses");
      return;
    }

    setIsEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: course!._id });
      setIsEnrolled(true);
      toast.success("Successfully enrolled! Redirecting to your learning player...");
      setTimeout(() => router.push("/dashboard/student/courses"), 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen pt-32 pb-24 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm font-semibold">Loading batch details...</p>
        </div>
      </div>
    );
  }

  const syllabus = [
    {
      module: "Module 1: Fundamental Concepts & Problem Solving Mechanics",
      lessons: ["Vector Analysis & 3D Geometry", "Newton's Laws of Motion & Friction", "Work, Energy & Power Dynamics"],
    },
    {
      module: "Module 2: Advanced Problem Solving & Previous Year Questions",
      lessons: ["System of Particles & Rotational Motion", "Gravitation & Kepler's Laws", "Fluid Mechanics & Elasticity"],
    },
    {
      module: "Module 3: NTA Pattern CBT Mock Tests & Live Doubt Clearance",
      lessons: ["Full-Length JEE/NEET CBT Mock Test 1", "Doubt Resolution Stream with Senior HOD", "Rank Prediction & Speed Analysis"],
    },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Course Header Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3.5 py-1.5 rounded-full border border-indigo-500/30">
                {course.category}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 size={13} /> Admissions Open
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white mb-6 leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-medium">
              {course.description || "Master core concepts with step-by-step problem solving, interactive CBT mock tests, and 24/7 AI doubt support."}
            </p>

            {/* Course Meta Info Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Star size={20} className="fill-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{course.ratings?.avg || 4.9} / 5.0</div>
                  <div className="text-xs text-slate-400 font-medium">Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{course.enrollmentCount || 1200}+</div>
                  <div className="text-xs text-slate-400 font-medium">Enrolled Students</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{course.duration || "120 Hours"}</div>
                  <div className="text-xs text-slate-400 font-medium">Live + Record</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl shadow-indigo-500/10 overflow-hidden">
              {/* Media Preview Box */}
              <div className="relative h-52 w-full rounded-2xl bg-slate-950 overflow-hidden mb-6 border border-white/10 group">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail.startsWith("http") ? course.thumbnail : `${API_BASE_URL}${course.thumbnail}`}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-950 to-slate-950 flex items-center justify-center">
                    <BookOpen size={48} className="text-indigo-400/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={28} className="fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="mb-6">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Course Tuition Fee</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">
                    {course.discountPrice || course.price ? `₹${(course.discountPrice || course.price).toLocaleString()}` : "Free"}
                  </span>
                  {course.discountPrice && course.price > course.discountPrice && (
                    <span className="text-sm text-slate-500 line-through font-semibold">₹{course.price.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleEnroll}
                isLoading={isEnrolling}
                className="w-full h-14 rounded-2xl text-base font-bold mb-4 shadow-neon-indigo"
                rightIcon={<ArrowRight size={18} />}
              >
                {isEnrolled ? "Go to Course Player" : "Enroll in Batch Now"}
              </Button>

              <p className="text-xs text-center text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> 7-Day Refund Guarantee • Instant Access
              </p>
            </div>
          </div>
        </div>

        {/* Syllabus & Course Content Accordion */}
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-black font-heading text-white mb-6">
            Detailed Course Curriculum & Modules
          </h2>

          <div className="space-y-4 mb-16">
            {syllabus.map((sec, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-white hover:bg-white/5 transition-colors"
                >
                  <span className="text-base flex items-center gap-3">
                    <BookOpen size={18} className="text-indigo-400" />
                    {sec.module}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 ${openSection === i ? "rotate-180" : ""}`}
                  />
                </button>

                {openSection === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 pt-0 border-t border-white/5 space-y-3"
                  >
                    {sec.lessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm text-slate-300 py-2 border-b border-white/5 last:border-0">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-indigo-400" /> {lesson}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">Video + Notes</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Instructor Bio Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg">
              {course.instructor?.name?.charAt(0) || "F"}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Head HOD & Mentor</span>
              <h3 className="text-xl font-bold text-white mt-1">{course.instructor?.name || "Senior IIT Faculty"}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ex-IITian with 12+ years teaching experience. Has mentored over 50+ AIR 100 toppers in JEE Main, Advanced & NEET.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
