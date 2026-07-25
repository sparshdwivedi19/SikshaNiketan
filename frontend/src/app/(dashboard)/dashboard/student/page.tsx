"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { 
  Flame, Trophy, Target, TrendingUp, BookOpen, Clock, 
  BrainCircuit, ChevronRight, Star, Medal, ArrowRight, Play, ShieldCheck
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";
import Link from "next/link";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

const dummyPerformance = [
  { day: "Mon", score: 68 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 82 },
  { day: "Thu", score: 79 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 92 },
  { day: "Sun", score: 95 },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-8 text-white">
      <BackgroundGlow />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Command Center Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>JEE & NEET Student Command Portal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name?.split(" ")[0] || "Student"}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 font-medium">Your personalized AI learning overview and upcoming CBT tests for today.</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 px-5 rounded-2xl border border-white/10 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-lg">
              <Flame size={24} className="animate-bounce" />
            </div>
            <div>
              <span className="text-base font-black text-white block">7 Day Learning Streak</span>
              <span className="text-xs text-amber-400 font-semibold">+150 XP bonus earned today</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total XP Earned", val: "2,450 XP", sub: "Rank #14 in Batch", icon: <Trophy className="text-amber-400" size={20} /> },
            { label: "Enrolled Courses", val: "3 Active", sub: "JEE Advanced Pinnacle", icon: <BookOpen className="text-indigo-400" size={20} /> },
            { label: "CBT Exam Score", val: "94.8%", sub: "+6% from last week", icon: <Target className="text-cyan-400" size={20} /> },
            { label: "Study Time Today", val: "3h 45m", sub: "Goal: 4h / day", icon: <Clock className="text-emerald-400" size={20} /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{s.label}</span>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10">{s.icon}</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">{s.val}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Analytics Chart & Active Courses */}
          <div className="lg:col-span-8 space-y-8">
            {/* Recharts Analytics Box */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-white">CBT Exam Accuracy Trend</h3>
                  <p className="text-xs text-slate-300 font-medium">Weekly score percentage progression across physics & math</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  +14% Improvement
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyPerformance}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[50, 100]} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resume Learning Section */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-6">Continue Learning</h3>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                    <Play size={24} className="fill-white ml-1" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Class 11 Physics</span>
                    <h4 className="text-lg font-bold text-white">Rotational Dynamics — Lecture 04</h4>
                    <p className="text-xs text-slate-400 mt-1">Progress: 65% Completed • 18 mins remaining</p>
                  </div>
                </div>

                <Link href="/dashboard/student/courses">
                  <Button variant="primary" size="md" className="rounded-xl font-bold shrink-0" rightIcon={<ArrowRight size={16} />}>
                    Resume Video
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Action Launcher & Upcoming Exams */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-6">Quick Actions</h3>

              <div className="space-y-3">
                <Link href="/dashboard/student/tests" className="block">
                  <Button variant="primary" className="w-full justify-start h-12 rounded-xl gap-3 text-sm">
                    <Target size={18} /> Launch CBT Exam Engine
                  </Button>
                </Link>
                <Link href="/dashboard/student/doubts" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl gap-3 text-sm border-white/20 text-white">
                    <BrainCircuit size={18} className="text-cyan-400" /> Ask AI Doubt Co-Pilot
                  </Button>
                </Link>
                <Link href="/tutors" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl gap-3 text-sm border-white/20 text-white">
                    <Star size={18} className="text-amber-400" /> Book 1-on-1 Home Tutor
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upcoming Tests Alert */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-4">Upcoming CBT Tests</h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">JEE Main Full Mock 06</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Sunday, 10 AM</span>
                  </div>
                  <p className="text-xs text-slate-300">Physics, Chemistry, Maths • 300 Marks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
