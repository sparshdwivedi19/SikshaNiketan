"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  GraduationCap, LayoutDashboard, Book, Calendar, Award, LogOut,
  Video, Settings, Users, MessageSquare, FileText, BarChart3, Menu, X
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { AIChatbot } from "@/components/ui/AIChatbot";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isInstructor = pathname.includes("/instructor");
  const isParent = pathname.includes("/parent");
  const isAdmin = pathname.includes("/admin");

  // Redirect to login if not authenticated (after hydration)
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  const NavLink = ({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 font-semibold"
            : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground-primary"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  const adminNav = (
    <>
      <NavLink href="/dashboard/admin" exact icon={<LayoutDashboard size={18} />} label="Platform Overview" />
      <NavLink href="/dashboard/admin/users" icon={<Users size={18} />} label="User Management" />
      <NavLink href="/dashboard/admin/courses" icon={<Video size={18} />} label="All Courses" />
      <NavLink href="/dashboard/admin/settings" icon={<Settings size={18} />} label="System Settings" />
    </>
  );

  const instructorNav = (
    <>
      <NavLink href="/instructor" exact icon={<LayoutDashboard size={18} />} label="Analytics" />
      <NavLink href="/instructor/courses" icon={<Video size={18} />} label="My Courses" />
      <NavLink href="/instructor/students" icon={<Users size={18} />} label="Students" />
    </>
  );

  const parentNav = (
    <>
      <NavLink href="/dashboard/parent" exact icon={<LayoutDashboard size={18} />} label="Child's Progress" />
      <NavLink href="/dashboard/parent/reports" icon={<Award size={18} />} label="Test Reports" />
      <NavLink href="/dashboard/parent/attendance" icon={<Calendar size={18} />} label="Attendance" />
      <NavLink href="/dashboard/parent/teachers" icon={<Users size={18} />} label="Teacher Connect" />
    </>
  );

  const studentNav = (
    <>
      <NavLink href="/dashboard/student" exact icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <NavLink href="/dashboard/student/courses" icon={<Book size={18} />} label="My Courses" />
      <NavLink href="/dashboard/student/schedule" icon={<Calendar size={18} />} label="Schedule" />
      <NavLink href="/dashboard/student/doubts" icon={<MessageSquare size={18} />} label="Doubts Forum" />
    </>
  );

  const activeNav = isAdmin ? adminNav : isInstructor ? instructorNav : isParent ? parentNav : studentNav;

  const Sidebar = () => (
    <aside className="w-64 bg-surface border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shrink-0">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold font-heading">
            Shiksha<span className="text-brand-500">Niketan</span>
          </span>
        </Link>
        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
          <X size={20} className="text-foreground-secondary" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground-primary truncate">{user?.name || "User"}</p>
            <p className="text-xs text-foreground-secondary capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {activeNav}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background-secondary relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-surface">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu size={22} className="text-foreground-secondary" />
          </button>
          <span className="font-bold font-heading text-foreground-primary">
            Shiksha<span className="text-brand-500">Niketan</span>
          </span>
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold text-sm">
            {user?.name?.charAt(0) || "?"}
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Global Chatbot for Students */}
      {!isInstructor && !isAdmin && <AIChatbot />}
    </div>
  );
}
