"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
}

function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useDirection();

  return (
    <button
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-surface-border/80 bg-white/75 px-3 py-2 text-body-sm text-slate-700 backdrop-blur-sm transform-gpu transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-spring)] hover:border-sky-300/70 hover:bg-white/92 active:scale-[0.97] dark:border-surface-dark-border/80 dark:bg-surface-dark-card/75 dark:text-slate-100 dark:hover:border-sky-700/60 dark:hover:bg-surface-dark-card",
        className
      )}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-[#111827]/45">
        <Languages className="h-3.5 w-3.5" />
      </span>
      <span className="font-semibold tracking-wide">
        {language === "ar" ? "EN" : "AR"}
      </span>
      <span className="hidden md:inline text-body-sm text-slate-500 dark:text-sky-200">
        {language === "ar" ? "English" : "العربية"}
      </span>
    </button>
  );
}

export { LanguageToggle, type LanguageToggleProps };
