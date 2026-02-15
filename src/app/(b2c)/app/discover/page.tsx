"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Star, ArrowLeft, Flame, Globe2, Compass } from "lucide-react";
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
        const aScore = (a.stats?.averageRating || 0) * 100 + (a.stats?.totalTrips || 0);
        const bScore = (b.stats?.averageRating || 0) * 100 + (b.stats?.totalTrips || 0);
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-muted/70 dark:bg-surface-dark">
      <div className="pointer-events-none absolute -top-28 -start-20 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 -end-20 h-80 w-80 rounded-full bg-navy-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 start-1/3 h-64 w-64 rounded-full bg-info/10 blur-3xl" />

      <section className="relative border-b border-surface-border/70 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 px-4 pb-10 pt-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-body-sm text-white/90 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5 text-gold-300" />
                {t("بوابة اكتشاف الرحلات", "Travel Discovery")}
              </div>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                {t("استكشف رحلتك القادمة", "Discover Your Next Journey")}
              </h1>
              <p className="mt-3 max-w-2xl text-body-lg text-navy-100">
                {t(
                  "تصميم سفر حديث يدعم العربية والإنجليزية بسلاسة، مع واجهة أسرع للبحث والحجز.",
                  "A premium bilingual travel experience with smoother search and booking."
                )}
              </p>
              <div className="mt-6 max-w-2xl">
                <SearchInput
                  placeholder={t("ابحث عن رحلة أو حملة...", "Search for a trip or campaign...")}
                  onSearch={setSearchQuery}
                  className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-white/60 [&_input]:focus:border-gold-300/60 [&_input]:focus:ring-gold-300/20 [&_svg]:text-white/70"
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                <p className="text-[11px] uppercase tracking-wider text-navy-100/75">
                  {t("رحلات متاحة", "Available Trips")}
                </p>
                <p className="mt-1 text-3xl font-bold text-white">{filteredTrips.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                <p className="text-[11px] uppercase tracking-wider text-navy-100/75">
                  {t("حملات نشطة", "Active Campaigns")}
                </p>
                <p className="mt-1 text-3xl font-bold text-white">{campaigns.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                <p className="text-[11px] uppercase tracking-wider text-navy-100/75">
                  {t("وجهات", "Destinations")}
                </p>
                <p className="mt-1 text-3xl font-bold text-white">{destinations.length}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative space-y-10 py-8">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-gold-500" />
            <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
              {t("الوجهات الأكثر طلبًا", "Popular Destinations")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                className="group rounded-2xl border border-surface-border/80 bg-white/80 p-4 text-start shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-card-hover dark:border-surface-dark-border/75 dark:bg-surface-dark-card/80 dark:hover:border-navy-600"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-md">
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
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                {t("رحلات مميزة", "Featured Trips")}
              </h2>
            </div>
            <button className="flex items-center gap-1 text-body-sm font-medium text-navy-500 transition-colors hover:text-navy-700 dark:hover:text-navy-100">
              {t("عرض الكل", "View all")} <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.slice(0, 9).map((trip) => (
              <TripCard
                key={trip.id}
                title={language === "ar" ? (trip.titleAr || trip.title) : (trip.title || trip.titleAr)}
                destination={trip.destinations?.[0]?.city || t("غير محدد", "Not set")}
                departureDate={formatTimestamp(trip.departureDate)}
                returnDate={formatTimestamp(trip.returnDate)}
                price={trip.basePriceKWD}
                capacity={trip.totalCapacity}
                booked={trip.bookedCount || 0}
                status={toTripCardStatus(trip.status)}
                campaignName={
                  language === "ar"
                    ? (campaignMap.get(trip.campaignId)?.nameAr || campaignMap.get(trip.campaignId)?.name || trip.campaignName)
                    : (campaignMap.get(trip.campaignId)?.name || campaignMap.get(trip.campaignId)?.nameAr || trip.campaignName)
                }
                coverImage={trip.coverImageUrl}
                onClick={() =>
                  router.push(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`)
                }
              />
            ))}
          </div>
          {!loading && filteredTrips.length === 0 && (
            <div className="mt-4">
              <EmptyState
                icon={<Flame className="h-12 w-12" />}
                title={t("لا توجد رحلات متاحة حالياً", "No trips available at the moment")}
                description={t("جرّب البحث بكلمات مختلفة أو عد لاحقاً.", "Try a different search term or check back soon.")}
              />
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-gold-500" />
            <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
              {t("حملات موثوقة", "Trusted Campaigns")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                name={language === "ar" ? (campaign.nameAr || campaign.name) : (campaign.name || campaign.nameAr)}
                description={language === "ar" ? (campaign.descriptionAr || campaign.description) : (campaign.description || campaign.descriptionAr)}
                logoUrl={campaign.logoUrl}
                coverUrl={campaign.coverImageUrl}
                rating={campaign.stats?.averageRating || 0}
                totalTrips={campaign.stats?.totalTrips || 0}
                verified={campaign.verificationStatus === "approved"}
                onClick={() => router.push(`/app/campaigns/${campaign.id}`)}
              />
            ))}
          </div>
          {!loading && topCampaigns.length === 0 && (
            <div className="mt-4">
              <EmptyState
                icon={<Star className="h-12 w-12" />}
                title={t("لا توجد حملات معروضة حالياً", "No campaigns available right now")}
                description={t("ستظهر الحملات هنا عند نشرها.", "Campaigns will appear here once published.")}
              />
            </div>
          )}
        </section>

        {loading && (
          <p className="text-center text-body-md text-navy-500">
            {t("جاري تحميل بيانات الاكتشاف...", "Loading discovery content...")}
          </p>
        )}

        {loadError && (
          <p className="text-center text-body-sm text-error">
            {t("تعذر تحميل بيانات الاكتشاف حالياً.", "Unable to load discovery content right now.")}
          </p>
        )}
      </Container>
    </div>
  );
}
