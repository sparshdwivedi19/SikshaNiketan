"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground-secondary ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-800 z-10 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 py-2 text-sm text-black dark:text-white font-medium transition-all",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              isPassword && !showPassword && "tracking-widest text-base",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 text-gray-800 hover:text-gray-600 focus:outline-none z-10 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 text-gray-800 z-10 pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && (
          <span className="text-xs text-red-500 ml-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
