import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={24} />
              </div>
              <span className="text-2xl font-bold font-heading tracking-tight text-foreground-primary">
                Shiksha<span className="text-brand-600">Niketan</span>
              </span>
            </Link>
            <p className="text-foreground-secondary text-sm leading-relaxed">
              Empowering students with premium educational content, AI-driven learning paths, and expert mentorship to crack India's toughest exams.
            </p>
            <div className="flex items-center gap-4 text-foreground-secondary">
              <Link href="#" className="hover:text-brand-500 transition-colors"><Globe size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground-primary">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground-secondary">
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">JEE Main & Advanced</Link></li>
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">NEET Preparation</Link></li>
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">Foundation (Class 6-10)</Link></li>
              <li><Link href="/scholarship" className="hover:text-brand-500 transition-colors">Scholarship Test</Link></li>
              <li><Link href="/tutors" className="hover:text-brand-500 transition-colors">Home Tuition</Link></li>
            </ul>
          </div>

          {/* Skill Development */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground-primary">Skill Development</h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground-secondary">
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">Financial Education</Link></li>
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">Communication Skills</Link></li>
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">Life & Soft Skills</Link></li>
              <li><Link href="/courses" className="hover:text-brand-500 transition-colors">Entrepreneurship</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground-primary">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm text-foreground-secondary">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-500 shrink-0" />
                <span>Sector 62, Noida, Uttar Pradesh, India 201309</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-500 shrink-0" />
                <span>hello@shikshaniketan.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground-secondary">
          <p>© {new Date().getFullYear()} Shiksha Niketan. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link>
            <Link href="/refunds" className="hover:text-brand-500 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
