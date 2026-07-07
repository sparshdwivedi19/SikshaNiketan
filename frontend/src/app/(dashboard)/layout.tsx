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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          isActive
            ? "bg-brand-800 text-[#312e81] font-semibold shadow-sm"
            : "text-foreground-secondary hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-300"
        }`}
      >
        <span className={isActive ? "text-accent-300" : "opacity-60"}>{icon}</span>
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
      <NavLink href="/dashboard/admin/tests" icon={<FileText size={18} />} label="Test Management" />
    </>
  );

  const instructorNav = (
    <>
      <NavLink href="/instructor" exact icon={<LayoutDashboard size={18} />} label="Analytics" />
      <NavLink href="/instructor/courses" icon={<Video size={18} />} label="My Courses" />
      <NavLink href="/instructor/students" icon={<Users size={18} />} label="Students" />
      <NavLink href="/instructor/tests" icon={<FileText size={18} />} label="Test Management" />
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
    <aside className="w-64 bg-brand-950 dark:bg-brand-950 border-r border-brand-900 flex flex-col h-full">
      <div className="p-5 border-b border-brand-900/50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-300 flex items-center justify-center text-brand-900 shrink-0">
            <GraduationCap size={18} />
          </div>
          <span className="text-base font-bold font-heading text-white">
            Shiksha<span className="text-accent-300">Niketan</span>
          </span>
        </Link>
        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
          <X size={20} className="text-brand-400" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-brand-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-300 flex items-center justify-center text-brand-900 font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-brand-400 capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {activeNav}
      </nav>

      <div className="p-3 border-t border-brand-900/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
        >
          <LogOut size={17} />
          Sign Out
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
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-brand-950">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-brand-900 text-white">
            <Menu size={22} />
          </button>
          <span className="font-bold font-heading text-white">
            Shiksha<span className="text-accent-300">Niketan</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-accent-300 flex items-center justify-center text-brand-900 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "?"}
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
