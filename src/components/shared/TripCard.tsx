"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { SocialProofBadge } from "@/components/shared/SocialProofBadge";
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
  galleryUrls?: string[];
  tags?: string[];
  tripId?: string;
  remainingCapacity?: number;
  wishlisted?: boolean;
  onWishlistToggle?: () => void;
}

function TripCard({
  title,
  destination,
  departureDate,
  returnDate,
  price,
  capacity,
  booked,
  status,
  coverImage,
  campaignName,
  onClick,
  className,
  galleryUrls,
  tags,
  remainingCapacity,
  wishlisted = false,
  onWishlistToggle,
}: TripCardProps) {
  const { t } = useDirection();
  const remaining = remainingCapacity ?? (capacity - booked);
  const fillPercent = capacity > 0 ? (booked / capacity) * 100 : 0;

  // Gallery carousel state
  const images = galleryUrls && galleryUrls.length > 0 ? galleryUrls : coverImage ? [coverImage] : [];
  const [activeImg, setActiveImg] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    if (idx !== activeImg && idx >= 0 && idx < images.length) setActiveImg(idx);
  }, [activeImg, images.length]);

  return (
    <Card
      variant="elevated"
      padding="none"
      hoverable
      onClick={onClick}
      className={cn("trip-card group", className)}
    >
      {/* Cover / Gallery */}
      <div className="relative h-52 overflow-hidden rounded-t-[var(--radius-card)] bg-navy-100 dark:bg-navy-800 sm:h-56">
        {images.length > 1 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          >
            {images.slice(0, 4).map((src, i) => (
              <div key={i} className="relative h-full w-full flex-shrink-0 snap-start">
                <Image
                  src={src}
                  alt={`${title} ${i + 1}`}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : images.length === 1 ? (
          <Image
            src={images[0]}
            alt={title}
            width={400}
            height={200}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-100 to-white dark:from-navy-800 dark:to-navy-700">
            <MapPin className="h-10 w-10 text-navy-400" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status chip */}
        <div className="absolute end-3 top-3">
          <StatusChip status={status} />
        </div>

        {/* Date badge */}
        <div className="absolute start-3 top-3">
          <span className="rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {departureDate} - {returnDate}
          </span>
        </div>

        {/* Wishlist button */}
        {onWishlistToggle && (
          <div className="absolute end-3 bottom-3 z-10">
            <WishlistButton saved={wishlisted} onToggle={onWishlistToggle} size="sm" variant="overlay" />
          </div>
        )}

        {/* Campaign name badge */}
        {campaignName && (
          <div className="absolute bottom-3 start-3">
            <span className="rounded-full border border-white/24 bg-black/28 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {campaignName}
            </span>
          </div>
        )}

        {/* Gallery dots */}
        {images.length > 1 && (
          <div className="absolute bottom-8 start-1/2 z-10 flex -translate-x-1/2 items-center gap-1">
            {images.slice(0, 4).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-200",
                  i === activeImg ? "w-3 bg-white" : "w-1 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-3 sm:p-4">
        <div>
          <h3 className="line-clamp-1 text-body-lg font-bold text-navy-800 dark:text-white sm:text-heading-sm">
            {title}
          </h3>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--radius-chip)] bg-navy-100/60 px-2 py-0.5 text-[10px] font-medium text-navy-600 dark:bg-navy-800/60 dark:text-navy-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-body-sm text-navy-500 dark:text-navy-300">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {destination}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {departureDate}
          </span>
        </div>

        {/* Social proof */}
        <SocialProofBadge
          bookedCount={booked}
          remainingCapacity={remaining}
          totalCapacity={capacity}
          variant="inline"
        />

        {/* Capacity Bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-body-sm">
            <span className="flex items-center gap-1 text-navy-500 dark:text-navy-300">
              <Users className="h-3.5 w-3.5" />
              {booked}/{capacity}
            </span>
            <span
              className={cn(
                "font-medium",
                remaining <= 5 ? "text-error" : "text-navy-500 dark:text-navy-300"
              )}
            >
              {remaining > 0
                ? t(`${remaining} متبقي`, `${remaining} left`)
                : t("مكتمل", "Full")}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted dark:bg-surface-dark-border">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillPercent >= 90
                  ? "bg-error"
                  : fillPercent >= 70
                    ? "bg-warning"
                    : "bg-success"
              )}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between border-t border-surface-border pt-3 dark:border-surface-dark-border/90">
          <span className="text-body-sm text-navy-500 dark:text-navy-300">
            {t("يبدأ من", "From")}
          </span>
          <span className="font-numbers text-heading-sm font-bold text-navy-800 dark:text-white">
            {formatKWD(price)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export { TripCard, type TripCardProps };
