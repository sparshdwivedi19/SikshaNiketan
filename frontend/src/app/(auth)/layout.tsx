"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Quote, Sparkles, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-white overflow-hidden relative">
      <BackgroundGlow />

      {/* Left side - Branding & Storytelling */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 bg-slate-900/60 backdrop-blur-2xl text-white p-12 flex-col justify-between relative overflow-hidden border-r border-white/10 z-10">
        
        {/* Top Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px] shadow-neon-indigo group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <GraduationCap size={28} />
              </div>
            </div>
            <span className="text-3xl font-black font-heading tracking-tight">
              Shiksha<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Niketan</span>
            </span>
          </Link>
        </motion.div>

        {/* Center Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="my-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Join 150,000+ Active Aspirants</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black font-heading leading-tight mb-6 text-white">
            Engineer your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              dream rank today.
            </span>
          </h1>

          <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">
            Access personalized AI learning paths, interactive NTA-pattern CBT tests, and mentorship from India's top IITian & Doctor faculty.
          </p>
        </motion.div>

        {/* Bottom Testimonial Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card-dark p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md"
        >
          <div className="flex items-center justify-between mb-3">
            <Quote size={24} className="text-indigo-400 opacity-60" />
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <Trophy size={14} /> AIR 04 JEE Advanced
            </div>
          </div>
          <p className="text-slate-300 text-sm font-medium leading-relaxed mb-4 italic">
            "Shiksha Niketan transformed my prep. The real-time CBT test engine matched actual exam difficulty 100%!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
              AS
            </div>
            <div>
              <p className="text-white font-bold text-sm">Aarav Sharma</p>
              <p className="text-indigo-300 text-xs">IIT Bombay Computer Science</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center gap-3 justify-center mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-black font-heading tracking-tight text-white">
              Shiksha<span className="text-indigo-400">Niketan</span>
            </span>
          </Link>
          
          <div className="glass-card-dark p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
