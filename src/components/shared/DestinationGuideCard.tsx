"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { useDirection } from "@/providers/DirectionProvider";
import { MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DestinationGuideCardProps {
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  heroImageUrl: string;
  highlights?: { title: string; titleAr: string; icon: string }[];
  onClick?: () => void;
  className?: string;
}

function DestinationGuideCard({
  city,
  cityAr,
  country,
  countryAr,
  heroImageUrl,
  highlights = [],
  onClick,
  className,
}: DestinationGuideCardProps) {
  const { t, language } = useDirection();

  return (
    <Card variant="elevated" padding="none" hoverable onClick={onClick} className={cn("group", className)}>
      <div className="relative h-36 overflow-hidden rounded-t-[var(--radius-card)]">
        <Image
          src={heroImageUrl}
          alt={language === "ar" ? cityAr : city}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 start-3">
          <h3 className="text-heading-sm font-bold text-white">
            {language === "ar" ? cityAr : city}
          </h3>
          <p className="flex items-center gap-1 text-[12px] text-white/80">
            <MapPin className="h-3 w-3" />
            {language === "ar" ? countryAr : country}
          </p>
        </div>
      </div>
      <div className="p-3">
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                <span>{h.icon}</span>
                {language === "ar" ? h.titleAr : h.title}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-1 text-body-sm font-medium text-teal-600 dark:text-teal-400">
          {t("اكتشف المزيد", "Explore more")}
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </div>
      </div>
    </Card>
  );
}

export { DestinationGuideCard, type DestinationGuideCardProps };
