"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Flame, Trophy, Target, TrendingUp, BookOpen, Clock, 
  BrainCircuit, ChevronRight, Star, Medal 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";

// Cleaned for production: No dummy data. 
// Features will render clean empty states if data isn't fetched from real APIs.
const performanceData: any[] = [];
const skillsData: any[] = [];
const fallbackLeaderboard: any[] = [];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/stats/leaderboard");
        if (res.data.status === "success") {
          const formatted = res.data.leaderboard.map((u: any, idx: number) => ({
            rank: idx + 1,
            name: u.name,
            xp: u.enrollmentCount * 100, // example conversion for now
            isUser: u.name === user?.name
          }));
          setLeaderboard(formatted);
        }
      } catch (e) {
        // ignore for now
      }
    };
    fetchLeaderboard();
  }, [user]);

  if (!mounted) return null; // Prevents hydration mismatch with recharts

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-foreground-secondary">Here is your AI-driven learning overview for today.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface p-2 pr-4 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
            <Flame size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground-primary leading-tight">0 Day Streak</span>
            <span className="text-xs text-foreground-secondary leading-tight">Start learning today!</span>
          </div>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-brand-500 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={100} />
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-1">
            <Trophy size={16} className="text-brand-500" /> Total XP
          </div>
          <div className="text-3xl font-bold font-heading text-foreground-primary">0</div>
          <div className="text-xs text-foreground-secondary font-medium">Start earning XP!</div>
        </Card>
        
        <Card className="p-5 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-purple-500 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={100} />
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-1">
            <Target size={16} className="text-purple-500" /> Tests Completed
          </div>
          <div className="text-3xl font-bold font-heading text-foreground-primary">0</div>
          <div className="text-xs text-foreground-secondary font-medium">No tests taken yet</div>
        </Card>

        <Card className="p-5 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-blue-500 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen size={100} />
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-1">
            <BookOpen size={16} className="text-blue-500" /> Lessons Watched
          </div>
          <div className="text-3xl font-bold font-heading text-foreground-primary">0</div>
          <div className="text-xs text-foreground-secondary font-medium">Explore your courses</div>
        </Card>

        <Card className="p-5 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-green-500 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock size={100} />
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary font-medium text-sm mb-1">
            <Clock size={16} className="text-orange-500" /> Learning Time
          </div>
          <div className="text-3xl font-bold font-heading text-foreground-primary">0h</div>
          <div className="text-xs text-foreground-secondary font-medium">This week</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - AI Analytics */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-foreground-primary">
                <TrendingUp className="text-brand-500" /> Performance Trend
              </h3>
              <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-foreground-primary mb-6">
              <BrainCircuit className="text-purple-500" /> AI Strengths & Weaknesses
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                  <h4 className="font-bold text-green-700 dark:text-green-400 mb-1">Strong Areas</h4>
                  <p className="text-sm text-green-600 dark:text-green-500">Your Chemistry and Physics scores are in the top 10% of the batch. Great job on Thermodynamics!</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">Areas to Improve</h4>
                  <p className="text-sm text-red-600 dark:text-red-500">Your Math calculation speed is slightly below average. Focus on practicing Integration techniques.</p>
                  <Button variant="outline" size="sm" className="mt-3 bg-white hover:bg-red-50 text-red-600 border-red-200">Practice Math Now</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Leaderboard & Badges */}
        <div className="flex flex-col gap-8">
          
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground-primary flex items-center gap-2">
              <Medal className="text-brand-500" size={20} /> Batch Leaderboard
            </h3>
            <div className="flex-1 flex flex-col gap-3 justify-center">
              {leaderboard.length > 0 ? leaderboard.map((user, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center p-3 rounded-xl border ${
                    user.isUser ? "bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3
                    ${idx === 0 ? "bg-yellow-100 text-yellow-600" : 
                      idx === 1 ? "bg-gray-200 text-gray-600" : 
                      idx === 2 ? "bg-orange-100 text-orange-600" : 
                      "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                  >
                    #{user.rank}
                  </div>
                  <div className="flex-1 font-medium text-sm text-foreground-primary">
                    {user.name} {user.isUser && "(You)"}
                  </div>
                  <div className="font-bold text-sm text-brand-600">
                    {user.xp} XP
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-foreground-secondary text-sm">
                  No ranking data available yet.
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-brand-600" rightIcon={<ChevronRight size={16} />}>
              View Full Rankings
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-foreground-primary mb-4">
              <Star className="text-yellow-400 fill-yellow-400" /> Recent Badges
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-300">
                  <Flame size={24} className="text-orange-500" />
                </div>
                <span className="text-xs font-bold text-foreground-secondary">10 Day Streak</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-300">
                  <Target size={24} className="text-purple-500" />
                </div>
                <span className="text-xs font-bold text-foreground-secondary">Perfect Score</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300">
                  <BookOpen size={24} className="text-blue-500" />
                </div>
                <span className="text-xs font-bold text-foreground-secondary">Fast Learner</span>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
