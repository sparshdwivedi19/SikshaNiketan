"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Clock, CheckCircle2, XCircle, Minus } from "lucide-react";

const attendanceData = [
  { subject: "Physics", total: 48, present: 46, percent: 95.8 },
  { subject: "Chemistry", total: 46, present: 42, percent: 91.3 },
  { subject: "Mathematics", total: 44, present: 44, percent: 100 },
  { subject: "Doubt Clearing", total: 20, present: 15, percent: 75 },
];

const recentDays = [
  { date: "Mon, 30 Jun", physics: "P", chemistry: "P", maths: "P" },
  { date: "Tue, 1 Jul", physics: "P", chemistry: "A", maths: "P" },
  { date: "Wed, 2 Jul", physics: "P", chemistry: "P", maths: "P" },
  { date: "Thu, 3 Jul", physics: "P", chemistry: "P", maths: "P" },
  { date: "Fri, 4 Jul", physics: "A", chemistry: "P", maths: "P" },
];

export default function ParentAttendancePage() {
  const overallPercent = Math.round(
    attendanceData.reduce((sum, s) => sum + s.present, 0) /
    attendanceData.reduce((sum, s) => sum + s.total, 0) * 100
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1 flex items-center gap-3">
          <Clock size={28} className="text-brand-500" /> Attendance
        </h1>
        <p className="text-foreground-secondary">Track your child's class attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attendanceData.map((subject) => (
          <Card key={subject.subject} className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-foreground-primary">{subject.subject}</h3>
              <span className={`text-sm font-bold ${subject.percent >= 85 ? "text-green-600" : subject.percent >= 75 ? "text-amber-600" : "text-red-600"}`}>
                {subject.percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${subject.percent >= 85 ? "bg-green-500" : subject.percent >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${subject.percent}%` }}
              />
            </div>
            <p className="text-xs text-foreground-secondary">{subject.present}/{subject.total} classes attended</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold font-heading text-foreground-primary mb-5">Recent Attendance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="pb-3 font-medium text-foreground-secondary">Date</th>
                <th className="pb-3 font-medium text-foreground-secondary text-center">Physics</th>
                <th className="pb-3 font-medium text-foreground-secondary text-center">Chemistry</th>
                <th className="pb-3 font-medium text-foreground-secondary text-center">Maths</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentDays.map((day) => (
                <tr key={day.date} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 text-foreground-primary font-medium">{day.date}</td>
                  {[day.physics, day.chemistry, day.maths].map((status, i) => (
                    <td key={i} className="py-3 text-center">
                      {status === "P" ? (
                        <CheckCircle2 size={18} className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle size={18} className="text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className={`p-5 border-2 ${overallPercent >= 85 ? "border-green-200 bg-green-50 dark:bg-green-900/10" : "border-amber-200 bg-amber-50 dark:bg-amber-900/10"}`}>
        <p className="font-bold text-lg">
          Overall Attendance: <span className={overallPercent >= 85 ? "text-green-600" : "text-amber-600"}>{overallPercent}%</span>
        </p>
        <p className="text-sm text-foreground-secondary mt-1">
          {overallPercent >= 85 ? "✅ Excellent! Attendance is well above the 75% requirement." : "⚠️ Attendance is approaching the minimum requirement. Please ensure regular attendance."}
        </p>
      </Card>
    </div>
  );
}
