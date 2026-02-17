"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { CategoryPills } from "@/components/shared/CategoryPills";
import { FilterSheet } from "@/components/shared/FilterSheet";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { useWishlist } from "@/hooks/useWishlist";
import {
  Star,
  ArrowLeft,
  Flame,
  Globe2,
  Compass,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import { limit, where, type QueryConstraint } from "firebase/firestore";
import { getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatTimestamp, parseTimestamp } from "@/lib/utils/format";
import { toTripCardStatus } from "@/lib/utils/trip";
import type { Campaign, Trip, TripType, TripFilterState } from "@/types";

const DISCOVERABLE_TRIP_STATUSES = new Set([
  "published",
  "registration_open",
  "registration_closed",
  "in_progress",
]);

const TRIP_TYPE_PILLS: { id: string; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
  { id: "all", labelAr: "الكل", labelEn: "All", icon: <Compass className="h-3.5 w-3.5" /> },
  { id: "hajj", labelAr: "حج", labelEn: "Hajj", icon: <Star className="h-3.5 w-3.5" /> },
  { id: "umrah", labelAr: "عمرة", labelEn: "Umrah", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "ziyarat", labelAr: "زيارة", labelEn: "Ziyarat", icon: <Globe2 className="h-3.5 w-3.5" /> },
  { id: "combined", labelAr: "مشترك", labelEn: "Combined", icon: <Flame className="h-3.5 w-3.5" /> },
];

const DEFAULT_FILTERS: TripFilterState = {
  tripType: null,
  priceMin: null,
  priceMax: null,
  destinations: [],
  searchQuery: "",
};

export default function DiscoverPage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState<TripFilterState>(DEFAULT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Apply all filters (category + advanced + search)
  const filteredTrips = useMemo(() => {
    const normalizedSearch = filters.searchQuery.trim().toLowerCase();
    const activeType = selectedCategory && selectedCategory !== "all" ? selectedCategory as TripType : filters.tripType;

    return [...trips]
      .sort((a, b) => {
        const aDate = parseTimestamp(a.departureDate)?.getTime() || 0;
        const bDate = parseTimestamp(b.departureDate)?.getTime() || 0;
        return aDate - bDate;
      })
      .filter((trip) => {
        // Type filter
        if (activeType && trip.type !== activeType) return false;

        // Price filter
        if (filters.priceMin !== null && trip.basePriceKWD < filters.priceMin) return false;
        if (filters.priceMax !== null && trip.basePriceKWD > filters.priceMax) return false;

        // Destination filter
        if (filters.destinations.length > 0) {
          const tripCity = trip.destinations?.[0]?.city || "";
          if (!filters.destinations.includes(tripCity)) return false;
        }

        // Search filter
        if (normalizedSearch) {
          const destination = trip.destinations?.[0]?.city || "";
          const campaignName =
            campaignMap.get(trip.campaignId)?.nameAr ||
            campaignMap.get(trip.campaignId)?.name ||
            trip.campaignName || "";

          return (
            trip.titleAr.toLowerCase().includes(normalizedSearch) ||
            trip.title.toLowerCase().includes(normalizedSearch) ||
            destination.toLowerCase().includes(normalizedSearch) ||
            campaignName.toLowerCase().includes(normalizedSearch)
          );
        }

        return true;
      });
  }, [campaignMap, filters, selectedCategory, trips]);

  // Featured trips
  const featuredTrips = useMemo(
    () => filteredTrips.filter((trip) => trip.featured),
    [filteredTrips]
  );

  const topCampaigns = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => {
        const aScore = (a.stats?.averageRating || 0) * 100 + (a.stats?.totalTrips || 0);
        const bScore = (b.stats?.averageRating || 0) * 100 + (b.stats?.totalTrips || 0);
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [campaigns]);

  const destinations = useMemo(() => {
    const cityCounter = new Map<string, number>();
    trips.forEach((trip) => {
      const city = trip.destinations?.[0]?.city;
      if (city) cityCounter.set(city, (cityCounter.get(city) || 0) + 1);
    });
    return [...cityCounter.entries()]
      .map(([city, count], index) => ({ id: `${city}-${index}`, city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [trips]);

  const availableDestinations = useMemo(
    () => destinations.map((d) => d.city),
    [destinations]
  );

  // Active filter count for the filter button badge
  const activeFilterCount = [
    filters.tripType,
    filters.priceMin !== null || filters.priceMax !== null,
    filters.destinations.length > 0,
  ].filter(Boolean).length;

  const handleCategorySelect = useCallback((id: string | null) => {
    setSelectedCategory(id);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleFilterApply = useCallback((newFilters: TripFilterState) => {
    setFilters(newFilters);
  }, []);

  // Prefetch routes
  useEffect(() => {
    filteredTrips.slice(0, 8).forEach((trip) => {
      router.prefetch(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`);
    });
    topCampaigns.slice(0, 4).forEach((campaign) => {
      router.prefetch(`/app/campaigns/${campaign.id}`);
    });
  }, [filteredTrips, topCampaigns, router]);

  // Category pills data
  const categoryItems = useMemo(
    () => TRIP_TYPE_PILLS.map((pill) => ({
      id: pill.id,
      label: t(pill.labelAr, pill.labelEn),
      icon: pill.icon,
    })),
    [t]
  );

  const getCampaignName = (trip: Trip) =>
    language === "ar"
      ? campaignMap.get(trip.campaignId)?.nameAr || campaignMap.get(trip.campaignId)?.name || trip.campaignName
      : campaignMap.get(trip.campaignId)?.name || campaignMap.get(trip.campaignId)?.nameAr || trip.campaignName;

  const getTripTitle = (trip: Trip) =>
    language === "ar" ? (trip.titleAr || trip.title) : (trip.title || trip.titleAr);

  return (
    <div className="min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      {/* Travel Hero */}
      <section className="relative overflow-hidden border-b border-surface-border/70 px-4 pb-6 pt-6 sm:pb-8 sm:pt-10">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 via-white to-white dark:from-teal-950/20 dark:via-surface-dark dark:to-surface-dark" />
        <div className="absolute right-0 top-0 h-full w-[40%] bg-gradient-to-l from-amber-50/40 to-transparent dark:from-amber-950/8" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-xl font-extrabold leading-tight text-stone-900 dark:text-white sm:text-3xl lg:text-4xl" style={{ textWrap: "balance" }}>
              {t("استكشف رحلتك القادمة", "Discover Your Next Journey")}
            </h1>
            <p className="mt-2 text-body-md text-stone-500 dark:text-stone-400 sm:text-body-lg">
              {t(
                "ابحث واحجز رحلات الحج والعمرة والزيارات بسهولة",
                "Search and book Hajj, Umrah, and Ziyarat trips with ease"
              )}
            </p>
            <div className="mt-4 sm:mt-5">
              <SearchInput
                placeholder={t("ابحث عن رحلة أو حملة...", "Search for a trip or campaign...")}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Category Pills + Filter Button */}
      <section className="sticky top-0 z-[var(--z-sticky)] border-b border-surface-border/60 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-surface-dark-border/60 dark:bg-surface-dark/95">
        <Container>
          <div className="flex items-center gap-3">
            <CategoryPills
              items={categoryItems}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-surface-border px-3 py-2 text-body-sm font-medium text-stone-600 transition-colors hover:border-stone-400 hover:bg-stone-50 dark:border-surface-dark-border dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-900/40"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("فلتر", "Filter")}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {filters.tripType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {TRIP_TYPE_PILLS.find((p) => p.id === filters.tripType)?.[language === "ar" ? "labelAr" : "labelEn"]}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, tripType: null }))}><X className="h-3 w-3" /></button>
                </span>
              )}
              {(filters.priceMin !== null || filters.priceMax !== null) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {filters.priceMin ?? 0} - {filters.priceMax ?? "∞"} KWD
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, priceMin: null, priceMax: null }))}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.destinations.map((dest) => (
                <span key={dest} className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {dest}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, destinations: prev.destinations.filter((d) => d !== dest) }))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Container className="relative space-y-8 py-6 sm:space-y-10 sm:py-8">
        {/* Featured Trips Carousel */}
        {!loading && featuredTrips.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2 className="text-heading-md font-bold text-stone-900 dark:text-white">
                  {t("رحلات مميزة", "Featured Trips")}
                </h2>
              </div>
            </div>
            <div className="horizontal-scroll-section">
              {featuredTrips.slice(0, 6).map((trip, i) => (
                <div
                  key={trip.id}
                  className="w-[280px] sm:w-[320px] animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
                >
                  <TripCard
                    title={getTripTitle(trip)}
                    destination={trip.destinations?.[0]?.city || t("غير محدد", "Not set")}
                    departureDate={formatTimestamp(trip.departureDate)}
                    returnDate={formatTimestamp(trip.returnDate)}
                    price={trip.basePriceKWD}
                    capacity={trip.totalCapacity}
                    booked={trip.bookedCount || 0}
                    remainingCapacity={trip.remainingCapacity}
                    status={toTripCardStatus(trip.status)}
                    campaignName={getCampaignName(trip)}
                    coverImage={trip.coverImageUrl}
                    galleryUrls={trip.galleryUrls}
                    tags={trip.tags}
                    tripId={trip.id}
                    wishlisted={isWishlisted(trip.id)}
                    onWishlistToggle={() => toggleWishlist(trip.id)}
                    onClick={() => router.push(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Destinations - Horizontal Scroll */}
        {!loading && destinations.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-amber-500" />
                <h2 className="text-heading-md font-bold text-stone-900 dark:text-white">
                  {t("الوجهات الأكثر طلبًا", "Popular Destinations")}
                </h2>
              </div>
            </div>
            <div className="horizontal-scroll-section">
              {destinations.map((dest, i) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      destinations: prev.destinations.includes(dest.city)
                        ? prev.destinations.filter((d) => d !== dest.city)
                        : [...prev.destinations, dest.city],
                    }));
                  }}
                  className="sacred-panel group w-[140px] rounded-2xl p-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/80 hover:shadow-card-hover dark:hover:border-amber-700/45 animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Compass className="h-4 w-4" />
                  </div>
                  <p className="mt-3 line-clamp-1 text-body-md font-semibold text-stone-800 dark:text-stone-100">
                    {dest.city}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {dest.count} {t("رحلة", "trips")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Available Trips Grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-amber-500" />
              <h2 className="text-heading-md font-bold text-stone-900 dark:text-white">
                {t("جميع الرحلات", "All Trips")}
              </h2>
              {!loading && filteredTrips.length > 0 && (
                <span className="rounded-full bg-stone-100/80 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:bg-stone-800/80 dark:text-stone-400">
                  {filteredTrips.length}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="trip" />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.slice(0, 12).map((trip, i) => (
                <div
                  key={trip.id}
                  className="animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
                >
                  <TripCard
                    title={getTripTitle(trip)}
                    destination={trip.destinations?.[0]?.city || t("غير محدد", "Not set")}
                    departureDate={formatTimestamp(trip.departureDate)}
                    returnDate={formatTimestamp(trip.returnDate)}
                    price={trip.basePriceKWD}
                    capacity={trip.totalCapacity}
                    booked={trip.bookedCount || 0}
                    remainingCapacity={trip.remainingCapacity}
                    status={toTripCardStatus(trip.status)}
                    campaignName={getCampaignName(trip)}
                    coverImage={trip.coverImageUrl}
                    galleryUrls={trip.galleryUrls}
                    tags={trip.tags}
                    tripId={trip.id}
                    wishlisted={isWishlisted(trip.id)}
                    onWishlistToggle={() => toggleWishlist(trip.id)}
                    onClick={() => router.push(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Flame className="h-12 w-12" />}
              title={t("لا توجد رحلات متاحة حالياً", "No trips available at the moment")}
              description={t(
                "جرّب البحث بكلمات مختلفة أو عد لاحقاً.",
                "Try a different search term or check back soon."
              )}
            />
          )}
        </section>

        {/* Trusted Campaigns - Horizontal Carousel */}
        {!loading && topCampaigns.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-heading-md font-bold text-stone-900 dark:text-white">
                  {t("حملات موثوقة", "Trusted Campaigns")}
                </h2>
              </div>
              <button className="flex items-center gap-1 text-body-sm font-medium text-stone-500 transition-colors hover:text-stone-700 dark:hover:text-stone-100">
                {t("عرض الكل", "View all")} <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
            <div className="horizontal-scroll-section">
              {topCampaigns.map((campaign, i) => (
                <div
                  key={campaign.id}
                  className="w-[280px] sm:w-[320px] animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
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
          </section>
        )}

        {/* Loading skeletons for campaigns */}
        {loading && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-heading-md font-bold text-stone-900 dark:text-white">
                {t("حملات موثوقة", "Trusted Campaigns")}
              </h2>
            </div>
            <div className="horizontal-scroll-section">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[280px] sm:w-[320px]">
                  <SkeletonCard variant="campaign" />
                </div>
              ))}
            </div>
          </section>
        )}

        {loadError && (
          <div className="sacred-panel rounded-2xl p-6 text-center">
            <p className="text-body-md text-error">
              {t(
                "تعذر تحميل بيانات الاكتشاف حالياً.",
                "Unable to load discovery content right now."
              )}
            </p>
          </div>
        )}
      </Container>

      {/* Filter Sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onApply={handleFilterApply}
        availableDestinations={availableDestinations}
      />
    </div>
  );
}
