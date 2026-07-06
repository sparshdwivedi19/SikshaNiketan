import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar - Distraction Free */}
      <header className="h-16 bg-background-secondary border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student" className="text-foreground-secondary hover:text-foreground-primary transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold font-heading hidden sm:block text-foreground-primary">
              Shiksha<span className="text-brand-600">Niketan</span>
            </span>
          </Link>
        </div>
        
        <div className="text-sm font-medium text-foreground-secondary">
          Learning Mode
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
