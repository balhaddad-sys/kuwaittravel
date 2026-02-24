"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { FilterSheet } from "@/components/shared/FilterSheet";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { useWishlist } from "@/hooks/useWishlist";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import {
  ArrowLeft,
  Compass,
  SlidersHorizontal,
  X,
  Search,
  Bell,
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

const TRIP_TYPE_PILLS: { id: string; labelAr: string; labelEn: string }[] = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "hajj", labelAr: "حج", labelEn: "Hajj" },
  { id: "umrah", labelAr: "عمرة", labelEn: "Umrah" },
  { id: "ziyarat", labelAr: "زيارة", labelEn: "Ziyarat" },
  { id: "combined", labelAr: "مشترك", labelEn: "Combined" },
];

const DEFAULT_FILTERS: TripFilterState = {
  tripType: null,
  priceMin: null,
  priceMax: null,
  destinations: [],
  searchQuery: "",
};

export default function DiscoverPage() {
  const { t, language } = useDirection();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState<TripFilterState>(DEFAULT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function fetchDiscoverData() {
      setLoading(true);
      setLoadError("");
      try {
        const tripConstraints: QueryConstraint[] = [
          where("status", "in", Array.from(DISCOVERABLE_TRIP_STATUSES)),
          where("adminApproved", "==", true),
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
    const normalizedSearch = filters.searchQuery.trim().toLowerCase();
    const activeType = selectedCategory && selectedCategory !== "all" ? selectedCategory as TripType : filters.tripType;

    return [...trips]
      .sort((a, b) => {
        const aDate = parseTimestamp(a.departureDate)?.getTime() || 0;
        const bDate = parseTimestamp(b.departureDate)?.getTime() || 0;
        return aDate - bDate;
      })
      .filter((trip) => {
        if (activeType && trip.type !== activeType) return false;
        if (filters.priceMin !== null && trip.basePriceKWD < filters.priceMin) return false;
        if (filters.priceMax !== null && trip.basePriceKWD > filters.priceMax) return false;
        if (filters.destinations.length > 0) {
          const tripCity = trip.destinations?.[0]?.city || "";
          if (!filters.destinations.includes(tripCity)) return false;
        }
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

  const availableDestinations = useMemo(() => destinations.map((d) => d.city), [destinations]);

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

  const getCampaignName = (trip: Trip) =>
    language === "ar"
      ? campaignMap.get(trip.campaignId)?.nameAr || campaignMap.get(trip.campaignId)?.name || trip.campaignName
      : campaignMap.get(trip.campaignId)?.name || campaignMap.get(trip.campaignId)?.nameAr || trip.campaignName;

  const getTripTitle = (trip: Trip) =>
    language === "ar" ? (trip.titleAr || trip.title) : (trip.title || trip.titleAr);

  return (
    <div className="min-h-screen">

      {/* ─── Sticky Top Bar ─── */}
      <div className="sticky top-0 z-[var(--z-topbar)] bg-white dark:bg-[#111827]">
        {/* Brand row */}
        <div className="flex h-14 items-center justify-between px-4">
          <span className="text-lg font-bold text-[#222222] dark:text-white">Rahal</span>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link href="/app/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell className="h-5 w-5 text-[#717171] dark:text-slate-300" />
            </Link>
          </div>
        </div>

        {/* Search pill */}
        <div className="px-4 pb-3">
          <div className="eo-search-pill flex items-center gap-2 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[#717171]" />
            <SearchInput
              placeholder={t("ابحث عن رحلة...", "Search trips...")}
              onSearch={handleSearch}
              className="flex-1 border-0 bg-transparent py-0 shadow-none focus-within:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="border-b border-[#EBEBEB] px-4 pb-3 dark:border-[#2D3B4F]">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {TRIP_TYPE_PILLS.map((pill) => {
                const isActive = selectedCategory === pill.id || (pill.id === "all" && !selectedCategory);
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleCategorySelect(isActive && pill.id !== "all" ? null : pill.id)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-[0.8125rem] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#222222] text-white dark:bg-sky-500 dark:text-white"
                        : "border border-[#EBEBEB] bg-white text-[#222222] hover:bg-slate-50 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-slate-200"
                    }`}
                  >
                    {t(pill.labelAr, pill.labelEn)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 rounded-full border border-[#EBEBEB] bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-[#222222] transition-all hover:bg-slate-50 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-slate-200"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("فلتر", "Filters")}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#222222] text-[9px] font-bold text-white dark:bg-sky-500">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {filters.tripType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-[#222222] dark:bg-slate-700 dark:text-slate-200">
                  {TRIP_TYPE_PILLS.find((p) => p.id === filters.tripType)?.[language === "ar" ? "labelAr" : "labelEn"]}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, tripType: null }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.priceMin !== null || filters.priceMax !== null) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-[#222222] dark:bg-slate-700 dark:text-slate-200">
                  {filters.priceMin ?? 0} – {filters.priceMax ?? "∞"} KWD
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, priceMin: null, priceMax: null }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.destinations.map((dest) => (
                <span key={dest} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-[#222222] dark:bg-slate-700 dark:text-slate-200">
                  {dest}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, destinations: prev.destinations.filter((d) => d !== dest) }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <Container className="space-y-8 py-6">

        {/* Featured Trips */}
        {(loading || featuredTrips.length > 0) && (
          <section>
            <h2 className="mb-4 text-[1.0625rem] font-bold text-[#222222] dark:text-white">
              {t("رحلات مميزة", "Featured")}
            </h2>
            <div className="horizontal-scroll-section pb-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[280px] shrink-0 sm:w-[300px]">
                      <SkeletonCard variant="trip" />
                    </div>
                  ))
                : featuredTrips.slice(0, 6).map((trip) => (
                    <div key={trip.id} className="w-[280px] shrink-0 sm:w-[300px]">
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
                        tripId={trip.id}
                        wishlisted={isWishlisted(trip.id)}
                        onWishlistToggle={() => toggleWishlist(trip.id)}
                        href={`/app/campaigns/${trip.campaignId}/trips/${trip.id}`}
                      />
                    </div>
                  ))}
            </div>
          </section>
        )}

        {/* All Trips */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[1.0625rem] font-bold text-[#222222] dark:text-white">
              {t("جميع الرحلات", "All Trips")}
              {!loading && filteredTrips.length > 0 && (
                <span className="ms-2 text-sm font-normal text-[#717171]">
                  ({filteredTrips.length})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="trip" />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTrips.slice(0, visibleCount).map((trip) => (
                  <TripCard
                    key={trip.id}
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
                    tripId={trip.id}
                    wishlisted={isWishlisted(trip.id)}
                    onWishlistToggle={() => toggleWishlist(trip.id)}
                    href={`/app/campaigns/${trip.campaignId}/trips/${trip.id}`}
                  />
                ))}
              </div>
              {visibleCount < filteredTrips.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="w-full rounded-xl border border-[#EBEBEB] bg-white py-3 text-sm font-semibold text-[#222222] transition-all hover:bg-slate-50 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-slate-200"
                  >
                    {t("عرض المزيد", "Show more")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={<Compass className="h-14 w-14 text-slate-300" />}
              title={t("لا توجد رحلات متاحة", "No trips found")}
              description={t(
                "جرّب البحث بكلمات مختلفة أو عدّل الفلاتر.",
                "Try a different search or adjust your filters."
              )}
            />
          )}
        </section>

        {/* Campaigns */}
        {(loading || topCampaigns.length > 0) && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[1.0625rem] font-bold text-[#222222] dark:text-white">
                {t("حملات موثقة", "Trusted Campaigns")}
              </h2>
              {!loading && (
                <Link
                  href="/app/discover?view=campaigns"
                  className="text-sm font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400"
                >
                  {t("عرض الكل", "View all")}
                </Link>
              )}
            </div>
            <div className="horizontal-scroll-section pb-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[260px] shrink-0 sm:w-[290px]">
                      <SkeletonCard variant="campaign" />
                    </div>
                  ))
                : topCampaigns.map((campaign) => (
                    <div key={campaign.id} className="w-[260px] shrink-0 sm:w-[290px]">
                      <CampaignCard
                        name={language === "ar" ? campaign.nameAr || campaign.name : campaign.name || campaign.nameAr}
                        description={language === "ar" ? campaign.descriptionAr || campaign.description : campaign.description || campaign.descriptionAr}
                        logoUrl={campaign.logoUrl}
                        coverUrl={campaign.coverImageUrl}
                        rating={campaign.stats?.averageRating || 0}
                        totalTrips={campaign.stats?.totalTrips || 0}
                        verified={campaign.verificationStatus === "approved"}
                        href={`/app/campaigns/${campaign.id}`}
                      />
                    </div>
                  ))}
            </div>
          </section>
        )}

        {loadError && (
          <div className="rounded-2xl bg-red-50 p-6 text-center dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400">
              {t("تعذر تحميل البيانات حالياً. يرجى إعادة المحاولة.", "Unable to load content right now. Please try again.")}
            </p>
          </div>
        )}

        <div className="h-4" />
      </Container>

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
