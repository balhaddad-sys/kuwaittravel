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
      <div className="group flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-medium text-[var(--clr-text-main)] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-focus-within:text-[var(--clr-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute start-3 flex items-center text-[var(--clr-text-muted)] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-focus-within:text-[var(--clr-primary)]">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "inline-input w-full text-body-md text-[var(--clr-text-main)] placeholder:text-[var(--clr-text-muted)]",
              "shadow-none",
              "focus:ring-0",
              error && "border-error focus:border-error",
              leftAddon && "ps-10",
              rightAddon && "pe-10",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute end-3 flex items-center text-[var(--clr-text-muted)] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-focus-within:text-[var(--clr-primary)]">
              {rightAddon}
            </span>
          )}
        </div>
        {error && <p className="text-body-sm text-error" role="alert">{error}</p>}
        {hint && !error && <p className="text-body-sm text-[var(--clr-text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
