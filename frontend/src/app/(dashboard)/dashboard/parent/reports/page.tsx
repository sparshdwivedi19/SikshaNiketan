"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Award, TrendingUp } from "lucide-react";

const reports = [
  { id: 1, name: "Term 1 — JEE Mock Test Report", date: "2026-06-15", score: "78%", rank: "45/350", type: "pdf" },
  { id: 2, name: "Unit Test — Physics (Electromagnetic Induction)", date: "2026-05-20", score: "82%", rank: "30/350", type: "pdf" },
  { id: 3, name: "Monthly Progress Report — May 2026", date: "2026-05-31", score: "75%", rank: "52/350", type: "pdf" },
  { id: 4, name: "NLST Scholarship Test — Result", date: "2026-04-10", score: "91%", rank: "8/5000", type: "pdf" },
];

export default function ParentReportsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1 flex items-center gap-3">
          <Award size={28} className="text-brand-500" /> Test Reports
        </h1>
        <p className="text-foreground-secondary">View and download your child's academic performance reports.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-green-500">
          <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1"><TrendingUp size={14} className="text-green-500" /> Average Score</div>
          <div className="text-3xl font-bold text-foreground-primary">81.5%</div>
          <div className="text-xs text-green-500 font-medium mt-1">+6% vs last term</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-brand-500">
          <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1"><Award size={14} className="text-brand-500" /> Best Rank</div>
          <div className="text-3xl font-bold text-foreground-primary">8/5000</div>
          <div className="text-xs text-foreground-secondary font-medium mt-1">NLST Scholarship Test</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1"><FileText size={14} className="text-purple-500" /> Tests Taken</div>
          <div className="text-3xl font-bold text-foreground-primary">{reports.length}</div>
          <div className="text-xs text-foreground-secondary font-medium mt-1">This semester</div>
        </Card>
      </div>

      <Card>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground-primary">{report.name}</p>
                  <p className="text-xs text-foreground-secondary mt-0.5">
                    {new Date(report.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="font-bold text-foreground-primary">{report.score}</p>
                  <p className="text-xs text-foreground-secondary">Rank: {report.rank}</p>
                </div>
                <Button size="sm" variant="outline" leftIcon={<Download size={14} />} onClick={() => {}}>
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
