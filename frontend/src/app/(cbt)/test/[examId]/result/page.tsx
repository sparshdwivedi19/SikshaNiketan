"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Award, ArrowLeft } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TestResultPage({ params }: { params: { examId: string } }) {
  const testId = params.examId;
  const [attemptDetails, setAttemptDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Fetch attempts for this test by current user, pick the most recent
        const attemptsRes = await api.get(`/tests/${testId}/attempts/me`);
        if (attemptsRes.data.status === "success" && attemptsRes.data.attempts.length > 0) {
          const latestAttempt = attemptsRes.data.attempts[0]; // Already sorted by -createdAt
          
          if (latestAttempt.status !== "submitted") {
            // Still in progress, redirect to test
            window.location.href = `/test/${testId}`;
            return;
          }

          // Fetch full details of the attempt
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

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-xl text-brand-600">Loading Result...</div>;

  if (!attemptDetails) return <div className="flex h-screen items-center justify-center font-bold text-xl">No result found.</div>;

  const { attempt, test, detailedAnswers } = attemptDetails;

  const totalQuestions = test.questions?.length || 0;
  const attempted = detailedAnswers.filter((a: any) => a.selectedAnswer !== null && a.selectedAnswer !== undefined && (Array.isArray(a.selectedAnswer) ? a.selectedAnswer.length > 0 : String(a.selectedAnswer).trim() !== "")).length;
  const correct = detailedAnswers.filter((a: any) => a.marksObtained > 0).length;
  const incorrect = attempted - correct;
  const unattempted = totalQuestions - attempted;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-primary p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/dashboard/student/courses`}>
            <Button variant="outline" size="icon"><ArrowLeft size={16} /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground-primary">Test Result</h1>
            <p className="text-foreground-secondary">{test.title}</p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-background-secondary p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center shadow-sm">
            <Award size={40} className={attempt.isPassed ? "text-green-500 mb-2" : "text-red-500 mb-2"} />
            <h2 className="text-4xl font-black text-foreground-primary">{attempt.percentage.toFixed(1)}%</h2>
            <p className="text-sm font-bold text-foreground-secondary mt-1">{attempt.isPassed ? "PASSED" : "FAILED"}</p>
          </div>
          
          <div className="bg-white dark:bg-background-secondary p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-center shadow-sm">
            <div className="text-sm text-foreground-secondary font-bold mb-1">Total Score</div>
            <div className="text-3xl font-black text-brand-600">{attempt.obtainedMarks} <span className="text-xl text-gray-400">/ {attempt.totalMarks}</span></div>
          </div>

          <div className="bg-white dark:bg-background-secondary p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-center shadow-sm md:col-span-2">
            <div className="text-sm font-bold text-foreground-secondary mb-3">Performance Overview</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="text-2xl font-black text-green-600">{correct}</div>
                <div className="text-xs font-bold text-green-700">Correct</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800/30">
                <div className="text-2xl font-black text-red-600">{incorrect}</div>
                <div className="text-xs font-bold text-red-700">Incorrect</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-black text-gray-600">{unattempted}</div>
                <div className="text-xs font-bold text-gray-500">Unattempted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Solutions */}
        <h2 className="text-2xl font-bold font-heading text-foreground-primary mt-8 mb-4">Detailed Solutions</h2>
        <div className="space-y-6">
          {detailedAnswers.map((ans: any, idx: number) => {
            const q = ans.question;
            if (!q) return null;

            const isCorrect = ans.marksObtained > 0;
            const isUnattempted = !ans.selectedAnswer || (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length === 0) || String(ans.selectedAnswer).trim() === "";

            return (
              <div key={q._id} className="bg-white dark:bg-background-secondary p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">Q{idx + 1}</span>
                    {isUnattempted ? (
                      <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Info size={16}/> Unattempted</span>
                    ) : isCorrect ? (
                      <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Correct (+{q.marks})</span>
                    ) : (
                      <span className="text-sm font-bold text-red-600 flex items-center gap-1"><XCircle size={16}/> Incorrect (-{q.negativeMarks})</span>
                    )}
                  </div>
                </div>

                <div className="text-base font-medium mb-6 whitespace-pre-wrap">{q.text}</div>

                {q.type.startsWith("mcq") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {q.options?.map((opt: any) => {
                      const isSelected = Array.isArray(ans.selectedAnswer) ? ans.selectedAnswer.includes(opt.id) : ans.selectedAnswer === opt.id;
                      const isActuallyCorrect = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt.id) : q.correctAnswer === opt.id;
                      
                      let style = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30";
                      
                      if (isActuallyCorrect) style = "border-green-500 bg-green-50 dark:bg-green-900/20";
                      else if (isSelected && !isActuallyCorrect) style = "border-red-500 bg-red-50 dark:bg-red-900/20";

                      return (
                        <div key={opt.id} className={`p-3 rounded-xl border flex items-start gap-3 ${style}`}>
                          <span className="font-bold shrink-0">{opt.id}.</span>
                          <span className="text-sm font-medium">{opt.text}</span>
                          {isActuallyCorrect && <CheckCircle size={18} className="text-green-500 ml-auto shrink-0" />}
                          {isSelected && !isActuallyCorrect && <XCircle size={18} className="text-red-500 ml-auto shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {(q.type === "numerical" || q.type === "truefalse") && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 min-w-[200px]">
                      <span className="text-xs font-bold text-gray-500 block mb-1">Your Answer</span>
                      <span className="font-bold text-lg">{isUnattempted ? "—" : ans.selectedAnswer}</span>
                    </div>
                    <div className="p-3 rounded-xl border border-green-200 bg-green-50 text-green-800 min-w-[200px]">
                      <span className="text-xs font-bold block mb-1">Correct Answer</span>
                      <span className="font-bold text-lg">{q.correctAnswer}</span>
                    </div>
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1 uppercase tracking-wider">Explanation</span>
                    <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">{q.explanation}</p>
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
