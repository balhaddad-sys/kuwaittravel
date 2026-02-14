"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftAddon, rightAddon, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label font-medium text-navy-700 dark:text-navy-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute start-3 flex items-center text-navy-400">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-[var(--radius-input)] border bg-white px-4 py-2.5 text-body-md transition-all duration-200",
              "border-surface-border dark:border-surface-dark-border dark:bg-surface-dark-card",
              "placeholder:text-navy-300 dark:placeholder:text-navy-600",
              "hover:border-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none",
              error && "border-error focus:border-error focus:ring-error/20",
              leftAddon && "ps-10",
              rightAddon && "pe-10",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute end-3 flex items-center text-navy-400">
              {rightAddon}
            </span>
          )}
        </div>
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-navy-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
