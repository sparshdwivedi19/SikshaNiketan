"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, Search, ShieldCheck, GraduationCap, Clock, CheckCircle2, X, Sparkles, Phone, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

interface Tutor {
  id: string;
  name: string;
  title: string;
  subject: string;
  experience: string;
  location: string;
  rating: number;
  reviewsCount: number;
  rate: string;
  badges: string[];
}

const FEATURED_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Dr. Alok Verma",
    title: "Ex-IITian & Physics Mentor",
    subject: "Physics (JEE Adv & NEET)",
    experience: "12+ Years Exp",
    location: "Online / Delhi NCR",
    rating: 4.9,
    reviewsCount: 142,
    rate: "₹800 / hr",
    badges: ["Top Rated", "IIT Delhi Alum"],
  },
  {
    id: "2",
    name: "Priya Sundaram",
    title: "Organic Chemistry Specialist",
    subject: "Chemistry (NEET & Mains)",
    experience: "8+ Years Exp",
    location: "Online / Bangalore",
    rating: 4.8,
    reviewsCount: 98,
    rate: "₹650 / hr",
    badges: ["Gold Medalist"],
  },
  {
    id: "3",
    name: "Rajesh Sharma",
    title: "Senior Mathematics Coach",
    subject: "Mathematics (Class 9-12)",
    experience: "15+ Years Exp",
    location: "Online / Kota",
    rating: 5.0,
    reviewsCount: 210,
    rate: "₹950 / hr",
    badges: ["Produced AIR < 100"],
  },
];

export default function TutorsPage() {
  const [subjectQuery, setSubjectQuery] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredTutors = FEATURED_TUTORS.filter((t) => 
    !subjectQuery || 
    t.name.toLowerCase().includes(subjectQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(subjectQuery.toLowerCase())
  );

  const handleBookTrial = () => {
    setBookingSuccess(true);
    toast.success("Trial session requested! Academic coordinator will call you.");
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Hero Header */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Background Verified Educator Network</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-white mb-4">
            1-on-1 Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Home & Online Tutors</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto mb-8 font-medium">
            Handpicked, background-checked IITian & Doctor faculties for customized 1-on-1 guidance at your preferred pace.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl flex items-center gap-2">
            <div className="flex-1 flex items-center px-3">
              <Search size={20} className="text-slate-400 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Search by subject, exam or tutor name..." 
                className="w-full bg-transparent focus:outline-none text-white text-sm font-medium placeholder:text-slate-500"
                value={subjectQuery}
                onChange={(e) => setSubjectQuery(e.target.value)}
              />
            </div>
            <Button variant="primary" className="h-11 rounded-xl px-6 text-sm font-bold">Search</Button>
          </div>
        </section>

        {/* Tutors Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black font-heading text-white">Verified Tutors Marketplace</h2>
              <p className="text-slate-400 text-xs font-medium">Click any tutor to reserve a 1-on-1 free demo class</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map((tutor) => (
              <motion.div key={tutor.id} whileHover={{ y: -6 }}>
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/50 shadow-2xl transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                        {tutor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white flex items-center gap-1.5">
                          {tutor.name}
                          <ShieldCheck size={16} className="text-emerald-400" />
                        </h3>
                        <p className="text-xs text-indigo-300 font-semibold">{tutor.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tutor.badges.map((b, idx) => (
                        <span key={idx} className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 font-medium mb-6">
                      <p className="flex items-center gap-2 text-white font-bold"><GraduationCap size={14} className="text-indigo-400" /> {tutor.subject}</p>
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {tutor.location}</p>
                      <p className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> {tutor.experience}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Hourly Rate</span>
                      <p className="text-lg font-black text-white">{tutor.rate}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="rounded-xl font-bold"
                      onClick={() => { setSelectedTutor(tutor); setBookingSuccess(false); }}
                    >
                      Book Free Trial
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trial Booking Dialog */}
        {selectedTutor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedTutor(null)} />
            <div className="relative glass-card-dark rounded-3xl shadow-2xl max-w-md w-full p-8 z-10 border border-white/15 text-white">
              <button onClick={() => setSelectedTutor(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10">
                <X size={20} className="text-slate-400" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Demo Class Reserved!</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    We reserved your 1-on-1 demo class with <strong>{selectedTutor.name}</strong>. Our academic team will call you to finalize timing.
                  </p>
                  <Button variant="primary" className="w-full h-12 rounded-xl" onClick={() => setSelectedTutor(null)}>Close</Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white mb-1">Book Free Demo Class</h3>
                  <p className="text-indigo-300 text-xs mb-6 font-semibold">Tutor: {selectedTutor.name} ({selectedTutor.subject})</p>

                  <div className="space-y-4">
                    <input type="text" placeholder="Student Full Name *" className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    <input type="tel" placeholder="Parent / Student Mobile Number *" className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    <select className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium">
                      <option>Preferred Mode: Online 1-on-1 (Zoom / Google Meet)</option>
                      <option>Preferred Mode: Home Visit (Offline Home Tutor)</option>
                    </select>
                    <Button variant="primary" className="w-full h-12 rounded-xl font-bold mt-2" onClick={handleBookTrial}>
                      Confirm Free Trial Booking
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
