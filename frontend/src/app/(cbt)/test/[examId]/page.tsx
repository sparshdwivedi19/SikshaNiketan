"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { Clock, Info, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function CBTPage({ params }: { params: Promise<{ examId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const testId = unwrappedParams.examId;

  const [test, setTest] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]); 
  const [timeLeft, setTimeLeft] = useState(0);

  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initTest = async () => {
      try {
        const attemptRes = await api.post(`/tests/${testId}/attempt/start`);
        if (attemptRes.data.status === "success") {
          const attemptData = attemptRes.data.attempt;
          if (attemptData.status === "submitted") {
            router.push(`/test/${testId}/result`);
            return;
          }
          setAttempt(attemptData);
          setAnswers(attemptData.answers || []);

          const testRes = await api.get(`/tests/${testId}`);
          if (testRes.data.status === "success") {
            const testData = testRes.data.test;
            setTest(testData);
            
            const startedAt = new Date(attemptData.startedAt).getTime();
            const durationMs = (testData.durationMinutes || 60) * 60 * 1000;
            const expiresAt = startedAt + durationMs;
            const now = Date.now();
            let remainingSecs = Math.floor((expiresAt - now) / 1000);
            if (remainingSecs < 0) remainingSecs = 0;
            
            setTimeLeft(remainingSecs);
            if (testData.questions && testData.questions.length > 0) {
              setActiveQuestionId(testData.questions[0]._id);
            }
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load test");
      } finally {
        setIsLoading(false);
      }
    };
    initTest();
  }, [testId, router]);

  useEffect(() => {
    if (isLoading || isSubmitting || timeLeft <= 0) {
      if (timeLeft === 0 && attempt && !isSubmitting) {
        handleSubmitTest();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting, attempt]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!activeQuestionId) return;
    setAnswers(prev => {
      const existingIdx = prev.findIndex(a => a.questionId === activeQuestionId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], selectedOption: optionIndex, status: "answered" };
        return updated;
      } else {
        return [...prev, { questionId: activeQuestionId, selectedOption: optionIndex, status: "answered" }];
      }
    });
  };

  const handleMarkForReview = () => {
    if (!activeQuestionId) return;
    setAnswers(prev => {
      const existingIdx = prev.findIndex(a => a.questionId === activeQuestionId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], status: "marked" };
        return updated;
      } else {
        return [...prev, { questionId: activeQuestionId, selectedOption: -1, status: "marked" }];
      }
    });
  };

  const handleClearResponse = () => {
    if (!activeQuestionId) return;
    setAnswers(prev => prev.filter(a => a.questionId !== activeQuestionId));
  };

  const handleSubmitTest = async () => {
    if (!attempt) return;
    setIsSubmitting(true);
    try {
      await api.put(`/tests/attempt/${attempt._id}/sync`, { answers });
      await api.post(`/tests/attempt/${attempt._id}/submit`);
      toast.success("Exam submitted successfully!");
      router.push(`/test/${testId}/result`);
    } catch (e: any) {
      toast.error("Error submitting test");
      setIsSubmitting(false);
    }
  };

  if (isLoading || !test) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold">Initiating NTA CBT Secure Environment...</p>
      </div>
    );
  }

  const activeQuestion = test.questions?.find((q: any) => q._id === activeQuestionId);
  const activeAnswer = answers.find(a => a.questionId === activeQuestionId);
  const activeOption = activeAnswer?.selectedOption;

  const getQuestionStatus = (qId: string) => {
    const ans = answers.find(a => a.questionId === qId);
    if (!ans) return "unvisited";
    return ans.status || (ans.selectedOption !== undefined ? "answered" : "unvisited");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top CBT Header */}
      <header className="h-16 bg-slate-900 border-b border-white/10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            CBT
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">{test.title}</h1>
            <p className="text-xs text-slate-400 font-medium">NTA Official Pattern CBT Simulator</p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-amber-400 font-mono text-base font-black">
          <Clock size={18} className="animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Area: Question Viewport */}
        <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-r border-white/10">
          {activeQuestion ? (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Question {(test.questions.findIndex((q: any) => q._id === activeQuestionId) + 1)} of {test.questions.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold">+4 Marks / -1 Negative</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-white mb-6 leading-relaxed">
                {activeQuestion.questionText}
              </h2>

              {/* Options Pills */}
              <div className="space-y-3">
                {activeQuestion.options?.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                      activeOption === idx
                        ? "bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo/20"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        activeOption === idx ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {activeOption === idx && <CheckCircle2 size={18} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Select a question from the palette.</p>
          )}

          {/* Bottom Control Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 mt-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearResponse} className="rounded-xl border-white/20 text-white text-xs">
                Clear Response
              </Button>
              <Button variant="outline" size="sm" onClick={handleMarkForReview} className="rounded-xl border-purple-500/30 text-purple-300 text-xs">
                Mark for Review
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const currentIdx = test.questions.findIndex((q: any) => q._id === activeQuestionId);
                if (currentIdx < test.questions.length - 1) {
                  setActiveQuestionId(test.questions[currentIdx + 1]._id);
                }
              }}
              className="rounded-xl font-bold"
              rightIcon={<ChevronRight size={16} />}
            >
              Save & Next
            </Button>
          </div>
        </div>

        {/* Right Area: NTA Question Palette */}
        <div className="lg:col-span-4 p-6 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4">Question Palette</h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400 mb-6">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /> Answered</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /> Marked for Review</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" /> Unvisited</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {test.questions?.map((q: any, i: number) => {
                const st = getQuestionStatus(q._id);
                let colorClass = "bg-slate-800 border-slate-700 text-slate-400";
                if (st === "answered") colorClass = "bg-emerald-600 text-white font-bold";
                if (st === "marked") colorClass = "bg-purple-600 text-white font-bold";
                if (q._id === activeQuestionId) colorClass += " ring-2 ring-indigo-400";

                return (
                  <button
                    key={q._id}
                    onClick={() => setActiveQuestionId(q._id)}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${colorClass}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            variant="danger"
            size="lg"
            onClick={handleSubmitTest}
            isLoading={isSubmitting}
            className="w-full h-12 rounded-xl font-bold mt-6 shadow-xl"
          >
            Submit Final Test
          </Button>
        </div>
      </div>
    </div>
  );
}
