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
        "inline-flex items-center gap-2 rounded-full border border-surface-border/80 bg-white/70 px-3 py-2 text-body-sm text-navy-700 backdrop-blur-sm transform-gpu transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:bg-white/90 active:scale-[0.97] dark:border-surface-dark-border/80 dark:bg-surface-dark-card/70 dark:text-navy-200 dark:hover:bg-surface-dark-card",
        className
      )}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-900/45">
        <Languages className="h-3.5 w-3.5" />
      </span>
      <span className="font-semibold tracking-wide">
        {language === "ar" ? "EN" : "AR"}
      </span>
      <span className="hidden md:inline text-body-sm text-navy-500 dark:text-navy-300">
        {language === "ar" ? "English" : "العربية"}
      </span>
    </button>
  );
}

export { LanguageToggle, type LanguageToggleProps };
