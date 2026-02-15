"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-label font-medium text-navy-700 dark:text-navy-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-[var(--radius-input)] border bg-white/88 px-4 py-2.5 text-body-md transition-all duration-300 min-h-[100px] resize-y backdrop-blur-sm",
            "border-surface-border/90 dark:border-surface-dark-border/90 dark:bg-surface-dark-card/80",
            "placeholder:text-navy-400 dark:placeholder:text-navy-500",
            "hover:border-navy-300 dark:hover:border-navy-600 focus:border-navy-400 focus:ring-4 focus:ring-navy-400/15 focus:outline-none",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-navy-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea, type TextareaProps };
