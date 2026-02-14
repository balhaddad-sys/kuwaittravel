"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Calendar } from "lucide-react";

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label font-medium text-navy-700 dark:text-navy-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              "w-full rounded-[var(--radius-input)] border bg-white px-4 py-2.5 pe-10 text-body-md transition-all duration-200",
              "border-surface-border dark:border-surface-dark-border dark:bg-surface-dark-card",
              "hover:border-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
          <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        </div>
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-navy-400">{hint}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export { DatePicker, type DatePickerProps };
