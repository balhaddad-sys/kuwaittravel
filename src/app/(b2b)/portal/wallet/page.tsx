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
import { where } from "firebase/firestore";
import { parseTimestamp, formatRelativeTime, formatKWD } from "@/lib/utils/format";
import type { Booking } from "@/types/booking";
import { Wallet, ArrowUpRight, Clock, CheckCircle2, CreditCard, ArrowDownLeft } from "lucide-react";

const PLATFORM_FEE_RATE = 0.02; // 2% platform fee

export default function WalletPage() {
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time bookings listener
  useEffect(() => {
    if (!firebaseUser || !userData?.campaignId) return;
    const unsub = onCollectionChange<Booking>(
      COLLECTIONS.BOOKINGS,
      [where("campaignId", "==", userData.campaignId)],
      (data) => {
        setBookings(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [firebaseUser, userData?.campaignId]);

  // Available balance: sum of paidKWD from confirmed/completed bookings minus 2% platform fee
  const availableBalance = useMemo(() => {
    const confirmedStatuses = ["confirmed", "fully_paid", "checked_in", "in_transit", "completed"];
    const total = bookings
      .filter((b) => confirmedStatuses.includes(b.status))
      .reduce((sum, b) => sum + b.paidKWD, 0);
    return total * (1 - PLATFORM_FEE_RATE);
  }, [bookings]);

  // Pending balance: sum of remainingKWD from active (non-cancelled, non-refunded, non-completed) bookings
  const pendingBalance = useMemo(() => {
    const activeStatuses = ["pending_payment", "confirmed", "partially_paid", "fully_paid", "checked_in", "in_transit"];
    return bookings
      .filter((b) => activeStatuses.includes(b.status))
      .reduce((sum, b) => sum + b.remainingKWD, 0);
  }, [bookings]);

  // Total earnings: sum of totalKWD from completed bookings
  const totalEarnings = useMemo(() => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.totalKWD, 0);
  }, [bookings]);

  // Total platform fees deducted
  const totalFees = useMemo(() => {
    const confirmedStatuses = ["confirmed", "fully_paid", "checked_in", "in_transit", "completed"];
    const totalPaid = bookings
      .filter((b) => confirmedStatuses.includes(b.status))
      .reduce((sum, b) => sum + b.paidKWD, 0);
    return totalPaid * PLATFORM_FEE_RATE;
  }, [bookings]);

  // Recent payment transactions (bookings with payments, sorted by date)
  const recentTransactions = useMemo(() => {
    return [...bookings]
      .filter((b) => b.paidKWD > 0 && b.status !== "cancelled")
      .sort((a, b) => {
        const da = parseTimestamp(a.createdAt)?.getTime() ?? 0;
        const db = parseTimestamp(b.createdAt)?.getTime() ?? 0;
        return db - da;
      })
      .slice(0, 20);
  }, [bookings]);

  return (
    <>
      <AppBar
        title={t("المحفظة", "Wallet")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("المحفظة", "Wallet") }]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t("الرصيد المتاح", "Available Balance")}
            value={loading ? "—" : formatKWD(availableBalance)}
            icon={<Wallet className="h-5 w-5" />}
            hoverable
          />
          <StatCard
            title={t("رصيد معلق", "Pending Balance")}
            value={loading ? "—" : formatKWD(pendingBalance)}
            icon={<Clock className="h-5 w-5" />}
            hoverable
          />
          <StatCard
            title={t("رسوم المنصة", "Platform Fees")}
            value={loading ? "—" : formatKWD(totalFees)}
            icon={<ArrowUpRight className="h-5 w-5" />}
            hoverable
          />
          <StatCard
            title={t("إجمالي الأرباح", "Total Earnings")}
            value={loading ? "—" : formatKWD(totalEarnings)}
            icon={<CheckCircle2 className="h-5 w-5" />}
            hoverable
          />
        </div>

        {/* Revenue summary card */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4">
            {t("ملخص الإيرادات", "Revenue Summary")}
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-body-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t("لا توجد بيانات إيرادات بعد", "No revenue data yet")}
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  {t("إجمالي المحصّل", "Total Collected")}
                </span>
                <span className="text-body-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums" dir="ltr">
                  {formatKWD(bookings.filter((b) => b.status !== "cancelled" && b.status !== "refunded").reduce((s, b) => s + b.paidKWD, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  {t("رسوم المنصة (2%)", "Platform Fee (2%)")}
                </span>
                <span className="text-body-sm font-bold text-red-500 dark:text-red-400 tabular-nums" dir="ltr">
                  -{formatKWD(totalFees)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-900/40 dark:bg-orange-900/10">
                <span className="text-body-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("صافي الإيرادات", "Net Revenue")}
                </span>
                <span className="text-body-md font-bold text-gray-900 dark:text-white tabular-nums" dir="ltr">
                  {formatKWD(availableBalance)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Transaction history */}
        <Card variant="elevated" padding="none">
          <div className="px-4 py-3 border-b border-surface-border dark:border-surface-dark-border">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white">
              {t("سجل المعاملات", "Transaction History")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("المدفوعات المستلمة من حجوزات المسافرين", "Payments received from traveler bookings")}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : recentTransactions.length === 0 ? (
            <EmptyState
              icon={<Wallet className="h-16 w-16" />}
              title={t("لا توجد معاملات", "No Transactions")}
              description={t("ستظهر هنا جميع المعاملات المالية", "All financial transactions will appear here")}
            />
          ) : (
            <div className="divide-y divide-surface-border/70 dark:divide-surface-dark-border/70">
              {recentTransactions.map((booking) => {
                const date = parseTimestamp(booking.createdAt);
                const isCompleted = booking.status === "completed" || booking.status === "fully_paid";
                return (
                  <div key={booking.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-orange-100 dark:bg-orange-900/30"
                    }`}>
                      {isCompleted ? (
                        <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-gray-900 dark:text-white truncate">
                        {booking.travelerName}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                        {booking.tripTitle}
                      </p>
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="text-body-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums" dir="ltr">
                        +{formatKWD(booking.paidKWD)}
                      </p>
                      {date && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {formatRelativeTime(date, language === "ar" ? "ar-KW" : "en-US")}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={isCompleted ? "success" : booking.status === "refunded" ? "error" : "warning"}
                      size="sm"
                    >
                      {isCompleted
                        ? t("مكتمل", "Completed")
                        : booking.status === "partially_paid"
                          ? t("جزئي", "Partial")
                          : t("معلق", "Pending")}
                    </Badge>
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
