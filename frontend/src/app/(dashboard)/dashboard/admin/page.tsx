"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Users, BookOpen, TrendingUp, ChevronRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-foreground-secondary">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Loading Chart...</p>
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
      const response = await api.get("/stats/admin");
      if (response.data.status === "success") {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error("Could not load dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Super Admin Portal</h1>
          <p className="text-foreground-secondary">Real-time platform overview from database.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchStats}
          >
            Refresh Stats
          </Button>
          <Link href="/dashboard/admin/settings">
            <Button className="text-[#312e81]">System Settings</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between text-foreground-secondary font-medium text-sm mb-2">
            <div className="flex items-center gap-2"><IndianRupee size={16} className="text-brand-500" /> Total Revenue</div>
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : `₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">
            {isLoading ? "—" : stats?.pendingPayments || 0} pending payments
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <Users size={16} className="text-purple-500" /> Active Students
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : (stats?.activeStudents || 0).toLocaleString()}
          </div>
          <div className="text-xs text-green-500 font-medium">
            +{isLoading ? "—" : stats?.recentUsers || 0} total users this month
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <BookOpen size={16} className="text-blue-500" /> Courses
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : (stats?.totalCourses || 0)}
          </div>
          <div className="text-xs text-green-500 font-medium">
            {isLoading ? "—" : stats?.publishedCourses || 0} published
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <TrendingUp size={16} className="text-green-500" /> Enrollments
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">
            {isLoading ? "—" : (stats?.totalEnrollments || 0).toLocaleString()}
          </div>
          <div className="text-xs text-foreground-secondary font-medium">
            Total all-time
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 md:col-span-2 p-5 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-heading text-foreground-primary">Platform Growth & Revenue</h3>
            <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2 py-1 rounded">Last 6 Months</span>
          </div>
          <div className="flex-1 w-full relative">
            <RevenueChart data={stats?.enrollmentTrend?.map(t => ({ name: t.month, value: t.enrollments })) || []} />
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading text-foreground-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/admin/users" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-foreground-primary transition-all active:scale-[0.98] group">
                <span className="font-medium text-sm group-hover:text-brand-600 transition-colors">Manage Users</span>
                <ChevronRight size={16} className="text-gray-800 group-hover:text-brand-600 transition-colors" />
              </Link>
              <Link href="/dashboard/admin/courses" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-foreground-primary transition-all active:scale-[0.98] group">
                <span className="font-medium text-sm group-hover:text-brand-600 transition-colors">Manage Courses</span>
                <ChevronRight size={16} className="text-gray-800 group-hover:text-brand-600 transition-colors" />
              </Link>
              <Link href="/dashboard/admin/settings" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-foreground-primary transition-all active:scale-[0.98] group">
                <span className="font-medium text-sm group-hover:text-brand-600 transition-colors">System Settings</span>
                <ChevronRight size={16} className="text-gray-800 group-hover:text-brand-600 transition-colors" />
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading text-foreground-primary mb-4">Latest Enrollments</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              ) : stats?.latestEnrollments && stats.latestEnrollments.length > 0 ? (
                stats.latestEnrollments.map((enr) => (
                  <div key={enr._id} className="flex flex-col gap-1 text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                    <span className="font-bold text-foreground-primary truncate">{enr.user?.name || "Unknown"}</span>
                    <span className="text-foreground-secondary text-xs truncate">Enrolled in: {enr.course?.title || "Unknown Course"}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-foreground-secondary">No recent enrollments.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
