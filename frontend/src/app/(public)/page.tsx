"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  ArrowRight, Sparkles, BookOpen, BrainCircuit, Target, Trophy, 
  Users, CheckCircle2, Star, Zap, GraduationCap, ShieldCheck, 
  ChevronRight, Play, MessageSquare, Flame, Clock, Award, BarChart3, Search
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { fadeInUp, staggerContainer } from "@/components/ui/motion";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"jee" | "neet" | "foundation">("jee");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const coursesData = {
    jee: [
      {
        title: "JEE Main & Advanced 2027 (Pinnacle Batch)",
        target: "Class 11 Aspirants",
        tag: "Most Popular",
        rating: 4.9,
        enrolled: "14.2k",
        price: "₹49,999",
        originalPrice: "₹79,999",
        badge: "Live + CBT",
        color: "from-indigo-600 to-purple-600",
      },
      {
        title: "JEE Fast-Track Rank Booster 2026",
        target: "Class 12 & Droppers",
        tag: "High Yield",
        rating: 4.8,
        enrolled: "9.8k",
        price: "₹29,999",
        originalPrice: "₹49,999",
        badge: "Crash Course",
        color: "from-cyan-500 to-blue-600",
      },
    ],
    neet: [
      {
        title: "NEET UG Ultimate 360 (Dr. Batch)",
        target: "Medical Aspirants",
        tag: "Top Faculty",
        rating: 4.9,
        enrolled: "18.5k",
        price: "₹44,999",
        originalPrice: "₹69,999",
        badge: "NCERT Intensive",
        color: "from-emerald-500 to-teal-600",
      },
      {
        title: "NEET Biology & Chemistry Mastery",
        target: "Class 11 & 12",
        tag: "Specialized",
        rating: 4.9,
        enrolled: "11.1k",
        price: "₹19,999",
        originalPrice: "₹34,999",
        badge: "Module Wise",
        color: "from-rose-500 to-pink-600",
      },
    ],
    foundation: [
      {
        title: "Class 9 & 10 Olympiad & NTSE Pinnacle",
        target: "Class 9-10 Students",
        tag: "Foundation",
        rating: 4.9,
        enrolled: "7.6k",
        price: "₹19,999",
        originalPrice: "₹29,999",
        badge: "School + Prep",
        color: "from-amber-500 to-yellow-600",
      },
      {
        title: "Early Builder Foundation Batch (Class 8)",
        target: "Class 8 Students",
        tag: "Logic & Math",
        rating: 4.7,
        enrolled: "4.3k",
        price: "₹14,999",
        originalPrice: "₹24,999",
        badge: "Conceptual",
        color: "from-purple-500 to-indigo-600",
      },
    ],
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden selection:bg-indigo-500/30">
      <BackgroundGlow />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* HERO SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Storytelling Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Badge */}
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-pill border border-indigo-500/30 text-indigo-300 text-xs md:text-sm font-semibold mb-6 shadow-neon-indigo/20"
              >
                <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                <span>Admissions Open for 2026-27 Batches</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight mb-6 text-white leading-[1.08]"
              >
                Master JEE & NEET With <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  India's Top Faculties
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 font-medium leading-relaxed"
              >
                Personalized AI learning paths, real-time Computer-Based Tests (CBT), 1-on-1 home tutoring, and rank predictions engineered to help you crack India's toughest entrance exams.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
              >
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" rightIcon={<ArrowRight size={20} />} className="w-full sm:w-auto h-14 px-8 text-base md:text-lg rounded-2xl">
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/scholarship" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base md:text-lg rounded-2xl border-white/20 text-white hover:bg-white/10">
                    Take Scholarship Test
                  </Button>
                </Link>
              </motion.div>

              {/* Social Proof Badges */}
              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-4 pt-6 border-t border-slate-800/80 w-full"
              >
                <div className="flex -space-x-3">
                  {["AIR 04", "AIR 12", "AIR 45", "AIR 89"].map((rank, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-[11px] flex items-center justify-center border-2 border-slate-950 shadow-md">
                      {rank}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  <p className="font-bold text-white text-sm flex items-center gap-1.5">
                    150,000+ Active Aspirants <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9/5
                  </p>
                  <p>Trusted by top rankers for JEE, NEET & Foundation prep</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Parallax 3D Card Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                transform: `rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
              }}
              className="lg:col-span-5 relative transition-transform duration-200 ease-out preserve-3d"
            >
              <div className="relative rounded-3xl p-5 bg-slate-900/90 backdrop-blur-2xl border border-white/15 text-white shadow-2xl shadow-indigo-500/10 overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center justify-between p-3 border-b border-white/10 mb-4 bg-slate-950/60 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>CBT Test Engine v4.2</span>
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="space-y-4">
                  {/* Live Stream Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg relative">
                        <Play size={20} className="fill-white ml-0.5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">LIVE NOW</span>
                        <h4 className="font-bold text-sm text-white">Rotational Dynamics — Advanced Problem Solving</h4>
                        <p className="text-xs text-slate-300">Dr. H.C. Verma Alumni • 2.4k watching</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Chat Preview */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <BrainCircuit size={16} /> Shiksha AI Learning Assistant
                      </span>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Instant Solution</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-200 border border-white/5">
                      <p className="font-medium text-indigo-300 mb-1">Q: How to derive angular momentum conservation in rigid bodies?</p>
                      <p className="text-slate-300 leading-relaxed">
                        When net external torque is zero (τ_ext = 0), total angular momentum (L = Iω) remains strictly conserved...
                      </p>
                    </div>
                  </div>

                  {/* Test Performance Gauge */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
                      <span className="text-xs text-slate-300 block mb-1">Predicted JEE Rank</span>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        AIR 248
                      </div>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                        <Trophy size={12} /> Top 0.1% Percentile
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
                      <span className="text-xs text-slate-300 block mb-1">CBT Accuracy</span>
                      <div className="text-2xl font-black text-white">
                        94.8%
                      </div>
                      <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-1 font-semibold">
                        <Zap size={12} /> Speed: 42s / Q
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Badges */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-yellow-300 flex items-center gap-1.5"
                >
                  <Award size={16} /> 100% Scholarship Batch
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-2"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>1-on-1 Tutor Assigned</span>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LIVE STATS TICKER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-10 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "150,000+", label: "Active Aspirants", icon: <Users size={22} className="text-indigo-400" /> },
              { num: "99.8%", label: "Selection Ratio", icon: <Trophy size={22} className="text-amber-400" /> },
              { num: "500+", label: "IITian & Doctor Faculties", icon: <GraduationCap size={22} className="text-cyan-400" /> },
              { num: "₹5 Crore+", label: "Scholarships Awarded", icon: <Award size={22} className="text-emerald-400" /> },
            ].map((stat, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white font-heading">{stat.num}</h3>
                <p className="text-xs md:text-sm text-slate-300 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* BENTO GRID: REVOLUTIONARY EDTECH FEATURES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              Complete Learning Ecosystem
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white mt-4 mb-4">
              Designed for Top Ranks & Deep Conceptual Mastery
            </h2>
            <p className="text-slate-300 text-base md:text-lg font-medium">
              Everything you need to surpass competition, backed by cutting-edge technology and battle-tested pedagogy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento 1: AI Doubt Engine */}
            <div className="md:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-white/10 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="flex flex-col h-full justify-between z-10 relative">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                    <BrainCircuit size={26} />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">AI Learning Co-Pilot</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white mt-2 mb-4">
                    Instant 24/7 AI Doubt Solver & Concept Clarifier
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
                    Snap any complex physics or chemistry problem to receive step-by-step video solutions, interactive diagrams, and tailored practice problems instantly.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <Link href="/courses">
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight size={16} />}>
                      Try AI Assistant
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento 2: CBT Engine */}
            <div className="md:col-span-4 p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Target size={26} />
              </div>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">NTA Pattern Tests</span>
              <h3 className="text-xl md:text-2xl font-black text-white mt-2 mb-3">
                Real CBT Exam Simulator
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Practice in exact NTA-style CBT test software with real-time rank prediction, time-per-question analysis, and weak area alerts.
              </p>
            </div>

            {/* Bento 3: Home Tutors */}
            <div className="md:col-span-4 p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Users size={26} />
              </div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Personalized Attention</span>
              <h3 className="text-xl md:text-2xl font-black text-white mt-2 mb-3">
                1-on-1 Home Tutors Portal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Book verified expert home tutors in your city for personalized 1-on-1 guidance, customized pace, and dedicated homework support.
              </p>
            </div>

            {/* Bento 4: Scholarship Portal */}
            <div className="md:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-white/10 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Trophy size={26} />
              </div>
              <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">Up to 100% Scholarship</span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-2 mb-4">
                National Talent & Scholarship Test (SNAT 2026)
              </h3>
              <p className="text-slate-200 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                Unlock up to 100% tuition fee waivers and cash rewards based on your merit in our online scholarship test.
              </p>
              <div className="mt-6">
                <Link href="/scholarship">
                  <Button variant="accent" size="sm" rightIcon={<ChevronRight size={16} />}>
                    Register for SNAT Exam
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* POPULAR BATCHES & COURSES FILTERABLE TABS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 bg-slate-950/40 border-t border-slate-800/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                Flagship Batches
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white mt-3">
                Curated Batches for Maximum Exam Score
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
              {(["jee", "neet", "foundation"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-neon-indigo"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coursesData[activeTab].map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all group shadow-xl flex flex-col justify-between"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                      {course.badge}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      <Star size={14} className="fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400">({course.enrolled})</span>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mb-6">Targeting: {course.target}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-200 font-semibold pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-400" /> Live Interactive Classes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-400" /> CBT Test Series
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-slate-950/60 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">{course.price}</span>
                    <span className="text-xs text-slate-400 line-through ml-2 font-medium">{course.originalPrice}</span>
                  </div>
                  <Link href="/courses">
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight size={16} />}>
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOPPER HALL OF FAME WALL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Hall of Fame
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white mt-4 mb-4">
              Real Results. Real Champions.
            </h2>
            <p className="text-slate-300 text-base font-medium">
              Hear from our top rankers who achieved their dream IIT and AIIMS admissions with Shiksha Niketan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                exam: "JEE Advanced 2025",
                rank: "AIR 04",
                college: "IIT Bombay (Computer Science)",
                quote: "The CBT test engine and instant AI solution solver transformed my speed. Shiksha Niketan's test series matched actual JEE difficulty 100%.",
              },
              {
                name: "Ananya Patel",
                exam: "NEET UG 2025",
                rank: "AIR 12",
                college: "AIIMS New Delhi",
                quote: "Dedicated 1-on-1 doubt clearing and NCERT line-by-line masterclasses helped me score 715/720 in NEET!",
              },
              {
                name: "Rohan Verma",
                exam: "JEE Main 2025",
                rank: "AIR 45",
                college: "IIT Delhi (Electrical)",
                quote: "SNAT Scholarship gave me 100% fee waiver. The top faculty guidance kept me motivated throughout my 2-year journey.",
              },
            ].map((topper, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                      {topper.rank}
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                      {topper.exam}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{topper.quote}"</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-bold text-white text-base">{topper.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{topper.college}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FINAL CTA BANNER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl p-10 md:p-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-white/20 shadow-2xl text-center overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight mb-6">
              Start Your Journey Towards Rank 1 Today
            </h2>
            <p className="text-slate-200 text-base md:text-lg mb-8 leading-relaxed">
              Join 150,000+ aspirants preparing with India's finest faculty. Take the scholarship test or enroll in live batches now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="accent" className="h-14 px-8 text-lg rounded-2xl">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-white/30 text-white hover:bg-white/10">
                  Browse All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
