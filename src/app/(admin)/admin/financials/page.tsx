"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatKWD, parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Booking } from "@/types/booking";
import type { BookingStatus } from "@/types/common";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Building2,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";

/* -- Booking status display -- */

const bookingStatusConfig: Record<string, { variant: "default" | "success" | "warning" | "error" | "info"; labelAr: string; label: string }> = {
  pending_payment: { variant: "warning", labelAr: "\u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062f\u0641\u0639", label: "Pending Payment" },
  confirmed: { variant: "info", labelAr: "\u0645\u0624\u0643\u062f", label: "Confirmed" },
  partially_paid: { variant: "warning", labelAr: "\u0645\u062f\u0641\u0648\u0639 \u062c\u0632\u0626\u064a\u0627\u064b", label: "Partially Paid" },
  fully_paid: { variant: "success", labelAr: "\u0645\u062f\u0641\u0648\u0639 \u0628\u0627\u0644\u0643\u0627\u0645\u0644", label: "Fully Paid" },
  checked_in: { variant: "info", labelAr: "\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644", label: "Checked In" },
  in_transit: { variant: "info", labelAr: "\u0641\u064a \u0627\u0644\u0637\u0631\u064a\u0642", label: "In Transit" },
  completed: { variant: "success", labelAr: "\u0645\u0643\u062a\u0645\u0644", label: "Completed" },
  cancelled: { variant: "error", labelAr: "\u0645\u0644\u063a\u064a", label: "Cancelled" },
  refunded: { variant: "error", labelAr: "\u0645\u0633\u062a\u0631\u062f", label: "Refunded" },
};

/* -- Main page -- */

export default function FinancialsPage() {
  const { t, language } = useDirection();
  const { firebaseUser } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  // Real-time subscription
  useEffect(() => {
    if (!firebaseUser) return;
    setLoadingData(true);
    const unsub = onCollectionChange<Booking>(
      COLLECTIONS.BOOKINGS,
      [],
      (data) => {
        setBookings(data);
        setLoadingData(false);
      },
      (err) => {
        console.error("Bookings listener failed:", err);
        setLoadingData(false);
      }
    );
    return unsub;
  }, [firebaseUser]);

  // Period-filtered bookings
  const periodFiltered = useMemo(() => {
    const now = new Date();
    let cutoff: Date;

    if (period === "week") {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // quarter
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      cutoff = new Date(now.getFullYear(), quarterMonth, 1);
    }

    return bookings.filter((b) => {
      const d = parseTimestamp(b.createdAt);
      return d && d >= cutoff;
    });
  }, [bookings, period]);

  // Financial metrics
  const totalGMV = useMemo(() => periodFiltered.reduce((sum, b) => sum + (b.totalKWD || 0), 0), [periodFiltered]);
  const platformCommission = totalGMV * 0.02;

  const pendingPayouts = useMemo(
    () =>
      periodFiltered
        .filter((b) => b.status === "confirmed" || b.status === "partially_paid")
        .reduce((sum, b) => sum + (b.remainingKWD || 0), 0),
    [periodFiltered]
  );

  const refunds = useMemo(
    () =>
      periodFiltered
        .filter((b) => b.status === "refunded" || b.status === "cancelled")
        .reduce((sum, b) => sum + (b.paidKWD || 0), 0),
    [periodFiltered]
  );

  // Recent bookings sorted by date (newest first)
  const recentBookings = useMemo(() => {
    return [...periodFiltered]
      .sort((a, b) => {
        const dateA = parseTimestamp(a.createdAt)?.getTime() ?? 0;
        const dateB = parseTimestamp(b.createdAt)?.getTime() ?? 0;
        return dateB - dateA;
      })
      .slice(0, 20);
  }, [periodFiltered]);

  const getDate = (ts: unknown) => {
    const d = parseTimestamp(ts);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
  };

  return (
    <>
      <AppBar
        title={t("\u0627\u0644\u0645\u0627\u0644\u064a\u0629", "Financials")}
        breadcrumbs={[
          { label: t("\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645", "Admin Console"), href: "/admin/dashboard" },
          { label: t("\u0627\u0644\u0645\u0627\u0644\u064a\u0629", "Financials") },
        ]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t("GMV \u0627\u0644\u0634\u0647\u0631\u064a", "Monthly GMV")}
            value={loadingData ? "\u2026" : formatKWD(totalGMV)}
            icon={<Wallet className="h-5 w-5 text-amber-500" />}
            hoverable
          />
          <StatCard
            title={t("\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u0635\u0629", "Platform Commission")}
            value={loadingData ? "\u2026" : formatKWD(platformCommission)}
            icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
            hoverable
          />
          <StatCard
            title={t("\u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0627\u0644\u0645\u0639\u0644\u0642\u0629", "Pending Payouts")}
            value={loadingData ? "\u2026" : formatKWD(pendingPayouts)}
            icon={<ArrowUpRight className="h-5 w-5 text-amber-500" />}
            hoverable
          />
          <StatCard
            title={t("\u0627\u0644\u0645\u0628\u0627\u0644\u063a \u0627\u0644\u0645\u0633\u062a\u0631\u062f\u0629", "Refunds")}
            value={loadingData ? "\u2026" : formatKWD(refunds)}
            icon={<Wallet className="h-5 w-5 text-amber-500" />}
            hoverable
          />
        </div>

        {/* Bookings / Revenue Table */}
        <Card variant="elevated" padding="lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">
              {t("\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0627\u0644\u062d\u0645\u0644\u0627\u062a", "Campaign Revenue")}
            </h3>
            <div className="inline-flex items-center rounded-full border border-surface-border/80 bg-white/72 p-1 dark:border-surface-dark-border/80 dark:bg-surface-dark-card/72">
              {[
                { value: "week" as const, label: t("\u0623\u0633\u0628\u0648\u0639\u064a", "Weekly") },
                { value: "month" as const, label: t("\u0634\u0647\u0631\u064a", "Monthly") },
                { value: "quarter" as const, label: t("\u0631\u0628\u0639 \u0633\u0646\u0648\u064a", "Quarterly") },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-full px-2 py-1 text-body-sm transition-colors sm:px-3 ${
                    period === item.value
                      ? "bg-stone-700 text-white"
                      : "text-stone-600 dark:text-stone-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : recentBookings.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-16 w-16" />}
              title={t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0625\u064a\u0631\u0627\u062f\u0627\u062a", "No Revenue")}
              description={t(
                "\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0627\u0644\u062d\u0645\u0644\u0627\u062a \u0639\u0646\u062f \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a",
                "Campaign revenue will appear here once bookings are completed"
              )}
            />
          ) : (
            <div className="space-y-2">
              {/* Header row -- desktop */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                <span>{t("\u0627\u0644\u0645\u0633\u0627\u0641\u0631", "Traveler")}</span>
                <span>{t("\u0627\u0644\u0631\u062d\u0644\u0629", "Trip")}</span>
                <span className="w-24 text-end">{t("\u0627\u0644\u0645\u0628\u0644\u063a", "Amount")}</span>
                <span className="w-28 text-center">{t("\u0627\u0644\u062d\u0627\u0644\u0629", "Status")}</span>
                <span className="w-24 text-end">{t("\u0627\u0644\u062a\u0627\u0631\u064a\u062e", "Date")}</span>
              </div>

              {recentBookings.map((booking) => {
                const sc = bookingStatusConfig[booking.status] || bookingStatusConfig.pending_payment;
                return (
                  <div
                    key={booking.id}
                    className="group rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    {/* Mobile layout */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="h-4 w-4 shrink-0 text-stone-400" />
                          <span className="text-body-sm font-semibold text-stone-900 dark:text-white truncate">
                            {booking.travelerName}
                          </span>
                        </div>
                        <span className="tabular-nums text-body-sm font-bold text-stone-900 dark:text-white">
                          {formatKWD(booking.totalKWD)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {booking.tripTitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant={sc.variant} size="sm" dot>
                          {language === "ar" ? sc.labelAr : sc.label}
                        </Badge>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">
                          {getDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="h-4 w-4 shrink-0 text-stone-400" />
                        <span className="text-body-sm font-semibold text-stone-900 dark:text-white truncate">
                          {booking.travelerName}
                        </span>
                      </div>
                      <span className="text-body-sm text-stone-600 dark:text-stone-300 truncate">
                        {booking.tripTitle}
                      </span>
                      <span className="tabular-nums w-24 text-end text-body-sm font-bold text-stone-900 dark:text-white">
                        {formatKWD(booking.totalKWD)}
                      </span>
                      <div className="w-28 text-center">
                        <Badge variant={sc.variant} size="sm" dot>
                          {language === "ar" ? sc.labelAr : sc.label}
                        </Badge>
                      </div>
                      <span className="w-24 text-end text-[11px] text-stone-400 dark:text-stone-500">
                        {getDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
