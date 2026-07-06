"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Calendar, Clock, BookOpen, Video, FileText } from "lucide-react";

const scheduleData = [
  {
    day: "Monday",
    classes: [
      { time: "9:00 AM – 11:00 AM", subject: "Physics", topic: "Electromagnetic Induction", type: "live", color: "bg-blue-500" },
      { time: "3:00 PM – 4:30 PM", subject: "Mathematics", topic: "Differential Equations", type: "recorded", color: "bg-purple-500" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { time: "10:00 AM – 12:00 PM", subject: "Chemistry", topic: "Organic Chemistry — Reactions", type: "live", color: "bg-green-500" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { time: "9:00 AM – 11:00 AM", subject: "Physics", topic: "Modern Physics", type: "live", color: "bg-blue-500" },
      { time: "2:00 PM – 3:30 PM", subject: "Mathematics", topic: "Vector Algebra", type: "recorded", color: "bg-purple-500" },
      { time: "5:00 PM – 6:00 PM", subject: "Chemistry", topic: "Mock Test Review", type: "test", color: "bg-red-500" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { time: "10:00 AM – 12:00 PM", subject: "Chemistry", topic: "Electrochemistry", type: "live", color: "bg-green-500" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { time: "9:00 AM – 11:00 AM", subject: "Physics", topic: "Optics & Wave Optics", type: "live", color: "bg-blue-500" },
      { time: "1:00 PM – 2:00 PM", subject: "All Subjects", topic: "Doubt Clearing Session", type: "live", color: "bg-amber-500" },
    ],
  },
  {
    day: "Saturday",
    classes: [
      { time: "10:00 AM – 1:00 PM", subject: "All Subjects", topic: "Full Mock Test (JEE Pattern)", type: "test", color: "bg-red-500" },
    ],
  },
];

const typeIcons = {
  live: <Video size={14} />,
  recorded: <BookOpen size={14} />,
  test: <FileText size={14} />,
};

const typeLabels = {
  live: "Live Class",
  recorded: "Recorded",
  test: "Mock Test",
};

export default function SchedulePage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Class Schedule</h1>
          <p className="text-foreground-secondary flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"><Video size={12} /> Live</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"><BookOpen size={12} /> Recorded</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"><FileText size={12} /> Test</span>
        </div>
      </div>

      <div className="space-y-4">
        {scheduleData.map((daySchedule) => (
          <Card key={daySchedule.day} className={`overflow-hidden ${daySchedule.day === today ? "ring-2 ring-brand-500" : ""}`}>
            <div className={`px-6 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${
              daySchedule.day === today ? "bg-brand-50 dark:bg-brand-900/20" : "bg-gray-50 dark:bg-gray-800/30"
            }`}>
              <h3 className={`font-bold text-lg font-heading ${daySchedule.day === today ? "text-brand-600" : "text-foreground-primary"}`}>
                {daySchedule.day}
                {daySchedule.day === today && (
                  <span className="ml-2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">Today</span>
                )}
              </h3>
              <span className="text-sm text-foreground-secondary">{daySchedule.classes.length} session{daySchedule.classes.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="p-4 space-y-3">
              {daySchedule.classes.map((cls, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div className={`w-1.5 h-12 rounded-full ${cls.color} shrink-0`} />
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary font-medium w-36 shrink-0">
                    <Clock size={14} />
                    <span className="text-xs">{cls.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground-primary text-sm">{cls.subject}</p>
                    <p className="text-xs text-foreground-secondary mt-0.5">{cls.topic}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground-secondary shrink-0">
                    {typeIcons[cls.type as keyof typeof typeIcons]}
                    {typeLabels[cls.type as keyof typeof typeLabels]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
