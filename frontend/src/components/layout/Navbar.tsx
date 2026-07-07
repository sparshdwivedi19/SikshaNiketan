"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Menu, X, GraduationCap, ArrowRight, LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Scholarship", path: "/scholarship" },
  { name: "Tutors", path: "/tutors" },
];

const getDashboardPath = (role: string) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "faculty") return "/instructor";
  if (role === "parent") return "/dashboard/parent";
  return "/dashboard/student";
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-brand-900/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-xl"
            : "bg-brand-900 border-b border-white/5 py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-accent-300 flex items-center justify-center text-brand-900 shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold font-heading tracking-tight">
                <span className="text-white">Shiksha</span>
                <span className="text-accent-300">Niketan</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/10 text-[#f5f5f5]"
                      : "text-[#f5f5f5] hover:text-white hover:bg-white/8"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <GlobalSearch />
            {isAuthenticated && user ? (
              <>
                <Link href={getDashboardPath(user.role)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 border-0"
                    leftIcon={<LayoutDashboard size={15} />}
                  >
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                  <div className="w-8 h-8 rounded-full bg-accent-300 flex items-center justify-center text-brand-900 font-bold text-sm shrink-0">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-white/80 font-medium max-w-[80px] truncate hidden lg:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white/50 hover:text-red-400 transition-colors p-1 ml-1"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="bg-[#fdfd95] text-brand-900 hover:text-brand-900 hover:bg-[#fdfd95] border-0">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-accent-300 text-brand-900 hover:bg-accent-400 font-semibold shadow-md border-0" rightIcon={<ArrowRight size={15} />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-brand-950 pt-20 px-4 pb-8 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 text-base font-medium p-3 rounded-xl hover:bg-white/8 transition-colors",
                    pathname === link.path
                      ? "text-accent-300 bg-white/10"
                      : "text-white/80"
                  )}
                >
                  <BookOpen size={18} className="shrink-0" />
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white/8 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-accent-300 flex items-center justify-center text-brand-900 font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <p className="text-white/50 text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link href={getDashboardPath(user.role)} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-accent-300 text-brand-900 hover:bg-accent-400 font-semibold" leftIcon={<LayoutDashboard size={16} />}>
                      My Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-red-400 border-red-900/50 hover:bg-red-900/20"
                    onClick={handleLogout}
                    leftIcon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-accent-300 text-brand-900 hover:bg-accent-400 font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
