"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! An academic counselor will contact you within 2 hours.");
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>24/7 Student & Parent Academic Helpdesk</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-white mb-4">
            We Are Here To <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Guide Your Journey</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-medium">
            Have questions regarding course selection, batch timings, or home tutor allotment? Speak to a senior academic advisor.
          </p>
        </section>

        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex items-start gap-4 shadow-xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Academic Counselor Helpline</h3>
                  <p className="text-slate-300 text-sm mt-1 font-semibold">+91 (1800) 123-4567</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mon - Sun (9:00 AM - 9:00 PM IST)</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex items-start gap-4 shadow-xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Email Support</h3>
                  <p className="text-slate-300 text-sm mt-1 font-semibold">support@shikshaniketan.com</p>
                  <p className="text-xs text-slate-500 mt-0.5">Guaranteed response within 2 hours</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex items-start gap-4 shadow-xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">National Campus Headquarters</h3>
                  <p className="text-slate-300 text-sm mt-1">Knowledge Park III, Greater Noida, UP 201310</p>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-10 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Message Received!</h3>
                    <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. A senior counselor will contact you shortly at <strong>{form.email}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-black text-white mb-2">Send Us An Inquiry</h2>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Full Name *</label>
                      <Input
                        placeholder="Aarav Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-slate-950/80 border-slate-800 text-white rounded-xl"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="bg-slate-950/80 border-slate-800 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Mobile Number</label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="bg-slate-950/80 border-slate-800 text-white rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Message *</label>
                      <textarea
                        rows={4}
                        placeholder="How can our counseling team assist you today?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-full h-12 rounded-xl font-bold mt-2" isLoading={loading} rightIcon={!loading && <Send size={18} />}>
                      Submit Inquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
