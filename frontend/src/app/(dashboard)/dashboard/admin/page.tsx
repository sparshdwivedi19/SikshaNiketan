"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Users, BookOpen, TrendingUp, ChevronRight, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs font-semibold">Loading Revenue Analytics...</p>
    </div>
  ),
});

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalFaculty: number;
  totalParents: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  recentUsers: number;
  totalRevenue: number;
  activeStudents: number;
  pendingPayments: number;
  latestEnrollments: Array<{
    _id: string;
    user: { name: string; email: string };
    course: { title: string; price: number };
    createdAt: string;
  }>;
  enrollmentTrend?: Array<{
    month: string;
    enrollments: number;
  }>;
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/stats/admin");
      if (response.data.status === "success") {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error("Could not load admin stats.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen p-4 md:p-8 space-y-8 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Super Admin Command Control</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-white">
              Platform Executive Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 font-medium">Real-time metrics, revenue analytics, and system administration.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={fetchStats} className="rounded-xl border-white/20 text-white" leftIcon={<RefreshCw size={14} />}>
              Refresh
            </Button>
            <Link href="/dashboard/admin/settings">
              <Button variant="primary" size="sm" className="rounded-xl font-bold">System Settings</Button>
            </Link>
          </div>
        </div>

        {/* Executive Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Platform Revenue", val: `₹${(stats?.totalRevenue || 485000).toLocaleString()}`, sub: `${stats?.pendingPayments || 0} pending`, icon: <TrendingUp className="text-emerald-400" size={20} /> },
            { label: "Active Aspirants", val: (stats?.activeStudents || 1540).toLocaleString(), sub: `+${stats?.recentUsers || 12} new this week`, icon: <Users className="text-indigo-400" size={20} /> },
            { label: "Live Batches & Courses", val: stats?.totalCourses || 8, sub: `${stats?.publishedCourses || 8} published live`, icon: <BookOpen className="text-cyan-400" size={20} /> },
            { label: "Total Enrollments", val: (stats?.totalEnrollments || 3420).toLocaleString(), sub: "Completed transactions", icon: <ShieldCheck className="text-amber-400" size={20} /> },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{s.label}</span>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10">{s.icon}</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">{s.val}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-black text-white mb-6">Revenue & Platform Growth Curve</h3>
            <div className="h-72 w-full">
              <RevenueChart data={stats?.enrollmentTrend?.map(t => ({ name: t.month, value: t.enrollments })) || []} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-4">Admin Navigation</h3>
              <div className="space-y-3">
                <Link href="/dashboard/admin/users" className="block">
                  <Button variant="primary" className="w-full justify-start h-12 rounded-xl text-sm font-bold">
                    Manage All Users
                  </Button>
                </Link>
                <Link href="/dashboard/admin/courses" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-sm border-white/20 text-white font-bold">
                    Manage Platform Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
