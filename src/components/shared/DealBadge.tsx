"use client";

import { cn } from "@/lib/utils/cn";
import { useDirection } from "@/providers/DirectionProvider";
import { Flame, Clock, Award, TrendingUp } from "lucide-react";
import type { DealBadgeType } from "@/types/common";

interface DealBadgeProps {
  type: DealBadgeType;
  className?: string;
}

const dealConfig: Record<DealBadgeType, { icon: React.ReactNode; labelAr: string; labelEn: string; color: string }> = {
  early_bird: {
    icon: <Clock className="h-3 w-3" />,
    labelAr: "حجز مبكر",
    labelEn: "Early Bird",
    color: "bg-sky-500 text-white",
  },
  last_minute: {
    icon: <Flame className="h-3 w-3" />,
    labelAr: "اللحظة الأخيرة",
    labelEn: "Last Minute",
    color: "bg-red-500 text-white",
  },
  best_value: {
    icon: <Award className="h-3 w-3" />,
    labelAr: "أفضل قيمة",
    labelEn: "Best Value",
    color: "bg-orange-500 text-white",
  },
  trending: {
    icon: <TrendingUp className="h-3 w-3" />,
    labelAr: "رائج",
    labelEn: "Trending",
    color: "bg-purple-500 text-white",
  },
};

function DealBadge({ type, className }: DealBadgeProps) {
  const { t } = useDirection();
  const config = dealConfig[type];

  return (
    <span
      className={cn(
        "animate-badge-bounce inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm",
        config.color,
        className
      )}
    >
      {config.icon}
      {t(config.labelAr, config.labelEn)}
    </span>
  );
}

export { DealBadge, type DealBadgeProps };
