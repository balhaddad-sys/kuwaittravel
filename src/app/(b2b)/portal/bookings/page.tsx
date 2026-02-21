"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { where } from "firebase/firestore";
import { cn } from "@/lib/utils/cn";
import { parseTimestamp, formatRelativeTime, formatKWD } from "@/lib/utils/format";
import type { Booking } from "@/types/booking";
import type { BookingStatus } from "@/types/common";
import { BookOpen, Users, CreditCard, Phone, ChevronDown, ChevronUp } from "lucide-react";

/* ── Status badge config ───────────────────────────────────────────── */

const statusConfig: Record<BookingStatus, { variant: "success" | "warning" | "error" | "info" | "default"; labelAr: string; label: string }> = {
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

type FilterValue = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const filterChips: { value: FilterValue; labelAr: string; label: string }[] = [
  { value: "all", labelAr: "الكل", label: "All" },
  { value: "pending", labelAr: "معلق", label: "Pending" },
  { value: "confirmed", labelAr: "مؤكد", label: "Confirmed" },
  { value: "completed", labelAr: "مكتمل", label: "Completed" },
  { value: "cancelled", labelAr: "ملغي", label: "Cancelled" },
];

const filterStatusMap: Record<FilterValue, BookingStatus[]> = {
  all: [],
  pending: ["pending_payment", "partially_paid"],
  confirmed: ["confirmed", "fully_paid", "checked_in", "in_transit"],
  completed: ["completed"],
  cancelled: ["cancelled", "refunded"],
};

export default function BookingsPage() {
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Real-time bookings listener
  useEffect(() => {
    if (!firebaseUser || !userData?.campaignId) return;
    const unsub = onCollectionChange<Booking>(
      COLLECTIONS.BOOKINGS,
      [where("campaignId", "==", userData.campaignId)],
      (data) => {
        // Sort by creation date descending
        data.sort((a, b) => {
          const da = parseTimestamp(a.createdAt)?.getTime() ?? 0;
          const db = parseTimestamp(b.createdAt)?.getTime() ?? 0;
          return db - da;
        });
        setBookings(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [firebaseUser, userData?.campaignId]);

  // Filtered + searched bookings
  const filtered = useMemo(() => {
    let list = bookings;

    // Status filter
    if (filter !== "all") {
      const statuses = filterStatusMap[filter];
      list = list.filter((b) => statuses.includes(b.status));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.travelerName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.tripTitle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [bookings, filter, search]);

  // Counts per filter
  const counts = useMemo(() => {
    const m: Record<FilterValue, number> = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const b of bookings) {
      for (const [key, statuses] of Object.entries(filterStatusMap)) {
        if (key !== "all" && statuses.includes(b.status)) {
          m[key as FilterValue]++;
        }
      }
    }
    return m;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <AppBar
        title={t("الحجوزات", "Bookings")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الحجوزات", "Bookings") }]}
      />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Search */}
        <SearchInput
          placeholder={t("ابحث برقم الحجز أو اسم المسافر...", "Search by booking ID or traveler name...")}
          onSearch={setSearch}
        />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filterChips.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "eo-filter-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-body-sm font-medium transition-all",
                filter === f.value && "eo-filter-chip-active"
              )}
            >
              {language === "ar" ? f.labelAr : f.label}
              <Badge variant={filter === f.value ? "default" : "gold"} size="sm">
                {counts[f.value]}
              </Badge>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <Card variant="elevated" padding="none">
            <EmptyState
              icon={<BookOpen className="h-16 w-16" />}
              title={t("لا توجد حجوزات", "No Bookings")}
              description={
                search.trim() || filter !== "all"
                  ? t("لا توجد نتائج مطابقة للبحث أو الفلتر", "No results match your search or filter")
                  : t("ستظهر هنا الحجوزات عند قيام المسافرين بالحجز", "New traveler bookings will appear here")
              }
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((booking) => {
              const date = parseTimestamp(booking.createdAt);
              const badge = statusConfig[booking.status];
              const isExpanded = expandedId === booking.id;

              return (
                <Card key={booking.id} variant="elevated" padding="none" className="overflow-hidden">
                  {/* Booking row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="w-full text-start p-3 sm:p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1E293B]">
                        <BookOpen className="h-5 w-5 text-slate-500 dark:text-slate-300/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-body-sm font-bold text-slate-900 dark:text-white truncate">
                            {booking.travelerName}
                          </h3>
                          <Badge variant={badge.variant} size="sm" dot>
                            {language === "ar" ? badge.labelAr : badge.label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400/45 truncate mt-0.5">
                          {booking.tripTitle}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 dark:text-slate-400/45">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {booking.numberOfPassengers} {t("مسافر", "pax")}
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-200" dir="ltr">
                            {formatKWD(booking.totalKWD)}
                          </span>
                          {date && (
                            <span className="hidden sm:inline">
                              {formatRelativeTime(date, language === "ar" ? "ar-KW" : "en-US")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-surface-border/70 bg-slate-50/40 px-4 py-3 space-y-3 dark:border-surface-dark-border/70 dark:bg-white/[0.02]">
                      {/* Booking ID */}
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-slate-500 dark:text-slate-300/60">{t("رقم الحجز", "Booking ID")}</span>
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-200" dir="ltr">{booking.id}</span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-slate-500 dark:text-slate-300/60 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {t("رقم التواصل", "Phone")}
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-200" dir="ltr">{booking.travelerPhone}</span>
                      </div>

                      {/* Payment breakdown */}
                      <div className="rounded-lg border border-slate-100 bg-white p-3 dark:border-[#2D3B4F] dark:bg-[#1E293B]/50 space-y-2">
                        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-200 flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" />
                          {t("تفاصيل الدفع", "Payment Details")}
                        </h4>
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-slate-500 dark:text-slate-300/60">{t("الإجمالي", "Total")}</span>
                          <span className="font-semibold text-slate-900 dark:text-white" dir="ltr">{formatKWD(booking.totalKWD)}</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-slate-500 dark:text-slate-300/60">{t("المدفوع", "Paid")}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400" dir="ltr">{formatKWD(booking.paidKWD)}</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-slate-500 dark:text-slate-300/60">{t("المتبقي", "Remaining")}</span>
                          <span className={cn(
                            "font-semibold",
                            booking.remainingKWD > 0 ? "text-orange-600 dark:text-orange-400" : "text-slate-400"
                          )} dir="ltr">
                            {formatKWD(booking.remainingKWD)}
                          </span>
                        </div>
                        {booking.discountKWD > 0 && (
                          <div className="flex items-center justify-between text-body-sm">
                            <span className="text-slate-500 dark:text-slate-300/60">{t("الخصم", "Discount")}</span>
                            <span className="font-semibold text-sky-600 dark:text-sky-400" dir="ltr">-{formatKWD(booking.discountKWD)}</span>
                          </div>
                        )}
                      </div>

                      {/* Special requests */}
                      {booking.specialRequests && (
                        <div className="rounded-lg border border-slate-100 bg-white p-3 dark:border-[#2D3B4F] dark:bg-[#1E293B]/50">
                          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-200 mb-1">
                            {t("طلبات خاصة", "Special Requests")}
                          </h4>
                          <p className="text-body-sm text-slate-700 dark:text-slate-200">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Internal notes */}
                      {booking.internalNotes && (
                        <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 dark:border-orange-900/30 dark:bg-orange-900/10">
                          <h4 className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-1">
                            {t("ملاحظات داخلية", "Internal Notes")}
                          </h4>
                          <p className="text-body-sm text-orange-800 dark:text-orange-300">{booking.internalNotes}</p>
                        </div>
                      )}

                      {/* Created date */}
                      {date && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>{t("تاريخ الحجز", "Booked on")}</span>
                          <span>{date.toLocaleDateString(language === "ar" ? "ar-KW" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
