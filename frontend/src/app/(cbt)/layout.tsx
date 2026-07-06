import React from "react";

export default function CBTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* NTA Style Header */}
      <header className="bg-[#1e3a8a] text-white p-2 flex justify-between items-center shadow-md shrink-0">
        <div className="font-bold text-xl tracking-wider">SHIKSHA NIKETAN CBT</div>
        <div className="flex gap-4 text-sm font-medium">
          <div className="bg-white/20 px-3 py-1 rounded">Candidate Name: Student</div>
          <div className="bg-white/20 px-3 py-1 rounded">Exam Name: JEE Main Full Test 1</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
