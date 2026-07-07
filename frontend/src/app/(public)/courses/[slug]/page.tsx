"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, Users, Clock, BookOpen, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import api, { API_BASE_URL } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/courses/${slug}`);
        if (response.data.status === "success") {
          setCourse(response.data.course);

          // Check enrollment if logged in
          if (isAuthenticated) {
            try {
              const enrollRes = await api.get(`/enrollments/check/${response.data.course._id}`);
              setIsEnrolled(enrollRes.data.isEnrolled);
            } catch {
              // Not enrolled or not logged in
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
      toast.error("Please log in to enroll in this course.");
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
      toast.success("Successfully enrolled! Redirecting to your courses...");
      setTimeout(() => router.push("/dashboard/student/courses"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-6xl animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) return null;

  const finalPrice = course.discountPrice || course.price;
  const discount = course.discountPrice ? Math.round(((course.price - course.discountPrice) / course.price) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-foreground-secondary mb-6 flex items-center gap-2">
        <Link href="/courses" className="hover:text-brand-600 transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-foreground-primary">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left — Course Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-md">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground-primary mt-4 mb-4 leading-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <strong>{course.ratings?.avg?.toFixed(1) || "0"}</strong>
                <span>({course.ratings?.count || 0} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} className="text-brand-500" />
                {course.enrollmentCount || 0} students enrolled
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} /> Level: {course.level}
              </span>
              {course.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {course.duration}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-base text-foreground-secondary leading-relaxed">
              By{" "}
              <span className="font-semibold text-brand-600">
                {course.instructor?.name || "Shiksha Niketan"}
              </span>
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold font-heading text-foreground-primary mb-4">About This Course</h2>
            <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">{course.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold font-heading text-foreground-primary mb-4">What You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Expert-led video lessons",
                "Practice quizzes & mock tests",
                "Lifetime course access",
                "Certificate of completion",
                "AI-powered doubt solving",
                "Study materials & PDFs",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-foreground-secondary">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — Enroll Card */}
        <div>
          <Card className="p-6 sticky top-24 shadow-xl shadow-brand-500/10">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.thumbnail.startsWith('http') ? course.thumbnail : `${API_BASE_URL}${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen size={48} className="text-brand-500 opacity-30" />
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold font-heading text-foreground-primary">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {course.discountPrice && (
                  <>
                    <span className="text-lg text-foreground-secondary line-through">₹{course.price.toLocaleString()}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              className="w-full mb-3 py-6 text-base text-[#312e81]"
              onClick={handleEnroll}
              isLoading={isEnrolling}
              rightIcon={!isEnrolling && <ArrowRight size={18} />}
            >
              {isEnrolled ? "Go to My Courses" : "Enroll Now — Free Access"}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-foreground-secondary flex items-center justify-center gap-1 mt-2">
                <Lock size={12} /> <Link href="/login" className="text-brand-600 underline">Sign in</Link> to enroll
              </p>
            )}

            <div className="mt-6 space-y-3 text-sm text-foreground-secondary border-t border-gray-100 dark:border-gray-800 pt-5">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-brand-500" />
                <span>Duration: {course.duration || "Self-paced"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-brand-500" />
                <span>{course.totalLessons || "Multiple"} lessons included</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={15} className="text-brand-500" />
                <span>Taught by {course.instructor?.name || "Expert Faculty"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
