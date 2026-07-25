"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Menu, X, GraduationCap, ArrowRight, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
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
  { name: "About", path: "/about" },
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
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 flex justify-center px-4",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <div
          className={cn(
            "w-full max-w-7xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-300",
            isScrolled
              ? "bg-slate-900/80 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
              : "bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg"
          )}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-neon-indigo group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10.5px] flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                <GraduationCap size={22} className="animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-heading tracking-tight text-white flex items-center gap-1">
                Shiksha<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Niketan</span>
              </span>
              <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-widest -mt-1 hidden sm:block">
                EdTech Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200",
                    isActive ? "text-white" : "text-slate-200 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-lg -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <GlobalSearch />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardPath(user.role)}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2"
                    leftIcon={<LayoutDashboard size={16} />}
                  >
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] shadow-sm">
                    <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 rounded-xl bg-slate-800/60 border border-white/10 hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between text-lg font-semibold p-3.5 rounded-xl border border-transparent transition-all",
                    pathname === link.path
                      ? "text-white bg-indigo-600/20 border-indigo-500/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span>{link.name}</span>
                  {pathname === link.path && <Sparkles size={16} className="text-indigo-400" />}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/10">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <p className="text-indigo-300 text-xs capitalize">{user.role} Account</p>
                    </div>
                  </div>
                  <Link href={getDashboardPath(user.role)} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full" leftIcon={<LayoutDashboard size={16} />}>
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleLogout}
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-white border-white/20">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

