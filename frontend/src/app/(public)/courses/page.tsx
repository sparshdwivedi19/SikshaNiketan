"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Filter, BookOpen, Star, Users, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api, { API_BASE_URL } from "@/utils/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  instructor: { name: string; avatar?: string };
  ratings: { avg: number; count: number };
  enrollmentCount: number;
  isPublished: boolean;
}

const CATEGORIES = ["JEE Main & Advanced", "NEET UG", "Foundation (Class 6-10)", "Skill Development"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/courses");
        if (response.data.status === "success") {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory !== "All") {
      const catMap: Record<string, string> = {
        "JEE Main & Advanced": "JEE",
        "NEET UG": "NEET",
        "Foundation (Class 6-10)": "Foundation",
        "Skill Development": "Skills",
      };
      if (!course.category.toLowerCase().includes(catMap[activeCategory]?.toLowerCase() || activeCategory.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Interactive Learning Modules & Live Classes</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tight text-white mb-4"
          >
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Targeted Courses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-base md:text-lg font-medium"
          >
            Handcrafted curriculum designed by India's top rankers and faculties for complete concept mastery.
          </motion.p>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Search courses by topic, faculty, or exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-neon-indigo"
                    : "bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse p-6 flex flex-col justify-between">
                <Skeleton className="h-44 rounded-2xl bg-slate-800" />
                <Skeleton className="h-6 w-3/4 rounded bg-slate-800 mt-4" />
                <Skeleton className="h-4 w-1/2 rounded bg-slate-800 mt-2" />
                <Skeleton className="h-10 rounded-xl bg-slate-800 mt-6" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center">
            <EmptyState
              title="No courses match your query"
              description="Try adjusting your search terms or selecting a different category."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group rounded-3xl bg-slate-900/90 border border-white/10 overflow-hidden hover:border-indigo-500/50 shadow-2xl transition-all flex flex-col justify-between"
              >
                {/* Course Image Header */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail.startsWith("http") ? course.thumbnail : `${API_BASE_URL}${course.thumbnail}`}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-950 flex items-center justify-center text-indigo-400">
                      <BookOpen size={48} className="opacity-40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-500/30">
                    {course.category}
                  </span>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
                    <Star size={13} className="fill-amber-400" />
                    <span>{course.ratings?.avg || 4.9}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mb-4 flex items-center gap-2">
                      <span>Instructor: {course.instructor?.name || "Senior Faculty"}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white">
                        {course.discountPrice || course.price ? `₹${(course.discountPrice || course.price).toLocaleString()}` : "Free"}
                      </span>
                      {course.discountPrice && course.price > course.discountPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">₹{course.price.toLocaleString()}</span>
                      )}
                    </div>

                    <Link href={`/courses/${course.slug || course._id}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight size={16} />}>
                        View Batch
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
