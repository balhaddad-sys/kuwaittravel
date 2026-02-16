"use client";

import { useEffect, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Map as MapIcon,
  Calendar,
  MapPin,
  ChevronLeft,
  Plane,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatKWD, parseTimestamp } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Booking, Trip } from "@/types";

const statusLabels: Record<
  string,
  { ar: string; en: string; variant: "success" | "warning" | "error" | "info" }
> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", variant: "success" },
  pending_payment: {
    ar: "بانتظار الدفع",
    en: "Pending Payment",
    variant: "warning",
  },
  completed: { ar: "مكتمل", en: "Completed", variant: "info" },
  cancelled: { ar: "ملغي", en: "Cancelled", variant: "error" },
};

interface EnrichedBooking extends Booking {
  tripDepartureDate: Date | null;
}

function SkeletonBooking() {
  return (
    <div className="skeleton-card overflow-hidden p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden h-14 w-14 rounded-[var(--radius-lg)] bg-navy-100/50 dark:bg-navy-800/50 sm:block" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
          <div className="flex gap-2">
            <div className="h-3 w-24 rounded-md bg-navy-100/40 dark:bg-navy-800/40" />
            <div className="h-5 w-16 rounded-full bg-navy-100/40 dark:bg-navy-800/40" />
          </div>
        </div>
        <div className="space-y-2 text-end">
          <div className="ms-auto h-4 w-16 rounded-md bg-navy-100/60 dark:bg-navy-800/60" />
          <div className="ms-auto h-4 w-4 rounded bg-navy-100/40 dark:bg-navy-800/40" />
        </div>
      </div>
    </div>
  );
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

        const tripIds = [
          ...new Set(bookingRows.map((booking) => booking.tripId)),
        ];
        const tripResults = await Promise.all(
          tripIds.map((tripId) =>
            getDocument<Trip>(COLLECTIONS.TRIPS, tripId)
          )
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
        setLoadError(
          t(
            "تعذر تحميل رحلاتك حالياً.",
            "Unable to load your trips right now."
          )
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [authLoading, userData?.uid, t]);

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    return bookings.filter((b) => {
      const dt = b.tripDepartureDate?.getTime();
      return !dt || dt >= todayTime;
    });
  }, [bookings]);

  const pastBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    return bookings.filter((b) => {
      const dt = b.tripDepartureDate?.getTime();
      return dt !== undefined && dt < todayTime;
    });
  }, [bookings]);

  const filteredBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="travel-orbit-bg min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      {/* Header */}
      <div className="travel-cover-pattern border-b border-surface-border bg-white/78 px-4 pb-4 pt-8 backdrop-blur-sm dark:border-surface-dark-border dark:bg-surface-dark-card/74 sm:pt-12">
        <Container>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-md sm:h-11 sm:w-11">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <h1 className="travel-title text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">
                {t("رحلاتي", "My Trips")}
              </h1>
              {!loading && bookings.length > 0 && (
                <p className="text-body-sm text-navy-500 dark:text-navy-300">
                  {bookings.length}{" "}
                  {t("حجز إجمالي", "total bookings")}
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2 sm:mt-5">
            {(["upcoming", "past"] as const).map((tabKey) => {
              const count =
                tabKey === "upcoming"
                  ? upcomingBookings.length
                  : pastBookings.length;
              return (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`travel-filter-chip flex items-center gap-1.5 px-4 py-2 text-body-sm font-medium ${
                    tab === tabKey ? "travel-filter-chip-active" : ""
                  }`}
                >
                  {tabKey === "upcoming"
                    ? t("القادمة", "Upcoming")
                    : t("السابقة", "Past")}
                  {!loading && count > 0 && (
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        tab === tabKey
                          ? "bg-white/20 text-white"
                          : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBooking key={i} />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((booking, i) => {
              const statusInfo =
                statusLabels[booking.status] || statusLabels.confirmed;
              const accentClass =
                booking.status === "confirmed"
                  ? "bg-success/85"
                  : booking.status === "pending_payment"
                    ? "bg-warning/85"
                    : booking.status === "cancelled"
                      ? "bg-error/85"
                      : "bg-info/85";
              const departureLabel = booking.tripDepartureDate
                ? formatDate(booking.tripDepartureDate)
                : t("غير محدد", "Not set");

              return (
                <div
                  key={booking.id}
                  className="animate-stagger-fade-up"
                  style={
                    {
                      "--stagger-delay": `${i * 50}ms`,
                    } as React.CSSProperties
                  }
                >
                  <Card
                    variant="elevated"
                    padding="md"
                    hoverable
                    onClick={() =>
                      router.push(`/app/my-trips/${booking.id}`)
                    }
                    className="relative overflow-hidden"
                  >
                    <span
                      className={`absolute inset-y-2 start-0 w-1 rounded-full ${accentClass}`}
                    />
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="hidden h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-navy-100 dark:bg-navy-800 sm:flex">
                        <MapPin className="h-6 w-6 text-navy-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-body-md font-semibold text-navy-900 dark:text-white sm:text-body-lg">
                          {booking.tripTitle}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-body-sm text-navy-500 sm:gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />{" "}
                            {departureLabel}
                          </span>
                          <Badge variant={statusInfo.variant} size="sm">
                            {language === "ar"
                              ? statusInfo.ar
                              : statusInfo.en}
                          </Badge>
                        </div>
                      </div>
                      <div className="shrink-0 text-end">
                        <p className="text-body-sm font-bold text-navy-900 dark:text-white sm:text-body-md">
                          {formatKWD(booking.totalKWD)}
                        </p>
                        <ChevronLeft className="ms-auto mt-1 h-4 w-4 text-navy-400 rtl:rotate-180" />
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<MapIcon className="h-16 w-16" />}
            title={t("لا توجد رحلات", "No Trips Yet")}
            description={t(
              "ابدأ بتصفح الرحلات المتاحة واحجز رحلتك القادمة",
              "Browse available trips and make your first booking"
            )}
            action={{
              label: t("تصفح الرحلات", "Explore Trips"),
              onClick: () => router.push("/app/discover"),
            }}
          />
        )}

        {loadError && (
          <p className="mt-4 text-center text-body-sm text-error">
            {loadError}
          </p>
        )}
      </Container>
    </div>
  );
}
