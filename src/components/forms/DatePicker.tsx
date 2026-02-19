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
          <label htmlFor={inputId} className="text-label font-medium text-gray-700 dark:text-gray-200">
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
              "hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
          <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -trangray-y-1/2 text-gray-400" />
        </div>
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-gray-400">{hint}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export { DatePicker, type DatePickerProps };
