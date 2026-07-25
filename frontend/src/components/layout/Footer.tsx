import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Globe, Share2, Send, Video, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-20 pb-10 text-slate-400 overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1px] shadow-neon-indigo">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-indigo-400">
                  <GraduationCap size={22} />
                </div>
              </div>
              <span className="text-2xl font-black font-heading tracking-tight text-white">
                Shiksha<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Niketan</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India's premier EdTech ecosystem empowering students with AI-driven learning paths, interactive CBT exam engine, top-tier faculty, and 1-on-1 home tutoring.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold w-fit">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span>Over 150,000+ Active Aspirants Across India</span>
            </div>

            <div className="mt-2">
              <h4 className="text-white font-semibold text-sm mb-3">Subscribe to exam updates & study resources</h4>
              <div className="flex gap-2 max-w-sm">
                <Input
                  placeholder="Enter your email"
                  className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
                />
                <Button variant="primary" className="h-11 shrink-0 rounded-xl px-5" rightIcon={<ArrowRight size={16} />}>
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-base mb-6 text-white uppercase tracking-wider">Courses & Prep</h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><Link href="/courses" className="hover:text-indigo-400 transition-colors">JEE Main & Advanced</Link></li>
              <li><Link href="/courses" className="hover:text-indigo-400 transition-colors">NEET Medical Prep</Link></li>
              <li><Link href="/courses" className="hover:text-indigo-400 transition-colors">Foundation (Class 6-10)</Link></li>
              <li><Link href="/scholarship" className="hover:text-indigo-400 transition-colors">Scholarship Portal</Link></li>
              <li><Link href="/tutors" className="hover:text-indigo-400 transition-colors">Home Tutors</Link></li>
            </ul>
          </div>

          {/* Platform & Company */}
          <div>
            <h3 className="font-heading font-bold text-base mb-6 text-white uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/scholarship" className="hover:text-indigo-400 transition-colors">Scholarship Exam</Link></li>
              <li><Link href="/tutors" className="hover:text-indigo-400 transition-colors">Become a Tutor</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-heading font-bold text-base mb-6 text-white uppercase tracking-wider">Headquarters</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Knowledge Park III, Greater Noida, UP 201310</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <a href="mailto:support@shikshaniketan.com">support@shikshaniketan.com</a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <Globe size={18} />, href: "#" },
                { icon: <Share2 size={18} />, href: "#" },
                { icon: <Send size={18} />, href: "#" },
                { icon: <Video size={18} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:-translate-y-1 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <p>© {new Date().getFullYear()} Shiksha Niketan. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

