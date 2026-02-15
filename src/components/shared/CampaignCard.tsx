"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useDirection } from "@/providers/DirectionProvider";
import { Star, MapPin } from "lucide-react";

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
    <Card variant="elevated" padding="none" hoverable onClick={onClick} className={className}>
      <div className="relative h-28 bg-navy-100 dark:bg-navy-800 rounded-t-[var(--radius-card)] overflow-hidden">
        {coverUrl && <Image src={coverUrl} alt={name} width={400} height={200} className="h-full w-full object-cover" />}
      </div>
      <div className="relative px-4 pb-4">
        <div className="-mt-6 mb-3 flex items-end gap-3">
          <Avatar src={logoUrl} alt={name} size="xl" className="border-4 border-white dark:border-surface-dark-card" />
          {verified && <Badge variant="gold" size="sm">{t("موثق", "Verified")} ✓</Badge>}
        </div>
        <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">{name}</h3>
        <p className="text-body-sm text-navy-500 mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 mt-3 text-body-sm text-navy-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {totalTrips} {t("رحلة", "trips")}
          </span>
        </div>
      </div>
    </Card>
  );
}

export { CampaignCard, type CampaignCardProps };
