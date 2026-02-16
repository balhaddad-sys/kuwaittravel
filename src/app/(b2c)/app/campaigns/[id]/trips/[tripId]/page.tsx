"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/feedback/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { createDocument, getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatKWD } from "@/lib/utils/format";
import { isBookableTrip } from "@/lib/utils/trip";
import type { Trip } from "@/types";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Plane,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const statusLabels: Record<
  string,
  {
    ar: string;
    en: string;
    variant: "success" | "warning" | "error" | "info" | "default";
  }
> = {
  published: { ar: "منشورة", en: "Published", variant: "info" },
  registration_open: {
    ar: "التسجيل مفتوح",
    en: "Registration Open",
    variant: "success",
  },
  registration_closed: {
    ar: "التسجيل مغلق",
    en: "Registration Closed",
    variant: "warning",
  },
  in_progress: { ar: "جارية", en: "In Progress", variant: "info" },
  completed: { ar: "مكتملة", en: "Completed", variant: "default" },
  cancelled: { ar: "ملغاة", en: "Cancelled", variant: "error" },
};

function formatTripDate(
  timestamp: { seconds: number } | undefined,
  language: string
): string {
  if (!timestamp) return language === "ar" ? "غير محدد" : "Not set";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString(language === "ar" ? "ar-KW" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string; tripId: string }>;
}) {
  const { id, tripId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser, userData } = useAuth();
  const { t, language } = useDirection();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    async function fetchTrip() {
      try {
        const tripData = await getDocument<Trip>(COLLECTIONS.TRIPS, tripId);
        setTrip(tripData);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("جاري التحميل...", "Loading...")} />
        <Container className="space-y-4 py-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("الرحلة", "Trip")} />
        <Container className="py-6">
          <EmptyState
            icon={<Plane className="h-16 w-16" />}
            title={t("الرحلة غير موجودة", "Trip not found")}
            description={t(
              "لم يتم العثور على هذه الرحلة",
              "This trip could not be found"
            )}
            action={{
              label: t("العودة للحملة", "Back to Campaign"),
              onClick: () => router.push(`/app/campaigns/${id}`),
            }}
          />
        </Container>
      </div>
    );
  }

  const tripTitle =
    language === "ar" ? trip.titleAr || trip.title : trip.title || trip.titleAr;
  const tripDescription =
    language === "ar"
      ? trip.descriptionAr || trip.description
      : trip.description || trip.descriptionAr;
  const statusInfo = statusLabels[trip.status] || statusLabels.published;
  const remainingCapacity = Math.max(trip.remainingCapacity || 0, 0);
  const canBook = isBookableTrip(trip.status) && remainingCapacity > 0;
  const bookingAmount = trip.basePriceKWD * passengerCount;
  const fillPercent =
    trip.totalCapacity > 0
      ? ((trip.totalCapacity - remainingCapacity) / trip.totalCapacity) * 100
      : 0;

  const handleBookNow = async () => {
    if (!firebaseUser || !userData) {
      router.push("/login");
      return;
    }

    if (!canBook) {
      toast({
        type: "warning",
        title: t("الحجز غير متاح حالياً", "Booking not available"),
      });
      return;
    }

    if (passengerCount < 1 || passengerCount > remainingCapacity) {
      toast({
        type: "error",
        title: t("عدد المسافرين غير صالح", "Invalid passenger count"),
        description: t(
          `يمكنك حجز من 1 إلى ${remainingCapacity} مقاعد.`,
          `You can book 1 to ${remainingCapacity} seats.`
        ),
      });
      return;
    }

    setBookingLoading(true);

    try {
      const bookingId = await createDocument(COLLECTIONS.BOOKINGS, {
        travelerId: firebaseUser.uid,
        travelerName: userData.displayNameAr || userData.displayName,
        travelerPhone: userData.phone || firebaseUser.phoneNumber || "",
        campaignId: trip.campaignId,
        tripId: trip.id,
        tripTitle: trip.titleAr || trip.title,
        numberOfPassengers: passengerCount,
        subtotalKWD: bookingAmount,
        discountKWD: 0,
        totalKWD: bookingAmount,
        paidKWD: 0,
        remainingKWD: bookingAmount,
        status: "pending_payment" as const,
        paymentSchedule: trip.registrationDeadline
          ? [
              {
                dueDate: trip.registrationDeadline,
                amountKWD: bookingAmount,
                status: "pending" as const,
              },
            ]
          : [],
        ...(specialRequests.trim().length > 0
          ? { specialRequests: specialRequests.trim() }
          : {}),
      });

      toast({
        type: "success",
        title: t("تم إنشاء الحجز بنجاح", "Booking created successfully"),
      });

      router.push(`/app/my-trips/${bookingId}`);
    } catch {
      toast({
        type: "error",
        title: t("تعذر إتمام الحجز حالياً", "Unable to complete booking"),
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const dateItems = [
    {
      label: t("تاريخ المغادرة", "Departure Date"),
      value: formatTripDate(
        trip.departureDate as unknown as { seconds: number },
        language
      ),
      icon: <Calendar className="h-5 w-5 text-success" />,
      bg: "bg-success/10 dark:bg-success/15",
    },
    {
      label: t("تاريخ العودة", "Return Date"),
      value: formatTripDate(
        trip.returnDate as unknown as { seconds: number },
        language
      ),
      icon: <ArrowRight className="h-5 w-5 text-info" />,
      bg: "bg-info/10 dark:bg-info/15",
    },
    {
      label: t("آخر موعد للتسجيل", "Registration Deadline"),
      value: formatTripDate(
        trip.registrationDeadline as unknown as { seconds: number },
        language
      ),
      icon: <Clock className="h-5 w-5 text-warning" />,
      bg: "bg-warning/10 dark:bg-warning/15",
    },
    {
      label: t("مدينة المغادرة", "Departure City"),
      value: trip.departureCity || t("غير محدد", "Not set"),
      icon: <Plane className="h-5 w-5 text-navy-600 dark:text-navy-300" />,
      bg: "bg-navy-100 dark:bg-navy-800",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      <AppBar
        title={tripTitle}
        breadcrumbs={[
          { label: t("اكتشف", "Discover"), href: "/app/discover" },
          {
            label: trip.campaignName || t("الحملة", "Campaign"),
            href: `/app/campaigns/${id}`,
          },
          { label: tripTitle },
        ]}
      />

      <Container className="space-y-5 py-6 sm:space-y-6">
        {/* Trip Header */}
        <Card variant="elevated" padding="lg">
          {trip.coverImageUrl && (
            <div className="travel-hero-glass relative -mx-4 -mt-4 mb-4 h-44 overflow-hidden rounded-t-[var(--radius-card)] sm:-mx-6 sm:-mt-6 sm:mb-6 sm:h-56">
              <Image
                src={trip.coverImageUrl}
                alt={tripTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          )}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-heading-lg font-bold text-navy-900 dark:text-white">
                {tripTitle}
              </h2>
              <p className="mt-0.5 text-body-sm text-navy-500">
                {trip.campaignName}
              </p>
            </div>
            <Badge variant={statusInfo.variant}>
              {language === "ar" ? statusInfo.ar : statusInfo.en}
            </Badge>
          </div>
          {tripDescription && (
            <p className="mt-4 text-body-md leading-relaxed text-navy-600 dark:text-navy-300">
              {tripDescription}
            </p>
          )}
        </Card>

        {/* Dates */}
        <Card variant="outlined" padding="md">
          <h3 className="mb-3 text-heading-sm font-bold text-navy-900 dark:text-white">
            {t("التواريخ", "Dates")}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {dateItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${item.bg}`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm text-navy-500">{item.label}</p>
                  <p className="truncate text-body-md font-medium text-navy-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Destinations */}
        {trip.destinations && trip.destinations.length > 0 && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-3 text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("الوجهات", "Destinations")}
            </h3>
            <div className="space-y-2.5">
              {trip.destinations.map((dest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] bg-surface-muted p-3 dark:bg-surface-dark"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100/70 dark:bg-gold-900/30">
                    <MapPin className="h-4.5 w-4.5 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">
                      {dest.city}
                      {dest.country ? `، ${dest.country}` : ""}
                    </p>
                    <p className="text-body-sm text-navy-500">
                      {formatTripDate(
                        dest.arrivalDate as unknown as { seconds: number },
                        language
                      )}{" "}
                      -{" "}
                      {formatTripDate(
                        dest.departureDate as unknown as { seconds: number },
                        language
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Pricing & Capacity */}
        <Card variant="outlined" padding="md">
          <h3 className="mb-3 text-heading-sm font-bold text-navy-900 dark:text-white">
            {t("السعر والسعة", "Price & Capacity")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gold-100 dark:bg-gold-900/30">
                <DollarSign className="h-5 w-5 text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">
                  {t("يبدأ من", "Starting from")}
                </p>
                <p className="font-numbers text-heading-md font-bold text-navy-900 dark:text-white">
                  {formatKWD(trip.basePriceKWD)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-navy-100 dark:bg-navy-800">
                <Users className="h-5 w-5 text-navy-600 dark:text-navy-300" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">
                  {t("المقاعد المتبقية", "Seats remaining")}
                </p>
                <p className="font-numbers text-heading-md font-bold text-navy-900 dark:text-white">
                  {remainingCapacity} / {trip.totalCapacity}
                </p>
              </div>
            </div>
          </div>
          {/* Capacity bar */}
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted dark:bg-surface-dark-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fillPercent >= 90
                    ? "bg-error"
                    : fillPercent >= 70
                      ? "bg-warning"
                      : "bg-success"
                }`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Booking Form */}
        <Card variant="elevated" padding="md" className="travel-card-premium">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-500" />
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("بيانات الحجز", "Booking Details")}
            </h3>
          </div>
          <div className="space-y-3">
            <Input
              label={t("عدد المسافرين", "Number of Passengers")}
              type="number"
              min={1}
              max={Math.max(remainingCapacity, 1)}
              value={passengerCount}
              onChange={(event) =>
                setPassengerCount(
                  Math.max(1, Number(event.target.value) || 1)
                )
              }
            />
            <Textarea
              label={t(
                "طلبات خاصة (اختياري)",
                "Special Requests (optional)"
              )}
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              placeholder={t(
                "مثال: غرفة قريبة من المصعد",
                "e.g. Room near the elevator"
              )}
            />
            <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-muted p-3 dark:bg-surface-dark">
              <span className="text-body-md text-navy-600 dark:text-navy-300">
                {t("إجمالي الحجز", "Booking Total")}
              </span>
              <span className="font-numbers text-heading-sm font-bold text-navy-900 dark:text-white">
                {formatKWD(bookingAmount)}
              </span>
            </div>
            {!canBook && (
              <p className="text-body-sm text-error">
                {t(
                  "الحجز متوقف حالياً لهذه الرحلة.",
                  "Booking is currently unavailable for this trip."
                )}
              </p>
            )}
          </div>
        </Card>

        {/* Book Now Button */}
        <div className="sticky bottom-20 z-10">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="shadow-lg"
            loading={bookingLoading}
            disabled={!canBook}
            onClick={handleBookNow}
          >
            {t("احجز الآن", "Book Now")} - {formatKWD(bookingAmount)}
          </Button>
        </div>
      </Container>
    </div>
  );
}
