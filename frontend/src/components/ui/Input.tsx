"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="w-full flex flex-col relative mb-1">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-500 dark:text-slate-300 z-10 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder || " "}
            className={cn(
              "peer w-full h-14 rounded-xl border border-gray-200 dark:border-brand-800 bg-surface dark:bg-background-secondary px-3.5 pt-5 pb-1 text-sm text-slate-900 dark:text-white font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-secondary",
              leftIcon && "pl-11",
              (rightIcon || isPassword) && "pr-11",
              error && "border-danger-500 focus-visible:ring-danger-500 bg-danger-50/10",
              isPassword && !showPassword && "tracking-widest text-base",
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label 
              className={cn(
                "absolute text-slate-600 dark:text-slate-300 transition-all duration-200 pointer-events-none",
                leftIcon ? "left-11" : "left-3.5",
                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                "peer-focus:top-3 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-brand-600 dark:peer-focus:text-indigo-300",
                "top-3 -translate-y-1/2 text-[11px] font-semibold",
                error && "text-danger-500 peer-focus:text-danger-500"
              )}
            >
              {label}
            </label>
          )}
          {isPassword ? (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3.5 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white focus:outline-none z-10 cursor-pointer transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 text-slate-500 dark:text-slate-300 z-10 pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>
        <AnimatePresence>
          {error && (
            <motion.span 
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              className="text-[11px] font-semibold text-danger-500 mt-1 ml-1"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
