"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asMotion?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      asMotion = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

    const variants = {
      // Electric Indigo & Purple primary button with glow
      primary:
        "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-neon-indigo hover:shadow-[0_8px_30px_rgba(99,102,241,0.45)] font-semibold active:scale-[0.98]",
      // Golden Amber accent
      accent:
        "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_4px_20px_rgba(245,158,11,0.35)] font-bold active:scale-[0.98]",
      // Tinted secondary
      secondary:
        "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 font-medium",
      // Glass outline
      outline:
        "border border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 font-medium backdrop-blur-md",
      // Ghost
      ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-medium",
      // Danger
      danger:
        "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)] hover:brightness-110 font-semibold",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs tracking-wide gap-1.5",
      md: "h-11 px-5 text-sm font-medium gap-2",
      lg: "h-12 px-7 text-base font-semibold gap-2.5",
    };

    const compClass = cn(baseStyles, variants[variant], sizes[size], className);

    const innerContent = (
      <>
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (asMotion) {
      const motionProps = props as HTMLMotionProps<"button">;
      return (
        <motion.button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={compClass}
          disabled={disabled || isLoading}
          whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
          whileHover={{ y: disabled || isLoading ? 0 : -1 }}
          {...motionProps}
        >
          {innerContent}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={compClass} disabled={disabled || isLoading} {...props}>
        {innerContent}
      </button>
    );
  }
);

Button.displayName = "Button";
