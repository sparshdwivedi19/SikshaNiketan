import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BookOpen, BrainCircuit, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-700/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-600 text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Admissions open for 2026-27 Batches
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 text-foreground-primary">
            Master Your Future With <br className="hidden md:block" />
            <span className="text-gradient">India's Best Educators</span>
          </h1>

          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-12">
            Premium courses for JEE, NEET, and Foundation. Personalized AI learning paths, interactive live classes, and a gamified experience to make learning addictive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto text-[#321e81]" rightIcon={<ArrowRight size={20} />}>
                Explore Courses
              </Button>
            </Link>
            <Link href="/scholarship">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Take Scholarship Test
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="glass-dark dark:glass rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white dark:text-foreground-primary">
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold font-heading">50K+</h3>
            <p className="text-sm text-gray-700 dark:text-foreground-secondary font-medium">Active Students</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold font-heading">100+</h3>
            <p className="text-sm text-gray-700 dark:text-foreground-secondary font-medium">Expert Faculties</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold font-heading">99.9</h3>
            <p className="text-sm text-gray-700 dark:text-foreground-secondary font-medium">Top Percentile</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold font-heading">4.9/5</h3>
            <p className="text-sm text-gray-700 dark:text-foreground-secondary font-medium">Average Rating</p>
          </div>
        </div>
      </section>
    </div>
  );
}
