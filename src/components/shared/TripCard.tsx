"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { useDirection } from "@/providers/DirectionProvider";
import { MapPin } from "lucide-react";
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
  href?: string;
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
  coverImage,
  href,
  onClick,
  className,
  galleryUrls,
  wishlisted = false,
  onWishlistToggle,
}: TripCardProps) {
  const { t } = useDirection();

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

  const cardClasses = cn(
    "group block cursor-pointer",
    className
  );

  const cardContent = (
    <>
      {/* ─── Image Section ─── */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-slate-100 dark:bg-neutral-800">
        {images.length > 1 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          >
            {images.slice(0, 5).map((src, i) => (
              <div key={i} className="relative h-full w-full flex-shrink-0 snap-start">
                {failedImages.has(i) ? (
                  <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-neutral-800">
                    <MapPin className="h-10 w-10 text-slate-300 dark:text-neutral-600" />
                  </div>
                ) : (
                  <Image
                    src={src}
                    alt={`${title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => handleImageError(i)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : images.length === 1 ? (
          failedImages.has(0) ? (
            <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-neutral-800">
              <MapPin className="h-10 w-10 text-slate-300 dark:text-neutral-600" />
            </div>
          ) : (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => handleImageError(0)}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-neutral-800">
            <MapPin className="h-10 w-10 text-slate-300 dark:text-neutral-600" />
          </div>
        )}

        {/* Wishlist button */}
        {onWishlistToggle && (
          <div className="absolute end-3 top-3 z-10">
            <WishlistButton saved={wishlisted} onToggle={onWishlistToggle} size="sm" variant="overlay" />
          </div>
        )}

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
      </div>

      {/* ─── Content Section ─── */}
      <div className="pt-2.5">
        {/* Location */}
        <p className="flex items-center gap-1 text-[0.75rem] text-[#717171] dark:text-neutral-400">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{destination}</span>
        </p>

        {/* Title */}
        <h3 className="mt-0.5 line-clamp-1 text-[0.9375rem] font-semibold text-[#222222] dark:text-neutral-50">
          {title}
        </h3>

        {/* Dates */}
        <p className="mt-0.5 text-[0.75rem] text-[#717171] dark:text-neutral-400">
          {departureDate} — {returnDate}
        </p>

        {/* Price */}
        <p className="mt-1.5">
          <span className="font-numbers text-[0.9375rem] font-bold text-[#222222] dark:text-neutral-50">
            {formatKWD(price)}
          </span>
          <span className="text-[0.75rem] text-[#717171] dark:text-neutral-400">
            {" "}/{t("شخص", "person")}
          </span>
        </p>
      </div>
    </>
  );

  if (href) {
    return <Link href={href} className={cardClasses} prefetch={true}>{cardContent}</Link>;
  }

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
    >
      {cardContent}
    </div>
  );
}

export { TripCard, type TripCardProps };
