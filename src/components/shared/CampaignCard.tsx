"use client";

import Image from "next/image";
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
  onClick,
  className,
}: CampaignCardProps) {
  const { t } = useDirection();

  return (
    <div
      className={`group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-slate-800 ${className ?? ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
    >
      {/* Cover image */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-600">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Avatar overlapping cover */}
        <div className="-mt-7 mb-3 flex items-end justify-between">
          <Avatar
            src={logoUrl}
            alt={name}
            size="xl"
            className="border-4 border-white shadow-lg dark:border-slate-800"
          />
          {verified && (
            <span className="mb-1 flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t("موثق", "Verified")}
            </span>
          )}
        </div>

        <h3 className="text-[0.9375rem] font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.8125rem] text-gray-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-[0.8125rem] text-gray-500 dark:text-slate-400">
          {rating > 0 && (
            <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-slate-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-numbers">{rating.toFixed(1)}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {totalTrips} {t("رحلة", "trips")}
          </span>
        </div>
      </div>
    </div>
  );
}

export { CampaignCard, type CampaignCardProps };
