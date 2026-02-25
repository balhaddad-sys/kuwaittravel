"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useDirection } from "@/providers/DirectionProvider";
import { Star, MapPin, BadgeCheck } from "lucide-react";

interface CampaignCardProps {
  name: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  rating: number;
  totalTrips: number;
  verified: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function CampaignCard({
  name,
  description,
  logoUrl,
  coverUrl,
  rating,
  totalTrips,
  verified,
  href,
  onClick,
  className,
}: CampaignCardProps) {
  const { t } = useDirection();

  const cardClasses = `group block cursor-pointer overflow-hidden rounded-xl bg-white border border-[#EBEBEB] transition-colors hover:bg-slate-50 dark:border-[#383838]/60 dark:bg-[#262626] dark:hover:bg-[#262626] ${className ?? ""}`;

  const cardContent = (
    <>
      {/* Cover image */}
      <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-[#262626]">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        )}
        {/* No gradient overlay — clean image */}
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Avatar overlapping cover */}
        <div className="-mt-7 mb-3 flex items-end justify-between">
          <Avatar
            src={logoUrl}
            alt={name}
            size="xl"
            className="border-4 border-white shadow-lg dark:border-neutral-800"
          />
          {verified && (
            <span className="mb-1 flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-[#1A1A1A]/40 dark:text-sky-300">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t("موثق", "Verified")}
            </span>
          )}
        </div>

        <h3 className="text-[0.9375rem] font-bold text-[#222222] dark:text-white">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.8125rem] text-[#717171] dark:text-neutral-300/60">
          {description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-[0.8125rem] text-[#717171] dark:text-neutral-300/60">
          {rating > 0 && (
            <span className="flex items-center gap-1 font-medium text-[#222222] dark:text-sky-200">
              <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
              <span className="font-numbers">{rating.toFixed(1)}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {totalTrips} {t("رحلة", "trips")}
          </span>
        </div>
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

export { CampaignCard, type CampaignCardProps };
