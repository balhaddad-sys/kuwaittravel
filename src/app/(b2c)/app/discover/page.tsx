"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star, ArrowLeft, Flame } from "lucide-react";
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
        const [tripsData, campaignsData] = await Promise.all([
          getDocuments<Trip>(COLLECTIONS.TRIPS),
          getDocuments<Campaign>(COLLECTIONS.CAMPAIGNS),
        ]);

        setTrips(
          tripsData.filter((trip) =>
            DISCOVERABLE_TRIP_STATUSES.has(trip.status)
          )
        );
        setCampaigns(campaignsData.filter((campaign) => campaign.isActive));
      } catch {
        setLoadError("تعذر تحميل بيانات الاكتشاف حالياً.");
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
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-bl from-navy-700 via-navy-800 to-navy-900 px-4 pt-12 pb-8">
        <Container>
          <h1 className="text-display-md font-bold text-white mb-2">
            رحال
          </h1>
          <p className="text-body-lg text-navy-200 mb-6">
            اكتشف واحجز رحلاتك الزيارية بكل سهولة
          </p>
          <SearchInput
            placeholder="ابحث عن رحلة أو حملة..."
            onSearch={setSearchQuery}
            className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50"
          />
        </Container>
      </div>

      <Container className="py-6 space-y-8">
        {/* Destinations */}
        <section>
          <h2 className="text-heading-md font-bold text-navy-900 dark:text-white mb-4">
            الوجهات
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-xl)] bg-white dark:bg-surface-dark-card shadow-card px-5 py-4 min-w-[100px] hover:shadow-card-hover transition-all"
              >
                <span className="text-2xl">🕌</span>
                <span className="text-body-sm font-medium text-navy-700 dark:text-navy-200 whitespace-nowrap">
                  {dest.city}
                </span>
                <span className="text-[11px] text-navy-400">{dest.count} رحلة</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Trips */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                رحلات مميزة
              </h2>
            </div>
            <button className="text-body-sm font-medium text-navy-500 hover:text-navy-700 flex items-center gap-1">
              عرض الكل <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.slice(0, 9).map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.titleAr || trip.title}
                destination={trip.destinations?.[0]?.city || "غير محدد"}
                departureDate={formatTimestamp(trip.departureDate)}
                returnDate={formatTimestamp(trip.returnDate)}
                price={trip.basePriceKWD}
                capacity={trip.totalCapacity}
                booked={trip.bookedCount || 0}
                status={toTripCardStatus(trip.status)}
                campaignName={
                  campaignMap.get(trip.campaignId)?.nameAr ||
                  campaignMap.get(trip.campaignId)?.name ||
                  trip.campaignName
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
                title="لا توجد رحلات متاحة حالياً"
                description="جرّب البحث بكلمات مختلفة أو عد لاحقاً."
              />
            </div>
          )}
        </section>

        {/* Top Campaigns */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                حملات موثوقة
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                name={campaign.nameAr || campaign.name}
                description={campaign.descriptionAr || campaign.description}
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
                title="لا توجد حملات معروضة حالياً"
                description="ستظهر الحملات هنا عند نشرها."
              />
            </div>
          )}
        </section>

        {loading && (
          <p className="text-body-md text-navy-500 text-center">جاري تحميل بيانات الاكتشاف...</p>
        )}

        {loadError && (
          <p className="text-body-sm text-error text-center">{loadError}</p>
        )}
      </Container>
    </div>
  );
}
