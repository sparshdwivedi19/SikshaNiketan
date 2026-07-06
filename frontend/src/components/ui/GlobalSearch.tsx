"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronRight, Book, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const searchResults = [
  { id: 1, title: "JEE Advanced Physics Masterclass", type: "Course", icon: <PlayCircle size={16} /> },
  { id: 2, title: "Newton's Laws of Motion", type: "Lesson", icon: <Book size={16} /> },
  { id: 3, title: "Kinematics 1D Practice", type: "Test Series", icon: <Book size={16} /> },
];

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.length > 0) {
      setIsOpen(false);
      router.push("/courses");
      setQuery("");
    }
  };

  return (
    <div className="relative hidden md:block w-full max-w-sm" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-800 rounded-full leading-5 bg-gray-50 dark:bg-background-secondary text-gray-900 dark:text-foreground-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-background sm:text-sm transition-colors"
          placeholder="Search for courses, lessons..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full bg-white dark:bg-background-secondary rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Top Results
              </div>
              <ul className="flex flex-col gap-1">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <Link href={`/courses`} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg group transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-brand-500 bg-brand-50 dark:bg-brand-900/20 p-1.5 rounded-md">
                          {result.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground-primary line-clamp-1">{result.title}</span>
                          <span className="text-xs text-foreground-secondary">{result.type}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/courses");
                    setQuery("");
                  }}
                  className="w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700 py-2 transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
