"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <label htmlFor={checkboxId} className={cn("inline-flex items-center gap-2 cursor-pointer", className)}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div className="h-5 w-5 rounded-md border-2 border-slate-300 transition-all peer-checked:border-sky-500 peer-checked:bg-sky-500 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400/20 dark:border-[#2D3B4F] dark:peer-checked:border-sky-500 dark:peer-checked:bg-sky-500">
            <Check className="h-full w-full text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" />
          </div>
        </div>
        {label && <span className="text-body-md text-slate-700 dark:text-slate-200">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export { Checkbox, type CheckboxProps };
