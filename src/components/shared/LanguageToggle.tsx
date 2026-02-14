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
      className={cn(
        "flex items-center gap-1.5 rounded-[var(--radius-btn)] px-3 py-2 text-body-sm font-medium text-navy-600 dark:text-navy-300 hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors",
        className
      )}
    >
      <Languages className="h-4 w-4" />
      {language === "ar" ? "English" : "العربية"}
    </button>
  );
}

export { LanguageToggle, type LanguageToggleProps };
