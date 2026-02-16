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
import { getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatTimestamp, parseTimestamp } from "@/lib/utils/format";
import { toTripCardStatus } from "@/lib/utils/trip";
import type { Trip } from "@/types";

type TripFilter = "all" | "active" | "draft" | "completed" | "cancelled";

export default function TripsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TripFilter>("all");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      if (!userData?.campaignId) {
        setTrips([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const campaignTrips = await getDocuments<Trip>(COLLECTIONS.TRIPS, [
          where("campaignId", "==", userData.campaignId),
        ]);
        setTrips(campaignTrips);
      } catch {
        setLoadError("تعذر تحميل الرحلات حالياً. حاول مرة أخرى.");
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
        title="الرحلات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الرحلات" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            رحلة جديدة
          </Button>
        }
      />

      <Container className="travel-orbit-bg py-6 space-y-6">
        {!userData?.campaignId && !loading && (
          <div className="travel-section p-4">
            <EmptyState
              icon={<Map className="h-16 w-16" />}
              title="لا توجد حملة مرتبطة بالحساب"
              description="أكمل تسجيل بيانات الحملة أولاً لبدء إدارة الرحلات."
              action={{ label: "العودة للوحة التحكم", onClick: () => router.push("/portal/dashboard") }}
            />
          </div>
        )}

        {/* Search and Filters */}
        {userData?.campaignId && (
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder="ابحث في الرحلات..."
              onSearch={setSearchQuery}
              className="flex-1"
            />
            <div className="flex gap-2">
              {[
                { value: "all", label: "الكل" },
                { value: "active", label: "نشطة" },
                { value: "draft", label: "مسودة" },
                { value: "completed", label: "مكتملة" },
                { value: "cancelled", label: "ملغاة" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as TripFilter)}
                  className={`travel-filter-chip px-4 py-2 text-body-sm font-medium ${
                    filter === f.value
                      ? "travel-filter-chip-active"
                      : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loadError && (
          <p className="text-body-sm text-error">{loadError}</p>
        )}

        {/* Trips Grid */}
        {loading ? (
          <p className="text-body-md text-navy-500 text-center py-10">
            جاري تحميل الرحلات...
          </p>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => (
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
                coverImage={trip.coverImageUrl}
                onClick={() => router.push(`/portal/trips/${trip.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="travel-section p-4">
            <EmptyState
              icon={<Map className="h-16 w-16" />}
              title="لا توجد رحلات"
              description={searchQuery ? "لم يتم العثور على نتائج مطابقة" : "ابدأ بإنشاء رحلتك الأولى"}
              action={!searchQuery ? { label: "إنشاء رحلة", onClick: () => router.push("/portal/trips/create") } : undefined}
            />
          </div>
        )}
      </Container>

      <FAB icon={<Plus className="h-6 w-6" />} onClick={() => router.push("/portal/trips/create")} />
    </>
  );
}
