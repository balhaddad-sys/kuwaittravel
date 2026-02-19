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
        "fixed bottom-20 start-1/2 z-[var(--z-fab)] -trangray-x-1/2 lg:bottom-6",
        "flex items-center gap-3 rounded-[var(--radius-pill)] border border-indigo-200 bg-white px-4 py-3 shadow-xl backdrop-blur-sm dark:border-indigo-800 dark:bg-gray-900",
        "animate-slide-up",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-body-sm font-medium text-gray-700 dark:text-gray-200">
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
        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export { TripCompareBar, type TripCompareBarProps };
