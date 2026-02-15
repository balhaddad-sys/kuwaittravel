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
} from "lucide-react";

const statusLabels: Record<string, { ar: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
  published: { ar: "منشورة", variant: "info" },
  registration_open: { ar: "التسجيل مفتوح", variant: "success" },
  registration_closed: { ar: "التسجيل مغلق", variant: "warning" },
  in_progress: { ar: "جارية", variant: "info" },
  completed: { ar: "مكتملة", variant: "default" },
  cancelled: { ar: "ملغاة", variant: "error" },
};

function formatDate(timestamp: { seconds: number } | undefined): string {
  if (!timestamp) return "غير محدد";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("ar-KW", {
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
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="جاري التحميل..." />
        <Container className="py-6 space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="الرحلة" />
        <EmptyState
          icon={<Plane className="h-16 w-16" />}
          title="الرحلة غير موجودة"
          description="لم يتم العثور على هذه الرحلة"
          action={{
            label: "العودة للحملة",
            onClick: () => router.push(`/app/campaigns/${id}`),
          }}
        />
      </div>
    );
  }

  const statusInfo = statusLabels[trip.status] || statusLabels.published;
  const remainingCapacity = Math.max(trip.remainingCapacity || 0, 0);
  const canBook = isBookableTrip(trip.status) && remainingCapacity > 0;
  const bookingAmount = trip.basePriceKWD * passengerCount;

  const handleBookNow = async () => {
    if (!firebaseUser || !userData) {
      router.push("/login");
      return;
    }

    if (!canBook) {
      toast({
        type: "warning",
        title: "الحجز غير متاح حالياً",
      });
      return;
    }

    if (passengerCount < 1 || passengerCount > remainingCapacity) {
      toast({
        type: "error",
        title: "عدد المسافرين غير صالح",
        description: `يمكنك حجز من 1 إلى ${remainingCapacity} مقاعد.`,
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
        title: "تم إنشاء الحجز بنجاح",
      });

      router.push(`/app/my-trips/${bookingId}`);
    } catch {
      toast({
        type: "error",
        title: "تعذر إتمام الحجز حالياً",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title={trip.titleAr || trip.title}
        breadcrumbs={[
          { label: "اكتشف", href: "/app/discover" },
          { label: trip.campaignName || "الحملة", href: `/app/campaigns/${id}` },
          { label: trip.titleAr || trip.title },
        ]}
      />

      <Container className="py-6 space-y-6">
        {/* Trip Header */}
        <Card variant="elevated" padding="lg">
          {trip.coverImageUrl && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-[var(--radius-lg)]">
              <Image
                src={trip.coverImageUrl}
                alt={trip.titleAr || trip.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-heading-lg font-bold text-navy-900 dark:text-white">
                {trip.titleAr || trip.title}
              </h2>
              <p className="text-body-sm text-navy-500 mt-1">{trip.campaignName}</p>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.ar}</Badge>
          </div>
          <p className="mt-4 text-body-md text-navy-600 dark:text-navy-300 leading-relaxed">
            {trip.descriptionAr || trip.description}
          </p>
        </Card>

        {/* Dates */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            التواريخ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-green-100 dark:bg-green-900/30">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">تاريخ المغادرة</p>
                <p className="text-body-md font-medium text-navy-900 dark:text-white">
                  {formatDate(trip.departureDate as unknown as { seconds: number })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-blue-100 dark:bg-blue-900/30">
                <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">تاريخ العودة</p>
                <p className="text-body-md font-medium text-navy-900 dark:text-white">
                  {formatDate(trip.returnDate as unknown as { seconds: number })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">آخر موعد للتسجيل</p>
                <p className="text-body-md font-medium text-navy-900 dark:text-white">
                  {formatDate(trip.registrationDeadline as unknown as { seconds: number })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy-100 dark:bg-navy-800">
                <Plane className="h-5 w-5 text-navy-600 dark:text-navy-300" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">مدينة المغادرة</p>
                <p className="text-body-md font-medium text-navy-900 dark:text-white">
                  {trip.departureCity}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Destinations */}
        {trip.destinations && trip.destinations.length > 0 && (
          <Card variant="outlined" padding="md">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
              الوجهات
            </h3>
            <div className="space-y-3">
              {trip.destinations.map((dest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-surface-muted dark:bg-surface-dark"
                >
                  <MapPin className="h-5 w-5 text-navy-500 shrink-0" />
                  <div>
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">
                      {dest.city}، {dest.country}
                    </p>
                    <p className="text-body-sm text-navy-500">
                      {formatDate(dest.arrivalDate as unknown as { seconds: number })} - {formatDate(dest.departureDate as unknown as { seconds: number })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Pricing & Capacity */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            السعر والسعة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gold-100 dark:bg-gold-900/30">
                <DollarSign className="h-5 w-5 text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">السعر يبدأ من</p>
                <p className="text-heading-md font-bold text-navy-900 dark:text-white">
                  {trip.basePriceKWD} د.ك
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy-100 dark:bg-navy-800">
                <Users className="h-5 w-5 text-navy-600 dark:text-navy-300" />
              </div>
              <div>
                <p className="text-body-sm text-navy-500">المقاعد المتبقية</p>
                <p className="text-heading-md font-bold text-navy-900 dark:text-white">
                  {trip.remainingCapacity} / {trip.totalCapacity}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Form */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            بيانات الحجز
          </h3>
          <div className="space-y-3">
            <Input
              label="عدد المسافرين"
              type="number"
              min={1}
              max={Math.max(remainingCapacity, 1)}
              value={passengerCount}
              onChange={(event) =>
                setPassengerCount(Math.max(1, Number(event.target.value) || 1))
              }
            />
            <Textarea
              label="طلبات خاصة (اختياري)"
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              placeholder="مثال: غرفة قريبة من المصعد"
            />
            <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-muted dark:bg-surface-dark p-3">
              <span className="text-body-md text-navy-600 dark:text-navy-300">
                إجمالي الحجز
              </span>
              <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
                {formatKWD(bookingAmount)}
              </span>
            </div>
            {!canBook && (
              <p className="text-body-sm text-error">
                الحجز متوقف حالياً لهذه الرحلة.
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
            احجز الآن - {formatKWD(bookingAmount)}
          </Button>
        </div>
      </Container>
    </div>
  );
}
