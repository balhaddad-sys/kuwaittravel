"use client";

import { useEffect, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Calendar,
  ChevronLeft,
  Plane,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate, formatKWD, parseTimestamp } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Booking, Trip } from "@/types";

const statusConfig: Record<
  string,
  { ar: string; en: string; icon: React.ReactNode; color: string; bg: string; dot: string; border: string }
> = {
  confirmed: {
    ar: "مؤكد",
    en: "Confirmed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    dot: "bg-emerald-500",
    border: "border-emerald-100 dark:border-emerald-900/30",
  },
  pending_payment: {
    ar: "بانتظار الدفع",
    en: "Pending Payment",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    dot: "bg-orange-500",
    border: "border-orange-100 dark:border-orange-900/30",
  },
  completed: {
    ar: "مكتمل",
    en: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    dot: "bg-sky-500",
    border: "border-sky-100 dark:border-sky-900/30",
  },
  cancelled: {
    ar: "ملغي",
    en: "Cancelled",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    dot: "bg-red-500",
    border: "border-red-100 dark:border-red-900/30",
  },
};

interface EnrichedBooking extends Booking {
  tripDepartureDate: Date | null;
}

function SkeletonBooking() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-[#2D3B4F]/60 dark:bg-[#1E293B]/80">
      <div className="flex items-center gap-4 p-5">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-700/40 animate-pulse" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-700/40 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-28 rounded-lg bg-slate-100 dark:bg-slate-700/40 animate-pulse" />
            <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-700/40 animate-pulse" />
          </div>
        </div>
        <div className="shrink-0 space-y-2 text-end">
          <div className="h-4 w-16 rounded-lg bg-slate-100 dark:bg-slate-700/40 animate-pulse ms-auto" />
          <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-700/40 animate-pulse ms-auto" />
        </div>
      </div>
    </div>
  );
}

export default function MyTripsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useDirection();
  const { userData, loading: authLoading } = useAuth();
  const tabParam = searchParams.get("tab");
  const [tab, setTabState] = useState<"upcoming" | "past">(tabParam === "past" ? "past" : "upcoming");

  const setTab = (newTab: "upcoming" | "past") => {
    setTabState(newTab);
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "past") {
      params.set("tab", "past");
    } else {
      params.delete("tab");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };
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
            tripDepartureDate: parseTimestamp(tripById.get(booking.tripId)?.departureDate),
          }))
          .sort((a, b) => {
            const aTime = a.tripDepartureDate?.getTime() || parseTimestamp(a.createdAt)?.getTime() || 0;
            const bTime = b.tripDepartureDate?.getTime() || parseTimestamp(b.createdAt)?.getTime() || 0;
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
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1120]">

      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#082F49] via-[#0C4A6E] to-[#2E1065]">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -start-12 h-48 w-48 rounded-full bg-sky-400/20 blur-2xl" />
        <div className="pointer-events-none absolute top-0 start-1/3 h-32 w-64 rounded-full bg-violet-400/10 blur-3xl" />

        <Container className="relative pb-16 pt-10 sm:pt-12">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm ring-1 ring-white/20">
              <Plane className="h-[1.375rem] w-[1.375rem] text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("رحلاتي", "My Trips")}
              </h1>
              {!loading && bookings.length > 0 && (
                <p className="mt-0.5 text-sm text-sky-100/80">
                  {bookings.length} {t("حجز إجمالي", "total bookings")}
                </p>
              )}
            </div>
          </div>
        </Container>

        {/* ─── Tab bar attached to bottom of hero ─── */}
        <div className="relative">
          <Container>
            <div className="flex gap-1">
              {(["upcoming", "past"] as const).map((tabKey) => {
                const count = tabKey === "upcoming" ? upcomingBookings.length : pastBookings.length;
                const isActive = tab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    className={`relative flex items-center gap-2 rounded-t-xl px-5 pb-3.5 pt-2.5 text-[0.9375rem] font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#F5F7FA] text-sky-600 dark:bg-[#0B1120] dark:text-sky-400"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {tabKey === "upcoming" ? t("القادمة", "Upcoming") : t("السابقة", "Past")}
                    {!loading && count > 0 && (
                      <span
                        className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-sky-600 text-white dark:bg-sky-500"
                            : "bg-white/20 text-white"
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
      </div>

      {/* ─── Content ─── */}
      <Container className="py-5">
        {!userData && !authLoading ? (
          <div className="py-10">
            <EmptyState
              icon={<LogIn className="h-14 w-14 text-slate-200 dark:text-sky-400/50" />}
              title={t("سجّل دخولك", "Sign in required")}
              description={t("سجّل دخولك لعرض رحلاتك وحجوزاتك", "Sign in to view your trips and bookings")}
              action={{ label: t("تسجيل الدخول", "Sign In"), onClick: () => router.push("/login") }}
            />
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBooking key={i} />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((booking, i) => {
              const status = statusConfig[booking.status] || statusConfig.confirmed;
              const departureLabel = booking.tripDepartureDate
                ? formatDate(booking.tripDepartureDate)
                : t("غير محدد", "Not set");

              return (
                <div
                  key={booking.id}
                  className="animate-stagger-fade-up"
                  style={{ "--stagger-delay": `${i * 50}ms` } as React.CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/app/my-trips/${booking.id}`)}
                    className="group w-full overflow-hidden rounded-2xl border border-slate-100/80 bg-white text-start shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 dark:border-[#2D3B4F]/60 dark:bg-[#1E293B]/90"
                  >
                    {/* Coloured top accent line */}
                    <div className={`h-0.5 w-full ${status.dot}`} />

                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      {/* Status icon bubble */}
                      <div
                        className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:flex ${status.bg} ring-1 ${status.border}`}
                      >
                        <span className={status.color}>{status.icon}</span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[0.9375rem] font-semibold text-slate-900 dark:text-white">
                          {booking.tripTitle}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="flex items-center gap-1.5 text-[0.8125rem] text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {departureLabel}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.bg} ${status.color} ring-1 ${status.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {language === "ar" ? status.ar : status.en}
                          </span>
                        </div>
                      </div>

                      {/* Price + chevron */}
                      <div className="shrink-0 text-end">
                        <p className="font-numbers text-[0.9375rem] font-bold text-slate-900 dark:text-white">
                          {formatKWD(booking.totalKWD)}
                        </p>
                        <ChevronLeft className="ms-auto mt-2 h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-slate-400/60" />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10">
            <EmptyState
              icon={<Plane className="h-14 w-14 text-slate-200 dark:text-sky-400/50" />}
              title={t("لا توجد رحلات", "No Trips Yet")}
              description={
                tab === "upcoming"
                  ? t(
                      "احجز رحلتك القادمة وابدأ رحلتك",
                      "Book your next trip and start your journey"
                    )
                  : t("لم تكمل أي رحلات بعد", "You haven't completed any trips yet")
              }
              action={{
                label: t("تصفح الرحلات", "Explore Trips"),
                onClick: () => router.push("/app/discover"),
              }}
            />
          </div>
        )}

        {loadError && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-center dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
