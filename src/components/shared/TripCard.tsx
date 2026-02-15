"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { useDirection } from "@/providers/DirectionProvider";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

interface TripCardProps {
  title: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  capacity: number;
  booked: number;
  status: "draft" | "active" | "completed" | "cancelled";
  coverImage?: string;
  campaignName?: string;
  onClick?: () => void;
  className?: string;
}

function TripCard({
  title,
  destination,
  departureDate,
  price,
  capacity,
  booked,
  status,
  coverImage,
  campaignName,
  onClick,
  className,
}: TripCardProps) {
  const { t } = useDirection();
  const remaining = capacity - booked;
  const fillPercent = capacity > 0 ? (booked / capacity) * 100 : 0;

  return (
    <Card variant="elevated" padding="none" hoverable onClick={onClick} className={className}>
      {/* Cover */}
      <div className="relative h-40 overflow-hidden rounded-t-[var(--radius-card)] bg-navy-100 dark:bg-navy-800">
        {coverImage ? (
          <Image src={coverImage} alt={title} width={400} height={200} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-10 w-10 text-navy-300" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent" />
        <div className="absolute top-3 end-3">
          <StatusChip status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white line-clamp-1">
            {title}
          </h3>
          {campaignName && (
            <p className="text-body-sm text-navy-500 mt-0.5">{campaignName}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-body-sm text-navy-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {destination}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {departureDate}
          </span>
        </div>

        {/* Capacity Bar */}
        <div>
          <div className="flex items-center justify-between text-body-sm mb-1">
            <span className="flex items-center gap-1 text-navy-500">
              <Users className="h-3.5 w-3.5" />
              {booked}/{capacity}
            </span>
            <span className={cn(
              "font-medium",
              remaining <= 5 ? "text-error" : "text-navy-500"
            )}>
              {remaining > 0 ? t(`${remaining} متبقي`, `${remaining} left`) : t("مكتمل", "Full")}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-muted dark:bg-surface-dark-border overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillPercent >= 90 ? "bg-error" : fillPercent >= 70 ? "bg-warning" : "bg-success"
              )}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-border dark:border-surface-dark-border">
          <span className="text-body-sm text-navy-400">{t("يبدأ من", "From")}</span>
          <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
            {formatKWD(price)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export { TripCard, type TripCardProps };
