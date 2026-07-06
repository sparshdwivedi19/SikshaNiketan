"use client";

import React, { useState } from "react";
import { PlayCircle, CheckCircle2, Lock, FileText, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dummy data for LMS
const dummyCurriculum = [
  {
    module: "Module 1: Mechanics Foundation",
    lessons: [
      { id: "l1", title: "Introduction to Kinematics", duration: "45:00", type: "video", isCompleted: true },
      { id: "l2", title: "Newton's Laws of Motion", duration: "52:20", type: "video", isCompleted: false },
      { id: "l3", title: "Module 1 Practice Assignment", duration: "30 Mins", type: "pdf", isCompleted: false },
    ]
  },
  {
    module: "Module 2: Thermodynamics",
    lessons: [
      { id: "l4", title: "Laws of Thermodynamics", duration: "1:05:00", type: "video", isLocked: true },
      { id: "l5", title: "Heat Transfer", duration: "48:10", type: "video", isLocked: true },
    ]
  }
];

export default function CoursePlayerPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Left Area - Player & Details */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background custom-scrollbar">
        {/* Video Player Placeholder */}
        <div className="w-full bg-black aspect-video relative group flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-900/40 flex items-center justify-center transition-opacity opacity-100 group-hover:opacity-100">
             <button className="w-20 h-20 bg-brand-600/90 hover:bg-brand-500 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-transform hover:scale-110 shadow-2xl">
               <PlayCircle size={40} className="ml-1" />
             </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white/80 text-sm">
             <span>00:00 / 52:20</span>
             <span>Newton's Laws of Motion</span>
          </div>
        </div>

        {/* Video Details & Tabs */}
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-foreground-primary">
            Newton's Laws of Motion
          </h1>

          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto hide-scrollbar">
            {["overview", "notes", "discussions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? "border-brand-500 text-brand-600 dark:text-brand-400" 
                    : "border-transparent text-foreground-secondary hover:text-foreground-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === "overview" && (
              <div className="prose dark:prose-invert max-w-none text-foreground-secondary">
                <p>In this lesson, we dive deep into Newton's three laws of motion. This is the foundation of classical mechanics and will be heavily tested in the JEE Main and Advanced examinations.</p>
                <h3 className="text-foreground-primary font-heading mt-6 mb-2">Key Topics Covered:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Inertia and Reference Frames</li>
                  <li>F = ma (Derivation and Application)</li>
                  <li>Action and Reaction Pairs</li>
                  <li>Free Body Diagrams (FBDs)</li>
                </ul>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-foreground-secondary">
                <FileText size={48} className="mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-foreground-primary mb-2">Downloadable Resources</h3>
                <p className="mb-6">Get access to class notes and practice sheets.</p>
                <Button variant="outline">Download PDF Notes</Button>
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-foreground-secondary">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-foreground-primary mb-2">Q&A Forum</h3>
                <p>Ask doubts and discuss with peers and mentors.</p>
                <Button className="mt-4">Ask a Question</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Area - Curriculum Sidebar */}
      <div className="w-full lg:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary h-full flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-background-secondary/80 backdrop-blur-md z-10">
          <h2 className="font-bold text-lg text-foreground-primary">Course Content</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 w-[20%] rounded-full"></div>
            </div>
            <span className="text-xs font-semibold text-foreground-secondary">20%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {dummyCurriculum.map((mod, idx) => (
            <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/20 cursor-pointer">
                <h3 className="font-bold text-sm text-foreground-primary">{mod.module}</h3>
                <ChevronDown size={16} className="text-foreground-secondary" />
              </div>
              <div className="flex flex-col">
                {mod.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`p-4 pl-8 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer ${lesson.id === "l2" ? "bg-brand-50/50 dark:bg-brand-900/10 border-l-2 border-brand-500" : ""}`}
                  >
                    <div className="mt-0.5">
                      {lesson.isLocked ? (
                        <Lock size={16} className="text-gray-400" />
                      ) : lesson.isCompleted ? (
                        <CheckCircle2 size={16} className="text-brand-500" />
                      ) : lesson.type === "video" ? (
                        <PlayCircle size={16} className={lesson.id === "l2" ? "text-brand-600" : "text-gray-400"} />
                      ) : (
                        <FileText size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className={`text-sm font-medium ${lesson.id === "l2" ? "text-brand-600 dark:text-brand-400" : "text-foreground-primary"}`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-foreground-secondary mt-1">{lesson.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
