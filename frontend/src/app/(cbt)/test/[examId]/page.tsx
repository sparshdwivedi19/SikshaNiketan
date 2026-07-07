"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Info } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CBTPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const testId = params.examId;

  const [test, setTest] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]); 
  const [timeLeft, setTimeLeft] = useState(0);

  // Auto-sync timer ref
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
          setAnswers(attemptData.answers);

          const testRes = await api.get(`/tests/${testId}`);
          if (testRes.data.status === "success") {
            const testData = testRes.data.test;
            setTest(testData);
            
            // Calculate time left based on attempt start time and test duration
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

  // Sync Answers Periodically
  useEffect(() => {
    if (attempt && !isSubmitting) {
      syncTimerRef.current = setInterval(async () => {
        try {
          await api.put(`/tests/attempt/${attempt._id}/sync`, { answers });
        } catch (e) {
          console.error("Auto-sync failed");
        }
      }, 30000); // sync every 30 seconds
    }
    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [attempt, answers, isSubmitting]);

  // Countdown Timer
  useEffect(() => {
    if (isLoading || isSubmitting || timeLeft <= 0) {
      if (timeLeft === 0 && attempt && !isSubmitting) {
        handleSubmitTest(); // Auto submit when time is up
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

  const updateAnswerState = (qId: string, updates: any) => {
    setAnswers(prev => prev.map(a => a.questionId === qId ? { ...a, ...updates } : a));
  };

  const activeQuestionIndex = test?.questions?.findIndex((q: any) => q._id === activeQuestionId);
  const activeQuestion = test?.questions?.[activeQuestionIndex];
  const activeAnswer = answers.find(a => a.questionId === activeQuestionId);

  const handleAction = async (status: string) => {
    updateAnswerState(activeQuestionId!, { status });
    // Go to next question if not at the end
    if (activeQuestionIndex < test.questions.length - 1) {
      setActiveQuestionId(test.questions[activeQuestionIndex + 1]._id);
    }
  };

  const handleClearResponse = () => {
    updateAnswerState(activeQuestionId!, { selectedAnswer: null, status: "not_answered" });
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    if (timeLeft > 0 && !confirm("Are you sure you want to submit the test early?")) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.post(`/tests/attempt/${attempt._id}/submit`, { answers });
      if (res.data.status === "success") {
        toast.success("Test submitted successfully!");
        router.push(`/test/${testId}/result`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit test");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-bold text-xl text-[#1e3a8a]">Loading Test Environment...</div>;
  }

  if (!test) {
    return <div className="flex h-screen items-center justify-center font-bold text-xl text-red-600">Test not found.</div>;
  }

  // Calculate stats for palette
  const counts = {
    answered: answers.filter(a => a.status === "answered").length,
    not_answered: answers.filter(a => a.status === "not_answered").length,
    not_visited: answers.filter(a => a.status === "not_visited").length,
    marked: answers.filter(a => a.status === "marked").length,
    answered_marked: answers.filter(a => a.status === "answered_marked").length,
  };

  return (
    <div className="flex w-full h-screen bg-white text-gray-800 text-sm overflow-hidden select-none">
      
      {/* Left Area - Question View */}
      <div className="flex-1 flex flex-col border-r border-gray-300 relative">
        
        {/* Header */}
        <div className="flex bg-[#1e3a8a] text-white p-3 justify-between items-center shadow-md z-10">
          <div className="font-bold text-lg">{test.title}</div>
          <div className="font-bold opacity-80">{test.questions?.length || 0} Questions</div>
        </div>

        {/* Question Area */}
        {activeQuestion ? (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-end border-b border-gray-300 pb-2 mb-6">
              <span className="font-bold text-xl text-[#1e3a8a]">Question No. {activeQuestionIndex + 1}</span>
              <div className="flex gap-4 text-xs font-bold opacity-70">
                <span className="text-green-600">+{activeQuestion.marks} Marks</span>
                <span className="text-red-600">-{activeQuestion.negativeMarks} Marks</span>
              </div>
            </div>

            <div className="text-base mb-8 font-medium whitespace-pre-wrap leading-relaxed text-gray-900">
              {activeQuestion.text}
            </div>

            <div className="flex flex-col gap-4 pl-2 max-w-3xl">
              {activeQuestion.type === "mcq-single" && activeQuestion.options?.map((opt: any) => (
                <label key={opt.id} className="flex items-start gap-4 cursor-pointer p-4 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors">
                  <input 
                    type="radio" 
                    name={`q-${activeQuestion._id}`} 
                    className="w-5 h-5 mt-0.5 cursor-pointer accent-[#1e3a8a]" 
                    checked={activeAnswer?.selectedAnswer === opt.id}
                    onChange={() => updateAnswerState(activeQuestion._id, { selectedAnswer: opt.id })}
                  />
                  <div className="flex-1">
                    <span className="font-bold mr-2">{opt.id}.</span>
                    <span className="text-base font-medium">{opt.text}</span>
                  </div>
                </label>
              ))}

              {activeQuestion.type === "mcq-multiple" && activeQuestion.options?.map((opt: any) => {
                const isSelected = Array.isArray(activeAnswer?.selectedAnswer) && activeAnswer.selectedAnswer.includes(opt.id);
                return (
                  <label key={opt.id} className="flex items-start gap-4 cursor-pointer p-4 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 mt-0.5 cursor-pointer accent-[#1e3a8a]" 
                      checked={isSelected}
                      onChange={(e) => {
                        let current = Array.isArray(activeAnswer?.selectedAnswer) ? [...activeAnswer.selectedAnswer] : [];
                        if (e.target.checked) current.push(opt.id);
                        else current = current.filter(id => id !== opt.id);
                        updateAnswerState(activeQuestion._id, { selectedAnswer: current });
                      }}
                    />
                    <div className="flex-1">
                      <span className="font-bold mr-2">{opt.id}.</span>
                      <span className="text-base font-medium">{opt.text}</span>
                    </div>
                  </label>
                );
              })}

              {activeQuestion.type === "truefalse" && (
                <div className="flex gap-6">
                  {["True", "False"].map(val => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 min-w-[120px]">
                      <input 
                        type="radio" 
                        name={`q-${activeQuestion._id}`} 
                        checked={activeAnswer?.selectedAnswer === val}
                        onChange={() => updateAnswerState(activeQuestion._id, { selectedAnswer: val })}
                        className="w-5 h-5 accent-[#1e3a8a]" 
                      />
                      <span className="font-bold">{val}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeQuestion.type === "numerical" && (
                <div className="w-64">
                  <input 
                    type="text" 
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:border-[#1e3a8a]" 
                    placeholder="Enter value..."
                    value={activeAnswer?.selectedAnswer || ""}
                    onChange={(e) => updateAnswerState(activeQuestion._id, { selectedAnswer: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center font-bold text-gray-400">Select a question from the palette</div>
        )}

        {/* Bottom Action Buttons */}
        <div className="border-t border-gray-300 bg-[#f8f9fa] p-4 flex gap-3 flex-wrap">
          <button 
            onClick={() => handleAction("answered")}
            className="px-6 py-2.5 bg-[#28a745] text-white font-bold rounded hover:bg-[#218838] transition-colors shadow-sm"
          >
            Save & Next
          </button>
          <button 
            onClick={handleClearResponse}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50 transition-colors shadow-sm"
          >
            Clear Response
          </button>
          <button 
            onClick={() => handleAction("marked")}
            className="px-6 py-2.5 bg-[#ffc107] text-black font-bold rounded hover:bg-[#e0a800] transition-colors shadow-sm"
          >
            Mark for Review & Next
          </button>
          <button 
            onClick={() => handleAction("answered_marked")}
            className="px-6 py-2.5 bg-[#17a2b8] text-white font-bold rounded hover:bg-[#138496] transition-colors shadow-sm"
          >
            Save & Mark for Review
          </button>
        </div>
      </div>

      {/* Right Area - Question Palette */}
      <div className="w-80 flex flex-col bg-[#e9ecef] shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.1)] z-20">
        
        {/* Timer Box */}
        <div className="bg-white p-4 flex flex-col items-center border-b border-gray-300 shadow-sm">
          <div className="font-bold text-gray-500 mb-1">Time Left</div>
          <div className={`text-3xl font-bold font-mono flex items-center gap-2 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-[#1e3a8a]'}`}>
            <Clock size={24} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold border-b border-gray-300 bg-white shadow-sm">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 shadow-inner">{counts.not_visited}</div> Not Visited</div>
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-red-500 text-white rounded-bl-xl rounded-tr-xl flex items-center justify-center shadow-inner">{counts.not_answered}</div> Not Answered</div>
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-green-500 text-white rounded-bl-xl rounded-tr-xl flex items-center justify-center shadow-inner">{counts.answered}</div> Answered</div>
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-inner">{counts.marked}</div> Marked</div>
          <div className="flex items-center gap-2 col-span-2"><div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-inner relative"><div className="w-2.5 h-2.5 bg-green-400 rounded-full absolute bottom-0 right-0 border border-white"></div></div> Answered & Marked for Review</div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto bg-[#f8f9fa]">
          <h3 className="font-bold mb-4 text-[#1e3a8a] border-b pb-2">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {test?.questions?.map((q: any, index: number) => {
              const ansState = answers.find(a => a.questionId === q._id);
              const status = ansState ? ansState.status : "not_visited";
              
              let style = "bg-gray-200 text-gray-600 border border-gray-300 rounded-full"; // not visited
              if (status === "answered") style = "bg-green-500 text-white rounded-bl-xl rounded-tr-xl border-green-600";
              else if (status === "not_answered") style = "bg-red-500 text-white rounded-bl-xl rounded-tr-xl border-red-600";
              else if (status === "marked") style = "bg-purple-600 text-white rounded-full";
              else if (status === "answered_marked") style = "bg-purple-600 text-white rounded-full border border-purple-800";
              
              if (q._id === activeQuestionId) style += " ring-2 ring-blue-500 ring-offset-2";

              return (
                <button
                  key={q._id}
                  onClick={() => {
                    setActiveQuestionId(q._id);
                    if (status === "not_visited") updateAnswerState(q._id, { status: "not_answered" });
                  }}
                  className={`w-10 h-10 flex items-center justify-center font-bold shadow-sm transition-transform hover:scale-110 relative ${style}`}
                >
                  {index + 1}
                  {status === "answered_marked" && <div className="w-2.5 h-2.5 bg-green-400 rounded-full absolute bottom-0 right-0 border border-white"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="p-4 bg-white border-t border-gray-300 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1e3a8a] hover:bg-[#152a6b] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-md text-lg transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>

      </div>

    </div>
  );
}
