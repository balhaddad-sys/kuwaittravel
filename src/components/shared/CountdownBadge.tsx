"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Clock } from "lucide-react";

interface CountdownBadgeProps {
  departureDate: Date;
  className?: string;
}

function CountdownBadge({ departureDate, className }: CountdownBadgeProps) {
  const { days, hours, isExpired } = useCountdown(departureDate);
  const { t } = useDirection();

  if (isExpired || days > 60) return null;

  const isUrgent = days <= 7;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold",
        isUrgent
          ? "animate-countdown-pulse bg-amber-500 text-white shadow-[0_0_12px_rgba(197,165,114,0.4)]"
          : "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        className
      )}
    >
      <Clock className="h-3 w-3" />
      {days > 0
        ? t(`خلال ${days} يوم`, `In ${days} days`)
        : t(`خلال ${hours} ساعات`, `In ${hours} hours`)}
    </span>
  );
}

export { CountdownBadge, type CountdownBadgeProps };
