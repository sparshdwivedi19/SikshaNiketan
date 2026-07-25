"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Award, ShieldCheck, HeartHandshake, Users, ArrowRight, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Our Mission & EdTech Journey</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight mb-6 leading-[1.08]">
            Democratizing Top Rank <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Education Across India
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Shiksha Niketan was engineered to ensure every student—regardless of location or background—has instant access to IITians, top doctors, and AI adaptive CBT prep.
          </p>
        </section>

        {/* Milestone Timeline */}
        <section className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              Growth Journey
            </span>
            <h2 className="text-3xl font-black font-heading text-white mt-3">From Small Classroom to National Platform</h2>
          </div>

          <div className="space-y-6">
            {[
              { year: "2020", title: "Inception in Kota & Noida", desc: "Started with 50 students preparing for JEE Advanced under 3 IITian HODs." },
              { year: "2022", title: "Launch of CBT Engine v1.0", desc: "Built NTA-identical Computer Based Test engine with instant accuracy analysis." },
              { year: "2024", title: "1-on-1 Tutor Network Expansion", desc: "Onboarded 500+ verified home tutors across 20+ Indian cities." },
              { year: "2026", title: "AI Learning Co-Pilot & SNAT 2026", desc: "Empowering 150,000+ active aspirants with 24/7 AI doubt solving and ₹5Cr scholarships." },
            ].map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 6 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start gap-6 backdrop-blur-xl"
              >
                <div className="w-16 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 font-black text-sm text-white flex items-center justify-center shrink-0 shadow-lg">
                  {m.year}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{m.title}</h3>
                  <p className="text-slate-400 text-sm">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black font-heading text-white">The Core Pillars</h2>
            <p className="text-slate-400 text-sm mt-2">What sets Shiksha Niketan apart from traditional coaching institutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Award size={26} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Uncompromised Pedagogy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Curriculum crafted exclusively by top AIR rankers, revised annually to mirror actual NTA difficulty.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">AI Diagnostic Precision</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time mistake analysis so students eliminate recurring conceptual weak spots before exam day.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <HeartHandshake size={26} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Affordability For All</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Merit-based scholarships up to 100% so financial constraints never block brilliant minds.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
