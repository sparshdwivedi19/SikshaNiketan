"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Menu, X, GraduationCap, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
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
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "glass-dark border-gray-200/20 py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-white hidden sm:block">
              Shiksha<span className="text-brand-400">Niketan</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-400",
                    isActive ? "text-brand-400" : "text-gray-700"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <GlobalSearch />
            {isAuthenticated && user ? (
              <>
                <Link href={getDashboardPath(user.role)}>
                  <Button variant="ghost" className="text-gray-700 hover:bg-white/10 gap-2" leftIcon={<LayoutDashboard size={16} />}>
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-800 hover:text-red-400 transition-colors p-1"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button rightIcon={<ArrowRight size={16} />}>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-surface pt-24 px-4 pb-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium p-4 rounded-xl hover:bg-brand-500/10 transition-colors",
                    pathname === link.path ? "text-brand-600 bg-brand-50" : "text-foreground-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link href={getDashboardPath(user.role)} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" leftIcon={<LayoutDashboard size={16} />}>My Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="w-full text-red-600 border-red-200" onClick={handleLogout} leftIcon={<LogOut size={16} />}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
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
