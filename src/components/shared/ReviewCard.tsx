"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";

interface ReviewCardProps {
  travelerName: string;
  travelerAvatar?: string;
  rating: number;
  title: string;
  body: string;
  photoUrls?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
  onHelpful?: () => void;
  className?: string;
}

function ReviewCard({
  travelerName,
  travelerAvatar,
  rating,
  title,
  body,
  photoUrls = [],
  helpful,
  verified,
  createdAt,
  onHelpful,
  className,
}: ReviewCardProps) {
  const { t } = useDirection();
  const [expanded, setExpanded] = useState(false);
  const isLong = body.length > 200;

  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-surface-border bg-white p-4 dark:border-surface-dark-border dark:bg-surface-dark-card", className)}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar src={travelerAvatar} alt={travelerName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-body-md font-semibold text-gray-900 dark:text-white">{travelerName}</p>
            {verified && (
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-indigo-400/50"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">{createdAt}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="text-body-md font-semibold text-gray-800 dark:text-white">{title}</p>
        <p className={cn("mt-1 text-body-sm text-gray-600 dark:text-indigo-200", !expanded && isLong && "line-clamp-3")}>
          {body}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-body-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            {expanded ? t("أقل", "Show less") : t("المزيد", "Read more")}
          </button>
        )}
      </div>

      {/* Photos */}
      {photoUrls.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {photoUrls.map((url, i) => (
            <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image src={url} alt={`Review photo ${i + 1}`} fill className="object-cover" sizes="64px" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful */}
      {onHelpful && (
        <div className="mt-3 border-t border-surface-border pt-3 dark:border-surface-dark-border">
          <button
            onClick={onHelpful}
            className="flex items-center gap-1.5 text-body-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-indigo-300/60 dark:hover:text-indigo-400"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {t("مفيد", "Helpful")} ({helpful})
          </button>
        </div>
      )}
    </div>
  );
}

export { ReviewCard, type ReviewCardProps };
