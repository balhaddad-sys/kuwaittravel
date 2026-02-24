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
    <div className="min-h-screen">

      {/* ─── Clean Header ─── */}
      <div className="bg-white dark:bg-[#111827] border-b border-[#EBEBEB] dark:border-[#2D3B4F] px-4 pt-10 pb-0">
        <Container>
          <h1 className="text-xl font-bold text-[#222222] dark:text-white pb-4">
            {t("رحلاتي", "My Trips")}
            {!loading && bookings.length > 0 && (
              <span className="ms-2 text-sm font-normal text-[#717171]">
                ({bookings.length})
              </span>
            )}
          </h1>

          {/* Underline-style tabs */}
          <div className="flex gap-0">
            {(["upcoming", "past"] as const).map((tabKey) => {
              const count = tabKey === "upcoming" ? upcomingBookings.length : pastBookings.length;
              const isActive = tab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`relative pb-3 px-4 text-[0.9375rem] font-semibold transition-colors ${
                    isActive
                      ? "text-[#222222] dark:text-white"
                      : "text-[#717171] dark:text-slate-400"
                  }`}
                >
                  {tabKey === "upcoming" ? t("القادمة", "Upcoming") : t("السابقة", "Past")}
                  {!loading && count > 0 && (
                    <span className={`ms-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sky-500" />
                  )}
                </button>
              );
            })}
          </div>
        </Container>
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
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => router.push(`/app/my-trips/${booking.id}`)}
                  className="group w-full overflow-hidden rounded-xl border border-[#EBEBEB] bg-white text-start transition-colors hover:bg-slate-50 dark:border-[#2D3B4F]/60 dark:bg-[#1E293B]/90 dark:hover:bg-[#1E293B]"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Status icon bubble */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${status.bg}`}
                    >
                      <span className={status.color}>{status.icon}</span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[0.9375rem] font-semibold text-[#222222] dark:text-white">
                        {booking.tripTitle}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[0.8125rem] text-[#717171] dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {departureLabel}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.bg} ${status.color}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {language === "ar" ? status.ar : status.en}
                        </span>
                      </div>
                    </div>

                    {/* Price + chevron */}
                    <div className="shrink-0 text-end">
                      <p className="font-numbers text-[0.9375rem] font-bold text-[#222222] dark:text-white">
                        {formatKWD(booking.totalKWD)}
                      </p>
                      <ChevronLeft className="ms-auto mt-1.5 h-4 w-4 text-slate-300 rtl:rotate-180 dark:text-slate-500" />
                    </div>
                  </div>
                </button>
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
