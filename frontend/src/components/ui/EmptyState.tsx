import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-brand-800 rounded-2xl bg-surface/50 dark:bg-background-secondary/50",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center text-brand-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground-primary mb-2">{title}</h3>
      <p className="text-sm text-foreground-secondary max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
