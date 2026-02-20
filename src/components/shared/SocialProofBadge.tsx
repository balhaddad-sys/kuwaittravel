"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SocialProofBadgeProps {
  bookedCount: number;
  remainingCapacity: number;
  totalCapacity: number;
  variant?: "overlay" | "inline";
  className?: string;
}

function SocialProofBadge({
  bookedCount,
  remainingCapacity,
  variant = "inline",
  className,
}: SocialProofBadgeProps) {
  const { t } = useDirection();

  const isUrgent = remainingCapacity > 0 && remainingCapacity <= 5;
  const isFull = remainingCapacity <= 0;

  if (isFull) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-body-sm font-medium text-error",
          variant === "overlay" && "rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm",
          className
        )}
      >
        {t("مكتمل", "Fully Booked")}
      </span>
    );
  }

  if (isUrgent) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-body-sm font-medium text-error",
          variant === "overlay" && "urgency-pulse rounded-full bg-red-500/80 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm",
          className
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        {t(`${remainingCapacity} مقاعد متبقية فقط!`, `Only ${remainingCapacity} seats left!`)}
      </span>
    );
  }

  if (bookedCount >= 5) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-body-sm font-medium text-gray-500 dark:text-indigo-200",
          variant === "overlay" && "rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm",
          className
        )}
      >
        <Users className="h-3 w-3" />
        {t(`${bookedCount} مسافر حجزوا`, `${bookedCount} travelers booked`)}
      </span>
    );
  }

  return null;
}

export { SocialProofBadge, type SocialProofBadgeProps };
