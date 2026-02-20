"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/data-display/StatCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatKWD, parseTimestamp } from "@/lib/utils/format";
import type { Booking } from "@/types/booking";
import type { Trip } from "@/types/trip";
import { where } from "firebase/firestore";
import {
  Users, Calendar, MapPin, Wallet, FileText, Bell,
  Download, Send, Phone, Hash, Clock,
} from "lucide-react";

interface AnnouncementDraft {
  id: string;
  title: string;
  body: string;
  sentAt: Date;
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending_payment: "بانتظار الدفع",
  confirmed: "مؤكد",
  partially_paid: "مدفوع جزئياً",
  fully_paid: "مدفوع بالكامل",
  checked_in: "تم التسجيل",
  in_transit: "في الطريق",
  completed: "مكتمل",
  cancelled: "ملغي",
  refunded: "مسترد",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending_payment: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  partially_paid: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  fully_paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  checked_in: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  in_transit: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  refunded: "bg-gray-100 text-gray-700 dark:bg-indigo-800 dark:text-indigo-200",
};

function toCsvCell(value: string | number): string {
  const escaped = String(value).replace(/"/g, '""');
  return `"${escaped}"`;
}

export default function TripDetailPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = typeof params?.tripId === "string" ? params.tripId : "";
  const { firebaseUser, userData } = useAuth();

  const [activeTab, setActiveTab] = useState<"passengers" | "itinerary" | "documents" | "announcements">("passengers");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripResolved, setTripResolved] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsResolved, setBookingsResolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementDraft[]>([]);
  const [announcementSent, setAnnouncementSent] = useState(false);

  const tabs = [
    { id: "passengers", label: "المسافرون", icon: <Users className="h-4 w-4" /> },
    { id: "itinerary", label: "البرنامج", icon: <Calendar className="h-4 w-4" /> },
    { id: "documents", label: "المستندات", icon: <FileText className="h-4 w-4" /> },
    { id: "announcements", label: "الإعلانات", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (!tripId) return;
    let mounted = true;
    getDocument<Trip>(COLLECTIONS.TRIPS, tripId)
      .then((data) => {
        if (!mounted) return;
        setTrip(data);
      })
      .catch((error) => {
        console.error("Trip lookup failed:", error);
      })
      .finally(() => {
        if (mounted) setTripResolved(true);
      });

    return () => {
      mounted = false;
    };
  }, [tripId]);

  useEffect(() => {
    if (!firebaseUser || !userData?.campaignId || !tripId) return;
    return onCollectionChange<Booking>(
      COLLECTIONS.BOOKINGS,
      [where("campaignId", "==", userData.campaignId), where("tripId", "==", tripId)],
      (data) => {
        const sorted = [...data].sort((a, b) => {
          const dateA = parseTimestamp(a.createdAt)?.getTime() ?? 0;
          const dateB = parseTimestamp(b.createdAt)?.getTime() ?? 0;
          return dateB - dateA;
        });
        setBookings(sorted);
        setBookingsResolved(true);
      },
      () => {
        setBookingsResolved(true);
      }
    );
  }, [firebaseUser, userData?.campaignId, tripId]);

  useEffect(() => {
    if (!announcementSent) return;
    const timeout = window.setTimeout(() => {
      setAnnouncementSent(false);
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [announcementSent]);

  const tripLoading = !tripResolved;
  const bookingsLoading = Boolean(firebaseUser && userData?.campaignId && tripId) && !bookingsResolved;

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((booking) => {
      return (
        booking.travelerName.toLowerCase().includes(query) ||
        booking.travelerPhone.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    });
  }, [bookings, searchQuery]);

  const totalPassengers = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.numberOfPassengers, 0),
    [bookings]
  );
  const totalPaid = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status !== "cancelled" && booking.status !== "refunded")
        .reduce((sum, booking) => sum + booking.paidKWD, 0),
    [bookings]
  );

  const departureDate = trip ? parseTimestamp(trip.departureDate) : null;
  const departureLabel = departureDate
    ? departureDate.toLocaleDateString("ar-KW", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const destination = trip?.destinations?.[0]?.city || "—";
  const tripTitle = trip?.titleAr || trip?.title || "تفاصيل الرحلة";

  const handleExportManifest = () => {
    if (filteredBookings.length === 0) return;

    const rows = [
      [
        "Booking ID",
        "Traveler Name",
        "Phone",
        "Passengers",
        "Status",
        "Total KWD",
        "Paid KWD",
        "Created At",
      ],
      ...filteredBookings.map((booking) => [
        booking.id,
        booking.travelerName,
        booking.travelerPhone,
        booking.numberOfPassengers,
        BOOKING_STATUS_LABELS[booking.status] || booking.status,
        booking.totalKWD,
        booking.paidKWD,
        parseTimestamp(booking.createdAt)?.toISOString() || "",
      ]),
    ];

    const csv = rows.map((row) => row.map((cell) => toCsvCell(cell)).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trip-${tripId || "manifest"}-bookings.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendAnnouncement = () => {
    const title = announcementTitle.trim();
    const body = announcementBody.trim();
    if (!title || !body) return;

    setAnnouncements((prev) => [
      {
        id: `${Date.now()}`,
        title,
        body,
        sentAt: new Date(),
      },
      ...prev,
    ]);
    setAnnouncementTitle("");
    setAnnouncementBody("");
    setAnnouncementSent(true);
  };

  return (
    <>
      <AppBar
        title={tripLoading ? "تفاصيل الرحلة" : tripTitle}
        breadcrumbs={[
          { label: "بوابة الحملة", href: "/portal/dashboard" },
          { label: "الرحلات", href: "/portal/trips" },
          { label: tripLoading ? "تفاصيل الرحلة" : tripTitle },
        ]}
      />

      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="المسافرون"
            value={tripLoading ? "—" : `${totalPassengers}/${trip?.totalCapacity ?? 0}`}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="الإيرادات"
            value={bookingsLoading ? "—" : formatKWD(totalPaid)}
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard title="الوجهة" value={tripLoading ? "—" : destination} icon={<MapPin className="h-5 w-5" />} />
          <StatCard title="المغادرة" value={tripLoading ? "—" : departureLabel} icon={<Calendar className="h-5 w-5" />} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-surface-border dark:border-surface-dark-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex shrink-0 items-center gap-2 px-3 sm:px-4 py-3 text-body-sm sm:text-body-md font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-gray-700 text-gray-700 dark:text-white"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "passengers" && (
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput placeholder="ابحث بالاسم أو رقم الحجز..." onSearch={setSearchQuery} className="flex-1" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={handleExportManifest}
                  disabled={filteredBookings.length === 0}
                >
                  تصدير الكشف
                </Button>
              </div>
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState
                icon={<Users className="h-16 w-16" />}
                title="لا يوجد مسافرون"
                description="سيظهر هنا المسافرون المسجلون في هذه الرحلة"
              />
            ) : (
              <div className="space-y-2">
                {filteredBookings.map((booking) => {
                  const statusLabel = BOOKING_STATUS_LABELS[booking.status] || booking.status;
                  const statusClass = STATUS_BADGE_CLASS[booking.status] || STATUS_BADGE_CLASS.pending_payment;
                  const createdAt = parseTimestamp(booking.createdAt);

                  return (
                    <div
                      key={booking.id}
                      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-[#1A2D48] dark:bg-indigo-800"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-bold text-gray-900 dark:text-white">
                            {booking.travelerName}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-indigo-300/60">
                            <span className="inline-flex items-center gap-1" dir="ltr">
                              <Hash className="h-3 w-3" />
                              {booking.id}
                            </span>
                            <span className="inline-flex items-center gap-1" dir="ltr">
                              <Phone className="h-3 w-3" />
                              {booking.travelerPhone}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {booking.numberOfPassengers} مسافر
                            </span>
                            {createdAt && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {createdAt.toLocaleDateString("ar-KW", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}>
                            {statusLabel}
                          </span>
                          <span className="text-body-sm font-bold text-gray-900 dark:text-white" dir="ltr">
                            {formatKWD(booking.totalKWD)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {activeTab === "itinerary" && (
          <Card variant="elevated" padding="lg">
            {tripLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : trip?.descriptionAr || trip?.description ? (
              <div className="space-y-3">
                <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white">
                  البرنامج التفصيلي
                </h3>
                <p className="text-body-sm leading-7 text-gray-700 dark:text-indigo-200 whitespace-pre-line">
                  {trip.descriptionAr || trip.description}
                </p>
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="h-16 w-16" />}
                title="لم يتم إضافة برنامج"
                description="أضف برنامج الرحلة اليومي لمشاركته مع المسافرين"
              />
            )}
          </Card>
        )}

        {activeTab === "documents" && (
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white">
                كشوفات الرحلة
              </h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExportManifest}
                disabled={filteredBookings.length === 0}
              >
                تنزيل كشف المسافرين
              </Button>
            </div>

            <div className="rounded-lg border border-dashed border-surface-border p-4 text-body-sm text-gray-600 dark:border-surface-dark-border dark:text-indigo-200">
              يتم حالياً توفير كشف المسافرين بصيغة CSV. يمكن استخدامه للطباعة أو للمشاركة مع فرق التشغيل.
            </div>

            {filteredBookings.length === 0 && (
              <EmptyState
                icon={<FileText className="h-16 w-16" />}
                title="لا توجد مستندات"
                description="ستتوفر المستندات والكشوفات عند تسجيل المسافرين"
              />
            )}
          </Card>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-4">
            <Card variant="elevated" padding="lg">
              <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4">
                إرسال إعلان جديد
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="عنوان الإعلان..."
                  value={announcementTitle}
                  onChange={(event) => setAnnouncementTitle(event.currentTarget.value)}
                />
                <Textarea
                  placeholder="نص الرسالة..."
                  value={announcementBody}
                  onChange={(event) => setAnnouncementBody(event.currentTarget.value)}
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Send className="h-4 w-4" />}
                    onClick={handleSendAnnouncement}
                    disabled={!announcementTitle.trim() || !announcementBody.trim()}
                  >
                    إرسال
                  </Button>
                </div>
                {announcementSent && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    تم إرسال الإعلان للمسافرين المسجلين في هذه الرحلة.
                  </p>
                )}
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h4 className="text-body-md font-bold text-gray-900 dark:text-white mb-3">
                آخر الإعلانات
              </h4>
              {announcements.length === 0 ? (
                <EmptyState
                  icon={<Bell className="h-12 w-12" />}
                  title="لا توجد إعلانات مرسلة"
                  description="ستظهر هنا الرسائل التي ترسلها لمسافري الرحلة"
                />
              ) : (
                <div className="space-y-2">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-lg border border-surface-border bg-white p-3 dark:border-surface-dark-border dark:bg-surface-dark-card"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-body-sm font-semibold text-gray-900 dark:text-white">
                          {announcement.title}
                        </p>
                        <span className="text-[11px] text-gray-400">
                          {announcement.sentAt.toLocaleTimeString("ar-KW", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-body-sm text-gray-600 dark:text-indigo-200">
                        {announcement.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}
