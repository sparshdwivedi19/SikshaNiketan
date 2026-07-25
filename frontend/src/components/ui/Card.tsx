"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glassDark" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
  asMotion?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      asMotion = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-2xl transition-all duration-300 relative group overflow-hidden";

    const variants = {
      default: "bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/40",
      glass: "glass-card hover:border-indigo-500/40 hover:shadow-neon-indigo/20",
      glassDark: "glass-card-dark hover:border-indigo-500/40 hover:shadow-neon-indigo/30 text-white",
      outline: "bg-transparent border border-indigo-500/20 hover:border-indigo-500/50 backdrop-blur-sm",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const compClass = cn(baseStyles, variants[variant], paddings[padding], className);

    if (asMotion) {
      const motionProps = props as HTMLMotionProps<"div">;
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          className={compClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          {...motionProps}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={compClass} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
