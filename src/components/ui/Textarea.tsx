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
      <div className="group flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-label font-medium text-[var(--clr-text-main)] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-spring)] group-focus-within:text-[var(--clr-primary)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "inline-input min-h-[100px] w-full resize-y text-body-md text-[var(--clr-text-main)] placeholder:text-[var(--clr-text-muted)]",
            "shadow-none",
            "focus:ring-0",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-[var(--clr-text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea, type TextareaProps };
