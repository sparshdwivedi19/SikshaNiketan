"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Award, Clock } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function TestResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const attemptId = unwrappedParams.attemptId;

  const [attempt, setAttempt] = useState<any>(null);
  const [test, setTest] = useState<any>(null);
  const [detailedAnswers, setDetailedAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tests/attempt/${attemptId}`);
        if (res.data.status === "success") {
          setAttempt(res.data.attempt);
          setTest(res.data.test);
          setDetailedAnswers(res.data.detailedAnswers || []);
        }
      } catch (err) {
        toast.error("Failed to load test result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="p-8 text-center text-lg">Loading result...</div>;
  if (!attempt) return <div className="p-8 text-center text-red-500 text-lg">Result not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="p-2" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary">Test Result</h1>
          <p className="text-foreground-secondary">{test?.title}</p>
        </div>
      </div>

      {/* Score Summary Card */}
      <Card className="p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="flex-1 space-y-4 z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold">
            {attempt.isPassed ? "Congratulations! You Passed" : "Keep Trying! You Did Not Pass"}
          </h2>
          <p className="text-brand-100 max-w-md">
            You scored {attempt.obtainedMarks} out of {attempt.totalMarks} marks in this test.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <div className="bg-black/20 rounded-lg p-3 min-w-[120px]">
              <div className="text-sm text-brand-200 mb-1 flex items-center gap-1"><Award size={14}/> Percentage</div>
              <div className="text-2xl font-bold">{Math.round(attempt.percentage)}%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 min-w-[120px]">
              <div className="text-sm text-brand-200 mb-1 flex items-center gap-1"><Clock size={14}/> Time Taken</div>
              <div className="text-2xl font-bold">
                {Math.floor((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000)} mins
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 z-10 bg-white p-6 rounded-full shadow-2xl flex flex-col items-center justify-center w-40 h-40 border-8 border-brand-200/20">
          <div className="text-4xl font-extrabold text-brand-600">{attempt.obtainedMarks}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Score</div>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <h2 className="text-2xl font-bold pt-4 pb-2 border-b">Detailed Answers Review</h2>
      
      <div className="space-y-6">
        {detailedAnswers.map((ans: any, index: number) => {
          const q = ans.question;
          if (!q) return null;

          // Determine if correct based on marks obtained
          const isCorrect = ans.marksObtained > 0;
          const isUnanswered = ans.status === "not_answered" || ans.status === "not_visited" || ans.status === "marked";
          
          return (
            <Card key={ans.questionId} className={`p-6 border-l-4 ${isUnanswered ? "border-l-gray-400" : isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="font-bold text-lg text-foreground-primary">Q{index + 1}. {q.text}</div>
                <div className="flex gap-2 shrink-0 ml-4">
                  {isUnanswered ? (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <AlertCircle size={16} /> Unanswered (0)
                    </span>
                  ) : isCorrect ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <CheckCircle2 size={16} /> Correct (+{ans.marksObtained})
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <XCircle size={16} /> Incorrect ({ans.marksObtained})
                    </span>
                  )}
                </div>
              </div>

              {/* Options mapping */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {q.options.map((opt: any) => {
                    // Check logic based on array or string
                    const isUserSelected = Array.isArray(ans.selectedAnswer) 
                      ? ans.selectedAnswer.includes(opt.id) 
                      : ans.selectedAnswer === opt.id;
                      
                    const isActualCorrect = Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.includes(opt.id)
                      : q.correctAnswer === opt.id;

                    let bgClass = "bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700";
                    if (isActualCorrect) {
                      bgClass = "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300";
                    } else if (isUserSelected && !isActualCorrect) {
                      bgClass = "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300";
                    }

                    return (
                      <div key={opt.id} className={`p-3 border rounded-lg ${bgClass} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <span className="font-bold opacity-50">{opt.id}.</span> 
                          <span>{opt.text}</span>
                        </div>
                        {isUserSelected && <div className="text-xs font-bold uppercase opacity-60">Your Answer</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True/False or Numerical Mapping */}
              {(!q.options || q.options.length === 0) && (
                <div className="mt-4 space-y-2">
                  <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/30 flex justify-between">
                    <span className="text-foreground-secondary">Your Answer:</span>
                    <span className={`font-bold ${isCorrect ? "text-green-600" : isUnanswered ? "text-gray-500" : "text-red-600"}`}>
                      {isUnanswered ? "N/A" : String(ans.selectedAnswer)}
                    </span>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 flex justify-between">
                    <span className="text-green-800 dark:text-green-300">Correct Answer:</span>
                    <span className="font-bold text-green-700 dark:text-green-400">{String(q.correctAnswer)}</span>
                  </div>
                </div>
              )}

              {/* Explanation */}
              {q.explanation && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-1">Explanation:</div>
                  <div className="text-sm text-blue-900 dark:text-blue-200">{q.explanation}</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
