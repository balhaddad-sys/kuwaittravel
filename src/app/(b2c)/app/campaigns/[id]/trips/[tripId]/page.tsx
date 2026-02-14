"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
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
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

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
            <img
              src={trip.coverImageUrl}
              alt={trip.titleAr || trip.title}
              className="w-full h-48 object-cover rounded-[var(--radius-lg)] mb-4"
            />
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

        {/* Book Now Button */}
        <div className="sticky bottom-20 z-10">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="shadow-lg"
          >
            احجز الآن - {trip.basePriceKWD} د.ك
          </Button>
        </div>
      </Container>
    </div>
  );
}
