"use client";

import { useEffect, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TripCard } from "@/components/shared/TripCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { FAB } from "@/components/ui/FAB";
import { Plus, Map } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatTimestamp, parseTimestamp } from "@/lib/utils/format";
import { toTripCardStatus } from "@/lib/utils/trip";
import type { Trip } from "@/types";

type TripFilter = "all" | "active" | "draft" | "completed" | "cancelled";

export default function TripsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const { t } = useDirection();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TripFilter>("all");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      if (!userData?.campaignId) {
        setTrips([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadFailed(false);

      try {
        const campaignTrips = await getDocuments<Trip>(COLLECTIONS.TRIPS, [
          where("campaignId", "==", userData.campaignId),
        ]);
        setTrips(campaignTrips);
      } catch {
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [userData?.campaignId]);

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
        const cardStatus = toTripCardStatus(trip.status);
        const matchesSearch =
          normalizedSearch.length === 0 ||
          trip.titleAr.toLowerCase().includes(normalizedSearch) ||
          trip.title.toLowerCase().includes(normalizedSearch) ||
          destination.toLowerCase().includes(normalizedSearch);
        const matchesFilter = filter === "all" || cardStatus === filter;
        return matchesSearch && matchesFilter;
      });
  }, [filter, searchQuery, trips]);

  return (
    <>
      <AppBar
        title={t("الرحلات", "Trips")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الرحلات", "Trips") }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            {t("رحلة جديدة", "New Trip")}
          </Button>
        }
      />

      <Container className="eo-pattern py-6 space-y-6">
        {!userData?.campaignId && !loading && (
          <div className="eo-section p-4">
            <EmptyState
              icon={<Map className="h-16 w-16" />}
              title={t("لا توجد حملة مرتبطة بالحساب", "No campaign linked to this account")}
              description={t("أكمل تسجيل بيانات الحملة أولاً لبدء إدارة الرحلات.", "Complete campaign registration first to start managing trips.")}
              action={{ label: t("العودة للوحة التحكم", "Back to Dashboard"), onClick: () => router.push("/portal/dashboard") }}
            />
          </div>
        )}

        {/* Search and Filters */}
        {userData?.campaignId && (
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder={t("ابحث في الرحلات...", "Search trips...")}
              onSearch={setSearchQuery}
              className="flex-1"
            />
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { value: "all", label: t("الكل", "All") },
                { value: "active", label: t("نشطة", "Active") },
                { value: "draft", label: t("مسودة", "Draft") },
                { value: "completed", label: t("مكتملة", "Completed") },
                { value: "cancelled", label: t("ملغاة", "Cancelled") },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as TripFilter)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-body-sm font-medium transition-all ${
                    filter === f.value
                      ? "border-sky-600 bg-sky-700 text-white"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-[#2D3B4F] dark:bg-[#1E293B]/70 dark:text-slate-200 dark:hover:border-sky-600/50 dark:hover:bg-[#111827]/60"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loadFailed && (
          <p className="text-body-sm text-error">{t("تعذر تحميل الرحلات حالياً. حاول مرة أخرى.", "Unable to load trips right now. Please try again.")}</p>
        )}

        {/* Trips Grid */}
        {loading ? (
          <p className="text-body-md text-slate-500 text-center py-10">
            {t("جاري تحميل الرحلات...", "Loading trips...")}
          </p>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.titleAr || trip.title}
                destination={trip.destinations?.[0]?.city || t("غير محدد", "Unspecified")}
                departureDate={formatTimestamp(trip.departureDate)}
                returnDate={formatTimestamp(trip.returnDate)}
                price={trip.basePriceKWD}
                capacity={trip.totalCapacity}
                booked={trip.bookedCount || 0}
                status={toTripCardStatus(trip.status)}
                coverImage={trip.coverImageUrl}
                onClick={() => router.push(`/portal/trips/${trip.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="eo-section p-4">
            <EmptyState
              icon={<Map className="h-16 w-16" />}
              title={t("لا توجد رحلات", "No trips found")}
              description={searchQuery ? t("لم يتم العثور على نتائج مطابقة", "No matching results found") : t("ابدأ بإنشاء رحلتك الأولى", "Start by creating your first trip")}
              action={!searchQuery ? { label: t("إنشاء رحلة", "Create Trip"), onClick: () => router.push("/portal/trips/create") } : undefined}
            />
          </div>
        )}
      </Container>

      <FAB icon={<Plus className="h-6 w-6" />} onClick={() => router.push("/portal/trips/create")} position="bottom-right-nav" />
    </>
  );
}
