"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/utils/cn";

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatOptions: any = {
    initialMessages: [
      { id: "1", role: "assistant", content: "Hello! I am your Shiksha AI Co-Pilot. Need instant doubt clarification in Physics, Chemistry, or Math?" }
    ]
  };
  const chat = useChat(chatOptions) as any;
  const { messages, input, handleInputChange, handleSubmit, isLoading } = chat;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[520px] glass-card-dark rounded-3xl shadow-2xl border border-white/15 flex flex-col overflow-hidden text-white"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 p-4 flex justify-between items-center shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center text-cyan-400">
                  <Bot size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Shiksha AI Co-Pilot <Sparkles size={14} className="text-cyan-400" />
                  </h3>
                  <p className="text-[10px] text-indigo-100 font-medium">24/7 Academic Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-950/90 text-xs">
              {messages.map((msg: any) => (
                <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.role === "user" ? "self-end flex-row-reverse" : "self-start")}>
                  <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs", msg.role === "user" ? "bg-slate-800 text-white" : "bg-indigo-600 text-white")}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn("p-3 rounded-2xl leading-relaxed shadow-sm", 
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none" 
                      : "bg-slate-900 text-slate-200 rounded-tl-none border border-white/10"
                  )}>
                    {(msg as any).content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 max-w-[85%] self-start">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white bg-indigo-600">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 rounded-tl-none border border-white/10">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-900 border-t border-white/10 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask any Physics, Chem or Math question..."
                  className="w-full bg-slate-950 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 border border-slate-800"
                />
                <button 
                  type="submit" 
                  disabled={!input || !input.trim() || isLoading}
                  className="absolute right-1.5 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white rounded-2xl shadow-neon-indigo flex items-center justify-center transition-all p-[1px]"
      >
        <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-indigo-400">
          {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </div>
      </motion.button>
    </div>
  );
};

