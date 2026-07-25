"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Trophy, Clock, CheckCircle2, Mail, Phone, User as UserIcon, X, Award, Sparkles, ShieldCheck, ArrowRight, Calculator } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function ScholarshipPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [calculatorScore, setCalculatorScore] = useState<number>(85);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "11",
    targetExam: "JEE",
  });

  const getScholarshipTier = (score: number) => {
    if (score >= 90) return { pct: "100%", label: "Full Gold Tuition Waiver", color: "from-amber-400 to-yellow-500" };
    if (score >= 75) return { pct: "75%", label: "Silver Merit Waiver", color: "from-indigo-400 to-purple-400" };
    if (score >= 60) return { pct: "50%", label: "Bronze Academic Scholar", color: "from-cyan-400 to-blue-400" };
    return { pct: "25%", label: "Early Aspirant Waiver", color: "from-emerald-400 to-teal-400" };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Registration successful! Test credentials sent to your email.");
  };

  const currentTier = getScholarshipTier(calculatorScore);

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Campaign Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs md:text-sm font-semibold mb-6"
          >
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>National Talent & Scholarship Test (SNAT 2026)</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight mb-6 leading-[1.08]"
          >
            Unlock Up To <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              100% Tuition Waiver
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Empowering India's top minds for JEE, NEET, and Olympiads. Compete online against 50,000+ aspirants nationwide and win scholarships worth ₹5 Crores.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="accent"
              className="h-14 px-10 text-lg rounded-2xl font-bold w-full sm:w-auto"
              onClick={() => setShowModal(true)}
              rightIcon={<ArrowRight size={20} />}
            >
              Register for Free (SNAT 2026)
            </Button>
          </motion.div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Clock size={14} className="text-amber-400" /> Next Online Exam Slot: Sunday, 10:00 AM IST
          </div>
        </section>

        {/* Interactive Scholarship Reward Calculator */}
        <section className="max-w-4xl mx-auto mb-20 p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">Interactive Scholarship Estimator</h3>
              <p className="text-xs text-slate-400 font-medium">Slide your expected SNAT score percentage to see your guaranteed waiver tier.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-300 mb-2">
                <span>Expected Test Score</span>
                <span className="text-amber-400 text-lg">{calculatorScore}% Marks</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={calculatorScore}
                onChange={(e) => setCalculatorScore(Number(e.target.value))}
                className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Estimated Scholarship Waiver</span>
                <h4 className="text-xl font-bold text-white mt-1">{currentTier.label}</h4>
              </div>
              <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTier.color}`}>
                {currentTier.pct} OFF
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Trophy size={32} className="text-amber-400" />,
              title: "Up to 100% Scholarship",
              desc: "Direct tuition fee waivers applied across live courses, test series, and study materials.",
            },
            {
              icon: <Award size={32} className="text-indigo-400" />,
              title: "All India Rank & Analytics",
              desc: "Get an official NTA-style AIR benchmark and detailed subject-wise speed diagnostic report.",
            },
            {
              icon: <CheckCircle2 size={32} className="text-emerald-400" />,
              title: "1-on-1 Faculty Mentorship",
              desc: "Top scorers get assigned personal IITian mentors for strategy formulation.",
            },
          ].map((b, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mb-6">
                {b.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-2">{b.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </section>

        {/* Registration Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative glass-card-dark rounded-3xl shadow-2xl max-w-md w-full p-8 z-10 border border-white/15 text-white"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Registration Confirmed!</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Test access credentials and instructions sent to <strong>{formData.email}</strong>.
                  </p>
                  <Button variant="primary" className="w-full h-12 rounded-xl" onClick={() => setShowModal(false)}>
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white mb-1">Register for SNAT 2026</h3>
                  <p className="text-slate-400 text-xs mb-6 font-medium">Free registration • Takes only 60 seconds</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Full Name</label>
                      <Input
                        name="name"
                        placeholder="Student name"
                        value={formData.name}
                        onChange={handleChange}
                        leftIcon={<UserIcon size={18} className="text-indigo-400" />}
                        className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        leftIcon={<Mail size={18} className="text-indigo-400" />}
                        className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Phone Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        leftIcon={<Phone size={18} className="text-indigo-400" />}
                        className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
                        required
                      />
                    </div>

                    <Button type="submit" variant="accent" className="w-full h-12 rounded-xl mt-4 font-bold" isLoading={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Submit Registration"}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
