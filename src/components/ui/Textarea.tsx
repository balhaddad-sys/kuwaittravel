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
            "w-full rounded-[var(--radius-input)] border bg-white px-4 py-2.5 text-body-md transition-all duration-200 min-h-[100px] resize-y",
            "border-surface-border dark:border-surface-dark-border dark:bg-surface-dark-card",
            "placeholder:text-navy-300 dark:placeholder:text-navy-600",
            "hover:border-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none",
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
