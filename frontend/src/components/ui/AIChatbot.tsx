"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/utils/cn";

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatOptions: any = {
    initialMessages: [
      { id: "1", role: "assistant", content: "Hi! I'm your Shiksha Niketan AI Mentor. Need help with a concept, or want me to create a practice question for you?" }
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
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-surface rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Mentor</h3>
                  <p className="text-xs text-brand-100">Always online to help you</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-brand-100 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-background-secondary custom-scrollbar">
              {messages.map((msg: any) => (
                <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.role === "user" ? "self-end flex-row-reverse" : "self-start")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white", msg.role === "user" ? "bg-gray-800" : "bg-brand-500")}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn("p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap", 
                    msg.role === "user" 
                      ? "bg-brand-600 text-white rounded-tr-none" 
                      : "bg-surface text-foreground-primary rounded-tl-none border border-gray-100 dark:border-gray-800"
                  )}>
                    {(msg as any).content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white bg-brand-500">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl text-sm shadow-sm bg-surface text-foreground-primary rounded-tl-none border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-surface border-t border-gray-200 dark:border-gray-800 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a doubt..."
                  className="flex-1 bg-background-primary rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-foreground-primary"
                />
                <button 
                  type="submit" 
                  disabled={!input || !input.trim() || isLoading}
                  className="absolute right-1.5 w-8 h-8 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send size={14} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};
