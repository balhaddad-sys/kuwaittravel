"use client";

import { useMemo } from "react";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import type { ItineraryBlock } from "@/types";
import {
  Plane,
  Building2,
  LogOut,
  Star,
  Coffee,
  Bus,
  Clock,
  Sparkles,
} from "lucide-react";

interface ItineraryTimelineProps {
  blocks: ItineraryBlock[];
  className?: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  flight: {
    icon: <Plane className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  hotel_checkin: {
    icon: <Building2 className="h-4 w-4" />,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  hotel_checkout: {
    icon: <LogOut className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  activity: {
    icon: <Sparkles className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  religious: {
    icon: <Star className="h-4 w-4" />,
    color: "bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400",
  },
  meal: {
    icon: <Coffee className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  transport: {
    icon: <Bus className="h-4 w-4" />,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  free_time: {
    icon: <Clock className="h-4 w-4" />,
    color: "bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-300",
  },
};

function ItineraryTimeline({ blocks, className }: ItineraryTimelineProps) {
  const { t, language } = useDirection();

  const groupedByDay = useMemo(() => {
    const sorted = [...blocks].sort((a, b) => {
      if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
      return a.sortOrder - b.sortOrder;
    });

    const groups = new Map<number, ItineraryBlock[]>();
    for (const block of sorted) {
      const existing = groups.get(block.dayNumber) || [];
      existing.push(block);
      groups.set(block.dayNumber, existing);
    }
    return groups;
  }, [blocks]);

  if (blocks.length === 0) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {Array.from(groupedByDay.entries()).map(([dayNumber, dayBlocks]) => (
        <div key={dayNumber}>
          {/* Day header */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-white">
              {dayNumber}
            </span>
            <h4 className="text-body-md font-bold text-navy-900 dark:text-white">
              {t(`اليوم ${dayNumber}`, `Day ${dayNumber}`)}
            </h4>
          </div>

          {/* Timeline blocks */}
          <div className="relative ms-3.5 border-s-2 border-navy-200 ps-5 dark:border-navy-700">
            {dayBlocks.map((block, i) => {
              const config = typeConfig[block.type] || typeConfig.activity;
              const title = language === "ar" ? (block.titleAr || block.title) : (block.title || block.titleAr);
              const desc = language === "ar" ? (block.descriptionAr || block.description) : (block.description || block.descriptionAr);

              return (
                <div
                  key={block.id}
                  className={cn("relative pb-5", i === dayBlocks.length - 1 && "pb-0")}
                >
                  {/* Timeline dot */}
                  <div className="absolute -start-[1.625rem] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-gold-400 dark:border-navy-900" />

                  <div className="flex items-start gap-3">
                    {/* Type icon */}
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]", config.color)}>
                      {config.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-body-md font-semibold text-navy-800 dark:text-white">
                          {title}
                        </p>
                        {block.startTime && (
                          <span className="text-[11px] text-navy-400 dark:text-navy-500">
                            {block.startTime}
                            {block.endTime && ` - ${block.endTime}`}
                          </span>
                        )}
                      </div>
                      {desc && (
                        <p className="mt-0.5 text-body-sm text-navy-500 dark:text-navy-400">
                          {desc}
                        </p>
                      )}
                      {block.location && (
                        <p className="mt-0.5 text-[11px] text-navy-400 dark:text-navy-500">
                          {block.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export { ItineraryTimeline, type ItineraryTimelineProps };
