"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  GraduationCap, Clock, Award, Activity, LineChart as LineChartIcon,
  MessageCircle, FileText
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const performanceData = [
  { name: 'Mock Test 1', score: 65 },
  { name: 'Mock Test 2', score: 70 },
  { name: 'Mock Test 3', score: 68 },
  { name: 'Mock Test 4', score: 75 },
  { name: 'Mock Test 5', score: 82 },
];

export default function ParentDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">
            Parent Portal
          </h1>
          <p className="text-foreground-secondary">Monitor Student's academic progress and attendance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-background-secondary p-2 pr-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-lg">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground-primary leading-tight">Student V.</span>
            <span className="text-xs text-foreground-secondary leading-tight">JEE Advanced Batch A</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <Clock size={16} className="text-green-500" /> Attendance
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">94%</div>
          <div className="text-xs text-foreground-secondary font-medium">Excellent</div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <Activity size={16} className="text-blue-500" /> Avg Test Score
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">72%</div>
          <div className="text-xs text-green-500 font-medium">+5% this month</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <GraduationCap size={16} className="text-purple-500" /> Batch Rank
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">12<span className="text-lg text-gray-800">/350</span></div>
          <div className="text-xs text-foreground-secondary font-medium">Top 5%</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-2">
            <Award size={16} className="text-amber-500" /> Upcoming Fees
          </div>
          <div className="text-3xl font-bold text-foreground-primary mb-1">₹4,500</div>
          <div className="text-xs text-red-500 font-medium">Due in 5 days</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-heading text-foreground-primary flex items-center gap-2">
              <LineChartIcon className="text-brand-500" /> Performance Growth
            </h3>
            <Button variant="outline" size="sm">Download Report</Button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading text-foreground-primary mb-4">Teacher's Note</h3>
            <div className="bg-brand-50 dark:bg-brand-900/10 p-4 rounded-xl border border-brand-100 dark:border-brand-800">
              <p className="text-sm text-foreground-secondary mb-3">
                "Student has shown remarkable improvement in Physics conceptual understanding over the last two mock tests. Needs a bit more focus on organic chemistry reactions."
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-brand-700 dark:text-brand-400">- Mr. Sharma (Physics)</span>
                <span className="text-xs text-gray-900">2 days ago</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" rightIcon={<MessageCircle size={16} />}>Message Teacher</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading text-foreground-primary mb-4">Recent Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded">
                    <FileText size={16} />
                  </div>
                  <span className="text-sm font-medium">Term 1 Report Card</span>
                </div>
                <Button variant="ghost" size="sm" className="text-brand-600">PDF</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <FileText size={16} />
                  </div>
                  <span className="text-sm font-medium">Fee Receipt - June</span>
                </div>
                <Button variant="ghost" size="sm" className="text-brand-600">PDF</Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
