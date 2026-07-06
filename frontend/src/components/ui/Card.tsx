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
    const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";

    const variants = {
      default: "bg-surface shadow-sm border border-gray-100 dark:border-gray-800",
      glass: "glass shadow-xl",
      glassDark: "glass-dark shadow-xl",
      outline: "bg-transparent border-2 border-gray-200 dark:border-gray-800",
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
