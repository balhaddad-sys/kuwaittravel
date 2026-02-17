"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
  className?: string;
}

function OTPInput({ length = 6, onComplete, error, className }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      const code = newValues.join("");
      if (code.length === length && !code.includes("")) {
        onComplete(code);
      }
    },
    [values, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [values]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      const newValues = [...values];
      for (let i = 0; i < pasted.length; i++) {
        newValues[i] = pasted[i];
      }
      setValues(newValues);
      if (pasted.length === length) {
        onComplete(pasted);
      } else {
        inputsRef.current[pasted.length]?.focus();
      }
    },
    [values, length, onComplete]
  );

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex gap-2" dir="ltr">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={cn(
              "h-14 w-12 rounded-[var(--radius-input)] border bg-white text-center text-xl font-bold transition-all duration-200",
              "border-surface-border dark:border-surface-dark-border dark:bg-surface-dark-card",
              "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none",
              error && "border-error",
              val && "border-teal-500 bg-teal-50"
            )}
          />
        ))}
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}

export { OTPInput, type OTPInputProps };
