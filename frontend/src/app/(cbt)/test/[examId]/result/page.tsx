"use client";

import React, { useState, useEffect, use } from "react";
import { CheckCircle, XCircle, Clock, Award, ArrowLeft, Trophy, Zap, ShieldCheck } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function TestResultPage({ params }: { params: Promise<{ examId: string }> }) {
  const unwrappedParams = use(params);
  const testId = unwrappedParams.examId;
  const [attemptDetails, setAttemptDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const attemptsRes = await api.get(`/tests/${testId}/attempts/me`);
        if (attemptsRes.data.status === "success" && attemptsRes.data.attempts.length > 0) {
          const latestAttempt = attemptsRes.data.attempts[0];
          
          if (latestAttempt.status !== "submitted") {
            window.location.href = `/test/${testId}`;
            return;
          }

          const detailsRes = await api.get(`/tests/attempt/${latestAttempt._id}`);
          if (detailsRes.data.status === "success") {
            setAttemptDetails(detailsRes.data);
          }
        }
      } catch (error: any) {
        toast.error("Failed to load result");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [testId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold">Analyzing CBT Test Performance...</p>
      </div>
    );
  }

  if (!attemptDetails) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 text-center">
          <p className="text-slate-300 font-bold mb-4">No exam attempt record found.</p>
          <Link href="/dashboard/student/courses">
            <Button variant="primary">Return to Student Portal</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { attempt, test, detailedAnswers } = attemptDetails;
  const totalQuestions = test.questions?.length || 0;
  const attempted = detailedAnswers.filter((a: any) => a.selectedAnswer !== null && a.selectedAnswer !== undefined && (Array.isArray(a.selectedAnswer) ? a.selectedAnswer.length > 0 : String(a.selectedAnswer).trim() !== "")).length;
  const correct = detailedAnswers.filter((a: any) => a.marksObtained > 0).length;
  const incorrect = attempted - correct;
  const unattempted = totalQuestions - attempted;

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student/courses">
            <Button variant="outline" size="sm" className="rounded-xl border-white/20 text-white">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Official CBT Result & Solution Key
            </span>
            <h1 className="text-3xl font-black font-heading text-white mt-1">{test.title}</h1>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 text-center flex flex-col items-center justify-center shadow-2xl backdrop-blur-2xl">
            <Trophy size={40} className={attempt.isPassed ? "text-amber-400 mb-2" : "text-rose-500 mb-2"} />
            <h2 className="text-4xl font-black text-white">{attempt.percentage.toFixed(1)}%</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 mt-1">{attempt.isPassed ? "PASSED" : "FAILED"}</p>
          </div>
          
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 flex flex-col justify-center shadow-2xl backdrop-blur-2xl">
            <span className="text-xs text-slate-300 font-bold uppercase">Total Marks</span>
            <div className="text-3xl font-black text-white mt-1">{attempt.obtainedMarks} <span className="text-lg text-slate-400 font-normal">/ {attempt.totalMarks}</span></div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 flex flex-col justify-center shadow-2xl backdrop-blur-2xl md:col-span-2">
            <span className="text-xs text-slate-300 font-bold uppercase mb-3 block">Breakdown</span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-2xl font-black text-emerald-400">{correct}</div>
                <div className="text-[10px] font-bold uppercase text-emerald-300">Correct</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <div className="text-2xl font-black text-rose-400">{incorrect}</div>
                <div className="text-[10px] font-bold uppercase text-rose-300">Incorrect</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10">
                <div className="text-2xl font-black text-slate-300">{unattempted}</div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Left</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Solution Review */}
        <h2 className="text-2xl font-black font-heading text-white pt-4">Question Solutions & Explanations</h2>
        <div className="space-y-6">
          {detailedAnswers.map((ans: any, idx: number) => {
            const q = ans.question;
            if (!q) return null;

            const isCorrect = ans.marksObtained > 0;
            const isUnattempted = !ans.selectedAnswer || (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length === 0) || String(ans.selectedAnswer).trim() === "";

            return (
              <div key={q._id} className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-sm bg-slate-950 px-3 py-1 rounded-xl border border-white/10 text-indigo-400">
                    Q{idx + 1}
                  </span>
                  {isUnattempted ? (
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full">Unattempted</span>
                  ) : isCorrect ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={14} /> Correct (+{q.marks})
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <XCircle size={14} /> Incorrect (-{q.negativeMarks})
                    </span>
                  )}
                </div>

                <p className="text-base font-bold text-white mb-6 leading-relaxed">{q.text}</p>

                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
                    <span className="font-extrabold uppercase text-indigo-400 block mb-1">Faculty Solution Hint</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
