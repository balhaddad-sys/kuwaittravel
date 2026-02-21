"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  countryCode?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, countryCode = "+965", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-label font-medium text-slate-700 dark:text-sky-100">
            {label}
          </label>
        )}
        <div className="flex" dir="ltr">
          <span className="flex items-center justify-center rounded-s-[var(--radius-input)] border border-e-0 border-surface-border bg-surface-muted px-3 text-body-md font-medium text-slate-600 dark:border-surface-dark-border dark:bg-surface-dark-card dark:text-sky-200">
            {countryCode}
          </span>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            maxLength={8}
            className={cn(
              "w-full rounded-e-[var(--radius-input)] border bg-white px-4 py-2.5 text-body-md transition-all duration-200",
              "border-surface-border dark:border-surface-dark-border dark:bg-surface-dark-card",
              "placeholder:text-slate-300",
              "hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-body-sm text-error">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export { PhoneInput, type PhoneInputProps };
