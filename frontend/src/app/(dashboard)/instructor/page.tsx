"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Users, BookOpen, TrendingUp, Plus, Star, ShieldCheck, Play, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  courses: Array<{
    _id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number;
    enrollmentCount: number;
    isPublished: boolean;
    ratings: { avg: number; count: number };
  }>;
}

const mockBarData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 210 },
  { month: "Mar", students: 340 },
  { month: "Apr", students: 480 },
  { month: "May", students: 620 },
  { month: "Jun", students: 850 },
];

export default function InstructorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/instructor");
      if (response.data.status === "success") {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch instructor stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-8 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Faculty & Instructor Portal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-white">
              Instructor Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">Manage your active batches, student doubt queues, and course content.</p>
          </div>

          <Link href="/instructor/courses/create">
            <Button variant="primary" size="lg" className="rounded-2xl font-bold gap-2 shadow-neon-indigo" rightIcon={<Plus size={18} />}>
              Create New Batch
            </Button>
          </Link>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Students Mentored", val: stats?.totalStudents || "1,420", icon: <Users size={22} className="text-indigo-400" /> },
            { label: "Active Courses / Batches", val: stats?.totalCourses || "4 Batches", icon: <BookOpen size={22} className="text-cyan-400" /> },
            { label: "Average Rating", val: `${stats?.avgRating || 4.9} / 5.0`, icon: <Star size={22} className="text-amber-400 fill-amber-400" /> },
            { label: "Total Revenue Generated", val: `₹${(stats?.totalRevenue || 145000).toLocaleString()}`, icon: <TrendingUp size={22} className="text-emerald-400" /> },
          ].map((m, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10">{m.icon}</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">{m.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* Analytics & Course Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-black text-white mb-6">Student Growth Velocity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Managed Batches */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-black text-white mb-6">Quick Course Navigation</h3>
            <div className="space-y-3">
              <Link href="/instructor/courses" className="block">
                <Button variant="primary" className="w-full justify-start h-12 rounded-xl gap-3 text-sm">
                  <BookOpen size={18} /> Manage All Courses
                </Button>
              </Link>
              <Link href="/instructor/students" className="block">
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl gap-3 text-sm border-white/20 text-white">
                  <Users size={18} className="text-indigo-400" /> Student Enrollments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
