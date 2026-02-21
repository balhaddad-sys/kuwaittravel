"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { useDirection } from "@/providers/DirectionProvider";
import { MapPin, Calendar, Users } from "lucide-react";
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
  const isUrgent = remaining > 0 && remaining <= 5;

  const images = galleryUrls && galleryUrls.length > 0 ? galleryUrls : coverImage ? [coverImage] : [];
  const [activeImg, setActiveImg] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleImageError = useCallback((index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    if (idx !== activeImg && idx >= 0 && idx < images.length) setActiveImg(idx);
  }, [activeImg, images.length]);

  const statusConfig = {
    active: { label: t("متاح", "Available"), bg: "bg-emerald-500" },
    draft: { label: t("قريباً", "Coming Soon"), bg: "bg-slate-500" },
    completed: { label: t("مكتمل", "Completed"), bg: "bg-slate-400" },
    cancelled: { label: t("ملغي", "Cancelled"), bg: "bg-red-500" },
  };
  const statusDisplay = statusConfig[status] || statusConfig.active;

  return (
    <div
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        "dark:bg-[#1E293B]",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
    >
      {/* ─── Image Section ─── */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-sky-700/50">
        {images.length > 1 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          >
            {images.slice(0, 5).map((src, i) => (
              <div key={i} className="relative h-full w-full flex-shrink-0 snap-start">
                {failedImages.has(i) ? (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-700 dark:to-sky-600">
                    <MapPin className="h-10 w-10 text-sky-300 dark:text-sky-300/60" />
                  </div>
                ) : (
                  <Image
                    src={src}
                    alt={`${title} ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => handleImageError(i)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : images.length === 1 ? (
          failedImages.has(0) ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-700 dark:to-sky-600">
              <MapPin className="h-10 w-10 text-sky-300 dark:text-sky-300/60" />
            </div>
          ) : (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => handleImageError(0)}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-700 dark:to-sky-600">
            <MapPin className="h-10 w-10 text-sky-300 dark:text-sky-300/60" />
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top row — wishlist */}
        {onWishlistToggle && (
          <div className="absolute end-3 top-3 z-10">
            <WishlistButton saved={wishlisted} onToggle={onWishlistToggle} size="sm" variant="overlay" />
          </div>
        )}

        {/* Status dot badge */}
        <div className="absolute start-3 top-3 z-10">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white",
            statusDisplay.bg
          )}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            {statusDisplay.label}
          </span>
        </div>

        {/* Bottom row — campaign name + dates */}
        <div className="absolute bottom-3 start-3 end-12 z-10">
          {campaignName && (
            <span className="block truncate rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {campaignName}
            </span>
          )}
        </div>

        {/* Gallery dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 start-1/2 z-10 flex -translate-x-1/2 items-center gap-1">
            {images.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeImg ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Urgency badge */}
        {isUrgent && (
          <div className="absolute end-3 bottom-3 z-10">
            <span className="urgency-pulse inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {t(`${remaining} متبقي`, `${remaining} left`)}
            </span>
          </div>
        )}
      </div>

      {/* ─── Content Section ─── */}
      <div className="p-3 sm:p-4">
        {/* Destination + Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1 text-[0.8125rem] font-semibold text-slate-800 dark:text-slate-100">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-300/60" />
            <span className="truncate">{destination}</span>
          </div>
          {/* Rating removed — only show when backed by real review data */}
        </div>

        {/* Trip Title */}
        <h3 className="mt-1 line-clamp-1 text-[0.9375rem] font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>

        {/* Dates */}
        <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-slate-500 dark:text-slate-300/55">
          <Calendar className="h-3.5 w-3.5" />
          {departureDate}
          <span className="text-slate-300 dark:text-sky-700/60">—</span>
          {returnDate}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10.5px] font-medium text-sky-700 dark:bg-sky-700/25 dark:text-sky-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Capacity Bar */}
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-sky-700/40">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillPercent >= 90 ? "bg-red-500" : fillPercent >= 70 ? "bg-orange-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-300/55">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {booked}/{capacity}
            </span>
            <span className={cn("font-medium", remaining <= 5 && remaining > 0 ? "text-red-600 dark:text-red-400" : "dark:text-slate-300/55")}>
              {remaining > 0
                ? t(`${remaining} مقعد متبقي`, `${remaining} seats left`)
                : t("مكتمل", "Full")}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-[#2D3B4F]">
          <span className="text-[0.8125rem] text-slate-500 dark:text-slate-300/55">
            {t("يبدأ من", "From")}
          </span>
          <div className="text-end">
            <span className="font-numbers text-[1.125rem] font-bold text-slate-900 dark:text-slate-50">
              {formatKWD(price)}
            </span>
            <span className="text-[0.75rem] text-slate-400 dark:text-slate-300/45">
              {" "}/{t("شخص", "person")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TripCard, type TripCardProps };
