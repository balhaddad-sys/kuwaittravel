"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Star,
  ArrowLeft,
  Flame,
  Globe2,
  Compass,
  SlidersHorizontal,
  X,
  Sparkles,
  Search,
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

const TRIP_TYPE_PILLS: { id: string; labelAr: string; labelEn: string; emoji: string }[] = [
  { id: "all", labelAr: "الكل", labelEn: "All Trips", emoji: "🧭" },
  { id: "hajj", labelAr: "حج", labelEn: "Hajj", emoji: "🕋" },
  { id: "umrah", labelAr: "عمرة", labelEn: "Umrah", emoji: "✨" },
  { id: "ziyarat", labelAr: "زيارة", labelEn: "Ziyarat", emoji: "🌿" },
  { id: "combined", labelAr: "مشترك", labelEn: "Combined", emoji: "🌍" },
];

const DEFAULT_FILTERS: TripFilterState = {
  tripType: null,
  priceMin: null,
  priceMax: null,
  destinations: [],
  searchQuery: "",
};

const DESTINATION_IMAGES: Record<string, string> = {
  "مكة": "🕋",
  "Mecca": "🕋",
  "المدينة": "🌿",
  "Madinah": "🌿",
  "كربلاء": "⭐",
  "Karbala": "⭐",
  "النجف": "🌟",
  "Najaf": "🌟",
  "القدس": "🌙",
  "Jerusalem": "🌙",
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

  useEffect(() => {
    filteredTrips.slice(0, 8).forEach((trip) => {
      router.prefetch(`/app/campaigns/${trip.campaignId}/trips/${trip.id}`);
    });
    topCampaigns.slice(0, 4).forEach((campaign) => {
      router.prefetch(`/app/campaigns/${campaign.id}`);
    });
  }, [filteredTrips, topCampaigns, router]);

  const getCampaignName = (trip: Trip) =>
    language === "ar"
      ? campaignMap.get(trip.campaignId)?.nameAr || campaignMap.get(trip.campaignId)?.name || trip.campaignName
      : campaignMap.get(trip.campaignId)?.name || campaignMap.get(trip.campaignId)?.nameAr || trip.campaignName;

  const getTripTitle = (trip: Trip) =>
    language === "ar" ? (trip.titleAr || trip.title) : (trip.title || trip.titleAr);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION — Rich blue gradient, search centered
          ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-8 pt-6 sm:pb-12 sm:pt-10">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800" />
        {/* Decorative orbs */}
        <div className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -top-10 -end-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 start-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-blue-900/40 blur-2xl" />

        <Container className="relative">
          {/* Top bar within hero */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Rahal</span>
            </div>
            <LanguageToggle className="border-white/20 bg-white/10 text-white hover:bg-white/20" />
          </div>

          {/* Hero headline */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {t("رحلات الحج والعمرة والزيارات", "Hajj · Umrah · Ziyarat Trips")}
            </div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>
              {t("ابحث عن رحلتك القادمة", "Find Your Next Sacred Journey")}
            </h1>
            <p className="mt-2 text-sm text-blue-100 sm:text-base">
              {t(
                "حملات موثقة، حجز سلس، ومتابعة كاملة",
                "Verified campaigns, seamless booking & full trip support"
              )}
            </p>

            {/* Search bar */}
            <div className="mt-5 sm:mt-6">
              <div className="relative mx-auto max-w-xl">
                <div className="flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:bg-slate-800">
                  <div className="flex h-14 items-center ps-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <SearchInput
                    placeholder={t("ابحث عن رحلة أو حملة...", "Search trips, destinations...")}
                    onSearch={handleSearch}
                    className="flex-1 border-0 bg-transparent py-0 shadow-none focus-within:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            {!loading && (
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-blue-100">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-white">{trips.length}+</span>
                  {t("رحلة متاحة", "trips available")}
                </span>
                <span className="h-3 w-px bg-blue-400" />
                <span className="flex items-center gap-1">
                  <span className="font-bold text-white">{campaigns.length}+</span>
                  {t("حملة موثقة", "verified campaigns")}
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────
          STICKY FILTER BAR
          ───────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-[var(--z-sticky)] border-b border-gray-200/80 bg-white/98 px-4 py-3 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/98">
        <Container>
          <div className="flex items-center gap-3">
            {/* Category pills */}
            <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {TRIP_TYPE_PILLS.map((pill) => {
                const isActive = selectedCategory === pill.id || (pill.id === "all" && !selectedCategory);
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleCategorySelect(isActive && pill.id !== "all" ? null : pill.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span>{pill.emoji}</span>
                    {t(pill.labelAr, pill.labelEn)}
                  </button>
                );
              })}
            </div>

            {/* Filter button */}
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("فلتر", "Filters")}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {filters.tripType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {TRIP_TYPE_PILLS.find((p) => p.id === filters.tripType)?.[language === "ar" ? "labelAr" : "labelEn"]}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, tripType: null }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.priceMin !== null || filters.priceMax !== null) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {filters.priceMin ?? 0} – {filters.priceMax ?? "∞"} KWD
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, priceMin: null, priceMax: null }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.destinations.map((dest) => (
                <span key={dest} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {dest}
                  <button type="button" onClick={() => setFilters((prev) => ({ ...prev, destinations: prev.destinations.filter((d) => d !== dest) }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────
          MAIN CONTENT
          ───────────────────────────────────────────────────────── */}
      <Container className="space-y-10 py-8">

        {/* Featured Trips */}
        {!loading && featuredTrips.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("رحلات مميزة", "Featured Trips")}
                  </h2>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                  {t("الأكثر طلباً من المسافرين", "Top picks by travelers")}
                </p>
              </div>
            </div>
            <div className="horizontal-scroll-section pb-2">
              {featuredTrips.slice(0, 6).map((trip, i) => (
                <div
                  key={trip.id}
                  className="w-[280px] shrink-0 sm:w-[300px] animate-stagger-fade-up"
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

        {/* Popular Destinations */}
        {!loading && destinations.length > 0 && (
          <section>
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("الوجهات الأكثر طلبًا", "Popular Destinations")}
                </h2>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                {t("اضغط لتصفية الرحلات", "Tap to filter trips by destination")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {destinations.slice(0, 8).map((dest, i) => {
                const emoji = DESTINATION_IMAGES[dest.city] || "🌍";
                const isSelected = filters.destinations.includes(dest.city);
                return (
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
                    className={`group relative overflow-hidden rounded-2xl p-4 text-start transition-all duration-200 animate-stagger-fade-up ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]"
                        : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                    }`}
                    style={{ "--stagger-delay": `${i * 50}ms` } as React.CSSProperties}
                  >
                    <div className="text-2xl mb-2">{emoji}</div>
                    <p className={`text-[0.875rem] font-semibold ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                      {dest.city}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-500 dark:text-slate-400"}`}>
                      {dest.count} {t("رحلة", "trips")}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* All Trips Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <Compass className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("جميع الرحلات", "All Trips")}
                </h2>
                {!loading && filteredTrips.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                    {filteredTrips.length}
                  </span>
                )}
              </div>
              {!loading && (
                <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                  {t("مرتبة حسب تاريخ المغادرة", "Sorted by departure date")}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="trip" />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.slice(0, 12).map((trip, i) => (
                <div
                  key={trip.id}
                  className="animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 50}ms` } as React.CSSProperties}
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
              icon={<Compass className="h-14 w-14 text-gray-300" />}
              title={t("لا توجد رحلات متاحة", "No trips found")}
              description={t(
                "جرّب البحث بكلمات مختلفة أو عدّل الفلاتر.",
                "Try a different search or adjust your filters."
              )}
            />
          )}
        </section>

        {/* Trusted Campaigns */}
        {!loading && topCampaigns.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("حملات موثقة", "Trusted Campaigns")}
                  </h2>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                  {t("منظمو رحلات معتمدون", "Verified trip organizers")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/app/discover?view=campaigns")}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t("عرض الكل", "View all")}
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
            <div className="horizontal-scroll-section pb-2">
              {topCampaigns.map((campaign, i) => (
                <div
                  key={campaign.id}
                  className="w-[260px] shrink-0 sm:w-[290px] animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
                >
                  <CampaignCard
                    name={language === "ar" ? campaign.nameAr || campaign.name : campaign.name || campaign.nameAr}
                    description={language === "ar" ? campaign.descriptionAr || campaign.description : campaign.description || campaign.descriptionAr}
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
            <div className="mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("حملات موثقة", "Trusted Campaigns")}
              </h2>
            </div>
            <div className="horizontal-scroll-section">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[260px] shrink-0 sm:w-[290px]">
                  <SkeletonCard variant="campaign" />
                </div>
              ))}
            </div>
          </section>
        )}

        {loadError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400">
              {t("تعذر تحميل البيانات حالياً. يرجى إعادة المحاولة.", "Unable to load content right now. Please try again.")}
            </p>
          </div>
        )}

        {/* Bottom spacing for nav */}
        <div className="h-4" />
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
