"use client";

import React, { useState, useEffect } from "react";
import { Clock, Info } from "lucide-react";

// Dummy Data
const sections = ["Physics", "Chemistry", "Mathematics"];
const dummyQuestions = Array.from({ length: 90 }).map((_, i) => ({
  id: i + 1,
  section: sections[Math.floor(i / 30)],
  text: `This is a sample question ${i + 1} for ${sections[Math.floor(i / 30)]}. What is the correct answer?`,
  options: [
    { id: "A", text: "Option 1" },
    { id: "B", text: "Option 2" },
    { id: "C", text: "Option 3" },
    { id: "D", text: "Option 4" },
  ],
  status: "not_visited" // not_visited, not_answered, answered, marked, answered_marked
}));

export default function CBTPage() {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [questions, setQuestions] = useState(dummyQuestions);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const updateQuestionStatus = (id: number, status: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, status } : q));
    if (activeQuestionId < 90) setActiveQuestionId(activeQuestionId + 1);
  };

  const activeQuestion = questions.find(q => q.id === activeQuestionId);
  const sectionQuestions = questions.filter(q => q.section === activeSection);

  // Status Counts
  const counts = {
    answered: questions.filter(q => q.status === "answered").length,
    not_answered: questions.filter(q => q.status === "not_answered").length,
    not_visited: questions.filter(q => q.status === "not_visited").length,
    marked: questions.filter(q => q.status === "marked").length,
    answered_marked: questions.filter(q => q.status === "answered_marked").length,
  };

  return (
    <div className="flex w-full h-full bg-white text-gray-800 text-sm">
      
      {/* Left Area - Question View */}
      <div className="flex-1 flex flex-col border-r border-gray-300">
        
        {/* Sections Tab */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-300 font-bold text-[#1e3a8a]">
          {sections.map(sec => (
            <button 
              key={sec}
              onClick={() => {
                setActiveSection(sec);
                const firstQ = questions.find(q => q.section === sec);
                if (firstQ) setActiveQuestionId(firstQ.id);
              }}
              className={`px-6 py-2 border-r border-gray-300 ${activeSection === sec ? "bg-white border-b-2 border-b-blue-600" : "hover:bg-gray-200"}`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between font-bold border-b border-gray-300 pb-2 mb-4 text-lg">
            <span>Question No. {activeQuestion?.id}</span>
            <div className="flex items-center gap-2 text-red-600">
              <Info size={18} />
              <span>Downvote</span>
            </div>
          </div>

          <div className="text-base mb-8 font-medium whitespace-pre-wrap">
            {activeQuestion?.text}
          </div>

          <div className="flex flex-col gap-4 pl-4">
            {activeQuestion?.options.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="radio" name="answer" className="w-5 h-5 cursor-pointer accent-[#1e3a8a]" />
                <span className="text-base font-medium">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="border-t border-gray-300 bg-[#f8f9fa] p-4 flex gap-3 flex-wrap">
          <button 
            onClick={() => updateQuestionStatus(activeQuestionId, "answered")}
            className="px-6 py-2 bg-[#28a745] text-white font-bold rounded shadow-sm hover:bg-[#218838]"
          >
            Save & Next
          </button>
          <button 
            onClick={() => updateQuestionStatus(activeQuestionId, "not_answered")}
            className="px-6 py-2 bg-white border border-gray-400 text-gray-800 font-bold rounded shadow-sm hover:bg-gray-100"
          >
            Clear Response
          </button>
          <button 
            onClick={() => updateQuestionStatus(activeQuestionId, "marked")}
            className="px-6 py-2 bg-[#ffc107] text-black font-bold rounded shadow-sm hover:bg-[#e0a800]"
          >
            Mark for Review & Next
          </button>
          <button 
            onClick={() => updateQuestionStatus(activeQuestionId, "answered_marked")}
            className="px-6 py-2 bg-[#17a2b8] text-white font-bold rounded shadow-sm hover:bg-[#138496]"
          >
            Save & Mark for Review
          </button>
        </div>
      </div>

      {/* Right Area - Question Palette */}
      <div className="w-80 flex flex-col bg-[#e9ecef]">
        
        {/* Timer Box */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm">
          <div className="w-16 h-16 bg-gray-200 border-2 border-gray-300">
            {/* Image Placeholder */}
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-600">Time Left:</div>
            <div className="text-2xl font-bold font-mono text-[#1e3a8a] flex items-center gap-2">
              <Clock size={20} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 grid grid-cols-2 gap-2 text-xs font-bold border-b border-gray-300">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center border border-gray-400">{counts.not_visited}</div> Not Visited</div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-500 text-white rounded-bl-xl rounded-tr-xl flex items-center justify-center">{counts.not_answered}</div> Not Answered</div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-500 text-white rounded-bl-xl rounded-tr-xl flex items-center justify-center">{counts.answered}</div> Answered</div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white">{counts.marked}</div> Marked</div>
          <div className="flex items-center gap-2 col-span-2"><div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white relative"><div className="w-2 h-2 bg-green-400 rounded-full absolute bottom-0 right-0"></div></div> Answered & Marked for Review</div>
        </div>

        {/* Palette Section */}
        <div className="bg-[#5bc0de] text-white font-bold p-2 px-4">
          {activeSection}
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-bold mb-3 text-gray-700">Choose a Question</h3>
          <div className="grid grid-cols-5 gap-3">
            {sectionQuestions.map(q => {
              let style = "bg-gray-300 text-black border border-gray-400 rounded-full"; // not visited
              if (q.status === "answered") style = "bg-green-500 text-white rounded-bl-xl rounded-tr-xl border-green-600";
              else if (q.status === "not_answered") style = "bg-red-500 text-white rounded-bl-xl rounded-tr-xl border-red-600";
              else if (q.status === "marked") style = "bg-purple-600 text-white rounded-full";
              else if (q.status === "answered_marked") style = "bg-purple-600 text-white rounded-full border-2 border-green-400";
              else if (q.id === activeQuestionId) style = "bg-white text-black border-2 border-blue-600 rounded-full";

              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-10 h-10 flex items-center justify-center font-bold shadow-sm hover:scale-105 transition-transform ${style}`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="p-4 bg-gray-200 border-t border-gray-300">
          <button className="w-full py-3 bg-[#1e3a8a] hover:bg-[#152a6b] text-white font-bold rounded shadow-md text-lg">
            Submit Test
          </button>
        </div>

      </div>

    </div>
  );
}
