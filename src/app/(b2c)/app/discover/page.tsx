"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Star, ArrowLeft, Flame, Globe2, Compass, TrendingUp } from "lucide-react";
import { limit, where, type QueryConstraint } from "firebase/firestore";
import { getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatTimestamp, parseTimestamp } from "@/lib/utils/format";
import { toTripCardStatus } from "@/lib/utils/trip";
import type { Campaign, Trip } from "@/types";

const DISCOVERABLE_TRIP_STATUSES = new Set([
  "published",
  "registration_open",
  "registration_closed",
  "in_progress",
]);

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-card overflow-hidden ${className}`}>
      <div className="h-40 bg-navy-100/50 dark:bg-navy-800/50" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
        <div className="h-3 w-1/2 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
        <div className="h-2 w-full rounded-full bg-navy-100/30 dark:bg-navy-800/30" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
          <div className="h-4 w-20 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
        </div>
      </div>
    </div>
  );
}

function SkeletonDestination() {
  return (
    <div className="skeleton-card rounded-2xl p-4">
      <div className="h-8 w-8 rounded-xl bg-navy-100/50 dark:bg-navy-800/50" />
      <div className="mt-3 h-4 w-20 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
      <div className="mt-1 h-3 w-12 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
    </div>
  );
}

function SkeletonCampaign() {
  return (
    <div className="skeleton-card overflow-hidden">
      <div className="h-28 bg-navy-100/50 dark:bg-navy-800/50" />
      <div className="space-y-3 px-4 pb-4 pt-8">
        <div className="h-4 w-2/3 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
        <div className="h-3 w-full rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
        <div className="flex gap-4">
          <div className="h-3 w-12 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
          <div className="h-3 w-16 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const [searchQuery, setSearchQuery] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function fetchDiscoverData() {
      setLoading(true);
      setLoadError("");

      try {
        const tripConstraints: QueryConstraint[] = [
          where("status", "in", Array.from(DISCOVERABLE_TRIP_STATUSES)),
          limit(36),
        ];
        const campaignConstraints: QueryConstraint[] = [
          where("isActive", "==", true),
          limit(24),
        ];

        const [tripsData, campaignsData] = await Promise.all([
          getDocuments<Trip>(COLLECTIONS.TRIPS, tripConstraints),
          getDocuments<Campaign>(COLLECTIONS.CAMPAIGNS, campaignConstraints),
        ]);

        setTrips(tripsData);
        setCampaigns(campaignsData);
      } catch {
        setLoadError("load_error");
      } finally {
        setLoading(false);
      }
    }

    fetchDiscoverData();
  }, []);

  const campaignMap = useMemo(
    () => new Map(campaigns.map((campaign) => [campaign.id, campaign])),
    [campaigns]
  );

  const filteredTrips = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return [...trips]
      .sort((a, b) => {
        const aDate = parseTimestamp(a.departureDate)?.getTime() || 0;
        const bDate = parseTimestamp(b.departureDate)?.getTime() || 0;
        return aDate - bDate;
      })
      .filter((trip) => {
        const destination = trip.destinations?.[0]?.city || "";
        const campaignName =
          campaignMap.get(trip.campaignId)?.nameAr ||
          campaignMap.get(trip.campaignId)?.name ||
          trip.campaignName ||
          "";

        if (!normalizedSearch) return true;

        return (
          trip.titleAr.toLowerCase().includes(normalizedSearch) ||
          trip.title.toLowerCase().includes(normalizedSearch) ||
          destination.toLowerCase().includes(normalizedSearch) ||
          campaignName.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [campaignMap, searchQuery, trips]);

  const topCampaigns = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => {
        const aScore =
          (a.stats?.averageRating || 0) * 100 + (a.stats?.totalTrips || 0);
        const bScore =
          (b.stats?.averageRating || 0) * 100 + (b.stats?.totalTrips || 0);
        return bScore - aScore;
      })
      .slice(0, 6);
  }, [campaigns]);

  const destinations = useMemo(() => {
    const cityCounter = new Map<string, number>();

    filteredTrips.forEach((trip) => {
      const city = trip.destinations?.[0]?.city || "غير محدد";
      cityCounter.set(city, (cityCounter.get(city) || 0) + 1);
    });

    return [...cityCounter.entries()]
      .map(([city, count], index) => ({
        id: `${city}-${index}`,
        city,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredTrips]);

  useEffect(() => {
    filteredTrips.slice(0, 8).forEach((trip) => {
      router.prefetch(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`);
    });
    topCampaigns.slice(0, 8).forEach((campaign) => {
      router.prefetch(`/app/campaigns/${campaign.id}`);
    });
  }, [filteredTrips, topCampaigns, router]);

  return (
    <div className="travel-orbit-bg min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      {/* Hero Section */}
      <section className="travel-gradient-hero relative border-b border-surface-border/70 px-4 pb-8 pt-8 sm:pb-10 sm:pt-12">
        <Container>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-body-sm text-white/90 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5 text-gold-300" />
                {t("بوابة اكتشاف الرحلات", "Travel Discovery")}
              </div>
              <h1 className="travel-title mt-3 text-2xl font-extrabold leading-tight text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                {t("استكشف رحلتك القادمة", "Discover Your Next Journey")}
              </h1>
              <p className="mt-2 max-w-2xl text-body-md text-navy-100 sm:mt-3 sm:text-body-lg">
                {t(
                  "تصميم سفر حديث يدعم العربية والإنجليزية بسلاسة، مع واجهة أسرع للبحث والحجز.",
                  "A premium bilingual travel experience with smoother search and booking."
                )}
              </p>
              <div className="mt-4 max-w-2xl sm:mt-6">
                <SearchInput
                  placeholder={t(
                    "ابحث عن رحلة أو حملة...",
                    "Search for a trip or campaign..."
                  )}
                  onSearch={setSearchQuery}
                  className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-white/60 [&_input]:focus:border-gold-300/60 [&_input]:focus:ring-gold-300/20 [&_svg]:text-white/70"
                />
              </div>
            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md lg:grid-cols-1 lg:gap-3 lg:rounded-3xl lg:p-4">
              {[
                {
                  label: t("رحلات", "Trips"),
                  value: loading ? "—" : filteredTrips.length,
                  icon: <TrendingUp className="h-3.5 w-3.5 text-gold-300/70" />,
                },
                {
                  label: t("حملات", "Campaigns"),
                  value: loading ? "—" : campaigns.length,
                  icon: <Star className="h-3.5 w-3.5 text-gold-300/70" />,
                },
                {
                  label: t("وجهات", "Destinations"),
                  value: loading ? "—" : destinations.length,
                  icon: <Globe2 className="h-3.5 w-3.5 text-gold-300/70" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/24 bg-white/8 p-3 shadow-[0_0_0_1px_rgba(249,158,56,0.12)] lg:rounded-2xl lg:p-4"
                >
                  <div className="flex items-center gap-1.5">
                    {stat.icon}
                    <p className="text-[10px] uppercase tracking-wider text-navy-100/75 lg:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                  <p className="mt-0.5 font-numbers text-xl font-bold text-white lg:mt-1 lg:text-3xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative space-y-6 py-6 sm:space-y-10 sm:py-8">
        {/* Popular Destinations */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                {t("الوجهات الأكثر طلبًا", "Popular Destinations")}
              </h2>
            </div>
            <button className="flex items-center gap-1 text-body-sm font-medium text-navy-500 transition-colors hover:text-navy-700 dark:hover:text-navy-100">
              {t("عرض الكل", "View all")}{" "}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonDestination key={i} />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {destinations.map((dest, i) => (
                <button
                  key={dest.id}
                  className="travel-panel group rounded-2xl p-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-200/80 hover:shadow-card-hover dark:hover:border-gold-700/45 animate-stagger-fade-up"
                  style={
                    {
                      "--stagger-delay": `${i * 60}ms`,
                    } as React.CSSProperties
                  }
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Compass className="h-4 w-4" />
                  </div>
                  <p className="mt-3 line-clamp-1 text-body-md font-semibold text-navy-800 dark:text-navy-100">
                    {dest.city}
                  </p>
                  <p className="text-[11px] text-navy-500 dark:text-navy-300">
                    {dest.count} {t("رحلة", "trips")}
                  </p>
                </button>
              ))}
            </div>
          ) : null}
        </section>

        {/* Featured Trips */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                {t("رحلات مميزة", "Featured Trips")}
              </h2>
              {!loading && filteredTrips.length > 0 && (
                <span className="rounded-full bg-navy-100/80 px-2 py-0.5 text-[11px] font-medium text-navy-600 dark:bg-navy-800/80 dark:text-navy-300">
                  {filteredTrips.length}
                </span>
              )}
            </div>
            <button className="flex items-center gap-1 text-body-sm font-medium text-navy-500 transition-colors hover:text-navy-700 dark:hover:text-navy-100">
              {t("عرض الكل", "View all")}{" "}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.slice(0, 9).map((trip, i) => (
                <div
                  key={trip.id}
                  className="animate-stagger-fade-up"
                  style={
                    {
                      "--stagger-delay": `${i * 60}ms`,
                    } as React.CSSProperties
                  }
                >
                  <TripCard
                    title={
                      language === "ar"
                        ? trip.titleAr || trip.title
                        : trip.title || trip.titleAr
                    }
                    destination={
                      trip.destinations?.[0]?.city || t("غير محدد", "Not set")
                    }
                    departureDate={formatTimestamp(trip.departureDate)}
                    returnDate={formatTimestamp(trip.returnDate)}
                    price={trip.basePriceKWD}
                    capacity={trip.totalCapacity}
                    booked={trip.bookedCount || 0}
                    status={toTripCardStatus(trip.status)}
                    campaignName={
                      language === "ar"
                        ? campaignMap.get(trip.campaignId)?.nameAr ||
                          campaignMap.get(trip.campaignId)?.name ||
                          trip.campaignName
                        : campaignMap.get(trip.campaignId)?.name ||
                          campaignMap.get(trip.campaignId)?.nameAr ||
                          trip.campaignName
                    }
                    coverImage={trip.coverImageUrl}
                    onClick={() =>
                      router.push(
                        `/app/campaigns/${trip.campaignId}/trips/${trip.id}`
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Flame className="h-12 w-12" />}
              title={t(
                "لا توجد رحلات متاحة حالياً",
                "No trips available at the moment"
              )}
              description={t(
                "جرّب البحث بكلمات مختلفة أو عد لاحقاً.",
                "Try a different search term or check back soon."
              )}
            />
          )}
        </section>

        {/* Trusted Campaigns */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                {t("حملات موثوقة", "Trusted Campaigns")}
              </h2>
            </div>
            <button className="flex items-center gap-1 text-body-sm font-medium text-navy-500 transition-colors hover:text-navy-700 dark:hover:text-navy-100">
              {t("عرض الكل", "View all")}{" "}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCampaign key={i} />
              ))}
            </div>
          ) : topCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {topCampaigns.map((campaign, i) => (
                <div
                  key={campaign.id}
                  className="animate-stagger-fade-up"
                  style={
                    {
                      "--stagger-delay": `${i * 60}ms`,
                    } as React.CSSProperties
                  }
                >
                  <CampaignCard
                    name={
                      language === "ar"
                        ? campaign.nameAr || campaign.name
                        : campaign.name || campaign.nameAr
                    }
                    description={
                      language === "ar"
                        ? campaign.descriptionAr || campaign.description
                        : campaign.description || campaign.descriptionAr
                    }
                    logoUrl={campaign.logoUrl}
                    coverUrl={campaign.coverImageUrl}
                    rating={campaign.stats?.averageRating || 0}
                    totalTrips={campaign.stats?.totalTrips || 0}
                    verified={campaign.verificationStatus === "approved"}
                    onClick={() => router.push(`/app/campaigns/${campaign.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Star className="h-12 w-12" />}
              title={t(
                "لا توجد حملات معروضة حالياً",
                "No campaigns available right now"
              )}
              description={t(
                "ستظهر الحملات هنا عند نشرها.",
                "Campaigns will appear here once published."
              )}
            />
          )}
        </section>

        {loadError && (
          <div className="travel-panel rounded-2xl p-6 text-center">
            <p className="text-body-md text-error">
              {t(
                "تعذر تحميل بيانات الاكتشاف حالياً.",
                "Unable to load discovery content right now."
              )}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
