"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-label font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-[var(--radius-input)] border bg-white/86 px-4 py-2.5 pe-10 text-body-md transition-[border-color,box-shadow,background-color,color] duration-[var(--duration-ui)] ease-[var(--ease-spring)] backdrop-blur-sm",
              "border-slate-200 dark:border-[#2D3B4F] dark:bg-[#111827]/80",
              "hover:border-slate-300 dark:hover:border-sky-600/50 focus:border-sky-500 focus:ring-4 focus:ring-sky-400/14 focus:outline-none",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && <p className="text-body-sm text-error">{error}</p>}
        {hint && !error && <p className="text-body-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select, type SelectProps, type SelectOption };
