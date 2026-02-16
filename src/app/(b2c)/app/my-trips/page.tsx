"use client";

import { useEffect, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Map as MapIcon, Calendar, MapPin, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatKWD, parseTimestamp } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Booking, Trip } from "@/types";

const statusLabels: Record<string, { ar: string; en: string; variant: "success" | "warning" | "error" | "info" }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", variant: "success" },
  pending_payment: { ar: "بانتظار الدفع", en: "Pending Payment", variant: "warning" },
  completed: { ar: "مكتمل", en: "Completed", variant: "info" },
  cancelled: { ar: "ملغي", en: "Cancelled", variant: "error" },
};

interface EnrichedBooking extends Booking {
  tripDepartureDate: Date | null;
}

export default function MyTripsPage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { userData, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      if (authLoading) return;

      if (!userData?.uid) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const bookingRows = await getDocuments<Booking>(COLLECTIONS.BOOKINGS, [
          where("travelerId", "==", userData.uid),
        ]);

        const tripIds = [...new Set(bookingRows.map((booking) => booking.tripId))];
        const tripResults = await Promise.all(
          tripIds.map((tripId) => getDocument<Trip>(COLLECTIONS.TRIPS, tripId))
        );
        const tripById = new globalThis.Map(
          tripIds.map((tripId, index) => [tripId, tripResults[index]])
        );

        const enriched = bookingRows
          .map((booking) => ({
            ...booking,
            tripDepartureDate: parseTimestamp(
              tripById.get(booking.tripId)?.departureDate
            ),
          }))
          .sort((a, b) => {
            const aTime =
              a.tripDepartureDate?.getTime() ||
              parseTimestamp(a.createdAt)?.getTime() ||
              0;
            const bTime =
              b.tripDepartureDate?.getTime() ||
              parseTimestamp(b.createdAt)?.getTime() ||
              0;
            return bTime - aTime;
          });

        setBookings(enriched);
      } catch {
        setLoadError(t("تعذر تحميل رحلاتك حالياً.", "Unable to load your trips right now."));
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [authLoading, userData?.uid, t]);

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    return bookings.filter((booking) => {
      const departureTime = booking.tripDepartureDate?.getTime();
      if (!departureTime) return tab === "upcoming";
      return tab === "upcoming"
        ? departureTime >= todayTime
        : departureTime < todayTime;
    });
  }, [bookings, tab]);

  return (
    <div className="travel-orbit-bg min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      <div className="border-b border-surface-border bg-white/78 px-4 pb-4 pt-8 backdrop-blur-sm dark:border-surface-dark-border dark:bg-surface-dark-card/74 sm:pt-12">
        <Container>
          <h1 className="travel-title text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">
            {t("رحلاتي", "My Trips")}
          </h1>
          <div className="flex gap-2 mt-3 sm:mt-4">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-[var(--radius-chip)] text-body-sm font-medium transition-all ${
                  tab === t
                    ? "bg-gradient-to-br from-navy-600 to-navy-700 text-white"
                    : "bg-surface-muted text-navy-600 dark:bg-surface-dark-card dark:text-navy-300"
                }`}
              >
                {t === "upcoming"
                  ? language === "ar" ? "القادمة" : "Upcoming"
                  : language === "ar" ? "السابقة" : "Past"}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {loading ? (
          <p className="py-10 text-center text-body-md text-navy-500">
            {t("جاري تحميل رحلاتك...", "Loading your trips...")}
          </p>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const statusInfo = statusLabels[booking.status] || statusLabels.confirmed;
              const departureLabel = booking.tripDepartureDate
                ? formatDate(booking.tripDepartureDate)
                : t("غير محدد", "Not set");

              return (
                <Card key={booking.id} variant="elevated" padding="md" hoverable onClick={() => router.push(`/app/my-trips/${booking.id}`)}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-navy-100 dark:bg-navy-800 sm:flex">
                      <MapPin className="h-6 w-6 text-navy-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-md font-semibold text-navy-900 dark:text-white truncate sm:text-body-lg">{booking.tripTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-body-sm text-navy-500 sm:gap-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {departureLabel}</span>
                        <Badge variant={statusInfo.variant} size="sm">
                          {language === "ar" ? statusInfo.ar : statusInfo.en}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-body-sm font-bold text-navy-900 dark:text-white sm:text-body-md">{formatKWD(booking.totalKWD)}</p>
                      <ChevronLeft className="h-4 w-4 text-navy-400 ms-auto mt-1 rtl:rotate-180" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<MapIcon className="h-16 w-16" />}
            title={t("لا توجد رحلات", "No Trips Yet")}
            description={t("ابدأ بتصفح الرحلات المتاحة واحجز رحلتك القادمة", "Browse available trips and make your first booking")}
            action={{ label: t("تصفح الرحلات", "Explore Trips"), onClick: () => router.push("/app/discover") }}
          />
        )}

        {loadError && (
          <p className="mt-4 text-body-sm text-center text-error">{loadError}</p>
        )}
      </Container>
    </div>
  );
}
