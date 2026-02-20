"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FAB } from "@/components/ui/FAB";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { where } from "firebase/firestore";
import { parseTimestamp, formatRelativeTime, formatKWD } from "@/lib/utils/format";
import type { Campaign } from "@/types/campaign";
import type { Trip } from "@/types/trip";
import type { Booking } from "@/types/booking";
import type { VerificationStatus, TripStatus } from "@/types/common";
import { Users, Map, Wallet, AlertTriangle, Plus, BookOpen, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const ACTIVE_TRIP_STATUSES: TripStatus[] = ["published", "registration_open", "registration_closed", "in_progress"];

const bookingStatusBadge: Record<string, { variant: "success" | "warning" | "error" | "info" | "default"; labelAr: string; label: string }> = {
  pending_payment: { variant: "warning", labelAr: "بانتظار الدفع", label: "Pending Payment" },
  confirmed: { variant: "success", labelAr: "مؤكد", label: "Confirmed" },
  partially_paid: { variant: "info", labelAr: "مدفوع جزئياً", label: "Partially Paid" },
  fully_paid: { variant: "success", labelAr: "مدفوع بالكامل", label: "Fully Paid" },
  checked_in: { variant: "info", labelAr: "تم التسجيل", label: "Checked In" },
  in_transit: { variant: "info", labelAr: "في الطريق", label: "In Transit" },
  completed: { variant: "success", labelAr: "مكتمل", label: "Completed" },
  cancelled: { variant: "error", labelAr: "ملغي", label: "Cancelled" },
  refunded: { variant: "default", labelAr: "مسترد", label: "Refunded" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch campaign verification status
  useEffect(() => {
    if (!userData?.campaignId) return;
    getDocument<Campaign>(COLLECTIONS.CAMPAIGNS, userData.campaignId).then((campaign) => {
      if (campaign) {
        setVerificationStatus(campaign.verificationStatus);
        setRejectionReason(campaign.rejectionReason ?? null);
      }
    });
  }, [userData?.campaignId]);

  // Real-time trips listener
  useEffect(() => {
    if (!firebaseUser || !userData?.campaignId) return;
    const unsub = onCollectionChange<Trip>(
      COLLECTIONS.TRIPS,
      [where("campaignId", "==", userData.campaignId)],
      (data) => {
        setTrips(data);
        setLoadingTrips(false);
      },
      () => setLoadingTrips(false)
    );
    return unsub;
  }, [firebaseUser, userData?.campaignId]);

  // Real-time bookings listener
  useEffect(() => {
    if (!firebaseUser || !userData?.campaignId) return;
    const unsub = onCollectionChange<Booking>(
      COLLECTIONS.BOOKINGS,
      [where("campaignId", "==", userData.campaignId)],
      (data) => {
        setBookings(data);
        setLoadingBookings(false);
      },
      () => setLoadingBookings(false)
    );
    return unsub;
  }, [firebaseUser, userData?.campaignId]);

  // Computed stats
  const activeTrips = useMemo(
    () => trips.filter((tr) => ACTIVE_TRIP_STATUSES.includes(tr.status)),
    [trips]
  );

  const totalTravelers = useMemo(
    () => bookings.reduce((sum, b) => sum + b.numberOfPassengers, 0),
    [bookings]
  );

  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status !== "cancelled" && b.status !== "refunded").reduce((sum, b) => sum + b.paidKWD, 0),
    [bookings]
  );

  const pendingActions = useMemo(
    () => bookings.filter((b) => b.status === "pending_payment").length,
    [bookings]
  );

  // Recent bookings (latest 5)
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        const da = parseTimestamp(a.createdAt)?.getTime() ?? 0;
        const db = parseTimestamp(b.createdAt)?.getTime() ?? 0;
        return db - da;
      })
      .slice(0, 5);
  }, [bookings]);

  // Performance stats
  const performanceStats = useMemo(() => {
    const confirmedBookings = bookings.filter((b) => !["cancelled", "refunded"].includes(b.status));
    const avgBookingValue = confirmedBookings.length > 0
      ? confirmedBookings.reduce((sum, b) => sum + b.totalKWD, 0) / confirmedBookings.length
      : 0;
    const occupancyRate = activeTrips.length > 0
      ? activeTrips.reduce((sum, tr) => sum + (tr.totalCapacity > 0 ? (tr.bookedCount / tr.totalCapacity) * 100 : 0), 0) / activeTrips.length
      : 0;
    const completedCount = bookings.filter((b) => b.status === "completed").length;
    return { avgBookingValue, occupancyRate, completedCount };
  }, [bookings, activeTrips]);

  const loading = loadingTrips || loadingBookings;

  return (
    <>
      <AppBar
        title={t("لوحة التحكم", "Dashboard")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal") }, { label: t("لوحة التحكم", "Dashboard") }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            className="max-[420px]:px-3"
            onClick={() => router.push("/portal/trips/create")}
          >
            <span className="max-[420px]:hidden">{t("رحلة جديدة", "New Trip")}</span>
            <span className="min-[421px]:hidden">{t("جديدة", "New")}</span>
          </Button>
        }
      />

      <Container className="sacred-pattern py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Verification Status Banners */}
        {verificationStatus === "pending" && (
          <AlertBanner
            type="info"
            title={t("حملتك قيد المراجعة", "Your campaign is under review")}
            description={t(
              "يقوم فريقنا بمراجعة وثائقك. سيتم إخطارك فور اكتمال المراجعة.",
              "Our team is reviewing your documents. You will be notified once the review is complete."
            )}
          />
        )}
        {verificationStatus === "rejected" && (
          <AlertBanner
            type="error"
            title={t("تم رفض طلب التحقق", "Verification declined")}
            description={rejectionReason || t("يرجى التواصل مع الدعم لمعرفة التفاصيل", "Please contact support for details")}
          />
        )}
        {verificationStatus === "suspended" && (
          <AlertBanner
            type="warning"
            title={t("حملتك معلقة", "Campaign suspended")}
            description={t("يرجى التواصل مع الدعم لمعرفة التفاصيل", "Please contact support for details")}
          />
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t("الرحلات النشطة", "Active Trips")}
            value={loading ? "—" : activeTrips.length}
            icon={<Map className="h-6 w-6" />}
            className="animate-stagger-in"
            hoverable
          />
          <StatCard
            title={t("إجمالي المسافرين", "Total Travelers")}
            value={loading ? "—" : totalTravelers}
            icon={<Users className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-1"
            hoverable
          />
          <StatCard
            title={t("الإيرادات (د.ك)", "Revenue (KWD)")}
            value={loading ? "—" : formatKWD(totalRevenue)}
            icon={<Wallet className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-2"
            hoverable
          />
          <StatCard
            title={t("إجراءات معلقة", "Pending Actions")}
            value={loading ? "—" : pendingActions}
            icon={<AlertTriangle className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-3"
            hoverable
          />
        </div>

        {/* Active Trips Section */}
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border/85 bg-gradient-to-r from-indigo-800 to-indigo-900 px-4 py-3 dark:border-surface-dark-border/85">
            <h2 className="text-body-lg sm:text-heading-md font-bold text-white">
              {t("الرحلات النشطة", "Active Trips")}
            </h2>
            <Button variant="secondary" size="sm" onClick={() => router.push("/portal/trips")}>
              {t("عرض الكل", "View All")}
            </Button>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : activeTrips.length === 0 ? (
              <EmptyState
                icon={<Map className="h-16 w-16" />}
                title={t("لا توجد رحلات نشطة", "No Active Trips")}
                description={t("أنشئ رحلتك الأولى للبدء", "Create your first trip to get started")}
                action={{ label: t("إنشاء رحلة", "Create Trip"), onClick: () => router.push("/portal/trips/create") }}
              />
            ) : (
              <div className="space-y-2">
                {activeTrips.slice(0, 5).map((trip) => {
                  const departure = parseTimestamp(trip.departureDate);
                  return (
                    <button
                      key={trip.id}
                      onClick={() => router.push(`/portal/trips/${trip.id}`)}
                      className="group w-full text-start flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:border-[#1A2D48] dark:bg-indigo-800"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-indigo-800">
                        <Map className="h-5 w-5 text-gray-500 dark:text-indigo-300/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body-sm font-bold text-gray-900 dark:text-white truncate">
                          {language === "ar" ? trip.titleAr : trip.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 dark:text-indigo-300/45">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {trip.bookedCount}/{trip.totalCapacity}
                          </span>
                          {departure && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {departure.toLocaleDateString(language === "ar" ? "ar-KW" : "en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={trip.status === "in_progress" ? "info" : "success"} size="sm" dot>
                        {trip.status === "in_progress"
                          ? t("جارية", "In Progress")
                          : trip.status === "registration_open"
                            ? t("تسجيل مفتوح", "Open")
                            : trip.status === "registration_closed"
                              ? t("تسجيل مغلق", "Closed")
                              : t("منشورة", "Published")}
                      </Badge>
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors dark:text-indigo-400/50 rtl:rotate-180" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Bottom Grid: Recent Bookings + Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Recent Bookings */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                  <BookOpen className="h-4 w-4" />
                </span>
                {t("آخر الحجوزات", "Recent Bookings")}
              </h3>
              {bookings.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/portal/bookings")}>
                  {t("الكل", "All")}
                </Button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
              </div>
            ) : recentBookings.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-12 w-12" />}
                title={t("لا توجد حجوزات", "No Bookings Yet")}
                description={t("ستظهر هنا أحدث الحجوزات", "Recent bookings will appear here")}
                className="py-8"
              />
            ) : (
              <div className="space-y-2">
                {recentBookings.map((booking) => {
                  const date = parseTimestamp(booking.createdAt);
                  const badge = bookingStatusBadge[booking.status] ?? bookingStatusBadge.pending_payment;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-[#1A2D48] dark:bg-indigo-800/50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-indigo-700">
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-indigo-300/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-gray-900 dark:text-white truncate">
                          {booking.travelerName}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-indigo-300/45 truncate">
                          {booking.tripTitle} &middot; {formatKWD(booking.totalKWD)}
                        </p>
                      </div>
                      <div className="shrink-0 text-end">
                        <Badge variant={badge.variant} size="sm">
                          {language === "ar" ? badge.labelAr : badge.label}
                        </Badge>
                        {date && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatRelativeTime(date, language === "ar" ? "ar-KW" : "en-US")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Performance Summary */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                <TrendingUp className="h-4 w-4" />
              </span>
              {t("ملخص الأداء", "Performance Summary")}
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-12 w-12" />}
                title={t("لا توجد بيانات", "No Data Yet")}
                description={t("ستظهر هنا مؤشرات الأداء", "Performance metrics will appear here")}
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-[#1A2D48] dark:bg-indigo-800/50">
                  <span className="text-body-sm text-gray-600 dark:text-indigo-300/60">
                    {t("متوسط قيمة الحجز", "Avg. Booking Value")}
                  </span>
                  <span className="text-body-sm font-bold text-gray-900 dark:text-white tabular-nums" dir="ltr">
                    {formatKWD(performanceStats.avgBookingValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-[#1A2D48] dark:bg-indigo-800/50">
                  <span className="text-body-sm text-gray-600 dark:text-indigo-300/60">
                    {t("نسبة الإشغال", "Occupancy Rate")}
                  </span>
                  <span className="text-body-sm font-bold text-gray-900 dark:text-white tabular-nums">
                    {performanceStats.occupancyRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-[#1A2D48] dark:bg-indigo-800/50">
                  <span className="text-body-sm text-gray-600 dark:text-indigo-300/60">
                    {t("الحجوزات المكتملة", "Completed Bookings")}
                  </span>
                  <span className="text-body-sm font-bold text-gray-900 dark:text-white tabular-nums">
                    {performanceStats.completedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-[#1A2D48] dark:bg-indigo-800/50">
                  <span className="text-body-sm text-gray-600 dark:text-indigo-300/60">
                    {t("إجمالي الحجوزات", "Total Bookings")}
                  </span>
                  <span className="text-body-sm font-bold text-gray-900 dark:text-white tabular-nums">
                    {bookings.length}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Container>

      <FAB
        icon={<Plus className="h-6 w-6" />}
        onClick={() => router.push("/portal/trips/create")}
        position="bottom-right-nav"
      />
    </>
  );
}
