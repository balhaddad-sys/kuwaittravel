"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { Button } from "@/components/ui/Button";
import { X, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TripCompareBarProps {
  count: number;
  maxCount?: number;
  onCompare: () => void;
  onClear: () => void;
  className?: string;
}

function TripCompareBar({ count, maxCount = 3, onCompare, onClear, className }: TripCompareBarProps) {
  const { t } = useDirection();

  if (count === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 start-1/2 z-[var(--z-fab)] -translate-x-1/2 lg:bottom-6",
        "flex items-center gap-3 rounded-[var(--radius-pill)] border border-sky-200 bg-white px-4 py-3 shadow-xl backdrop-blur-sm dark:border-sky-800 dark:bg-[#1A1A1A]",
        "animate-slide-up",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        <span className="text-body-sm font-medium text-slate-700 dark:text-slate-100">
          {t(`${count} من ${maxCount} رحلات`, `${count} of ${maxCount} trips`)}
        </span>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={onCompare}
        disabled={count < 2}
      >
        {t("قارن", "Compare")}
      </Button>
      <button
        onClick={onClear}
        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#262626]/60 dark:hover:text-slate-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export { TripCompareBar, type TripCompareBarProps };
