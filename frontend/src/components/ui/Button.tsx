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
      // Deep navy primary button
      primary:
        "bg-brand-800 text-[#312e81] hover:bg-accent-400 active:bg-brand-950 shadow-sm hover:shadow-md",
      // Soft accent — pastel yellow with dark text
      accent:
        "bg-accent-300 text-white hover:bg-brand-900 active:bg-accent-500 shadow-sm font-semibold",
      // Subtle tinted secondary
      secondary:
        "bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200 border border-brand-100",
      // Bordered outline
      outline:
        "border-2 border-brand-700 bg-transparent hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-900 dark:text-brand-200 dark:border-brand-600",
      // Ghost — minimal
      ghost:
        "bg-transparent hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-700 dark:text-brand-300",
      // Danger
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-13 px-8 text-base gap-2.5",
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
