"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGallery } from "@/components/shared/ImageGallery";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { SocialProofBadge } from "@/components/shared/SocialProofBadge";
import { ItineraryTimeline } from "@/components/shared/ItineraryTimeline";
import { useToast } from "@/components/feedback/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { useWishlist } from "@/hooks/useWishlist";
import { createDocument, getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS, SUB_COLLECTIONS } from "@/lib/firebase/collections";
import { formatKWD } from "@/lib/utils/format";
import { isBookableTrip } from "@/lib/utils/trip";
import type { Trip, ItineraryBlock, PricingTier } from "@/types";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Plane,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Tag,
  Building2,
} from "lucide-react";

const statusLabels: Record<
  string,
  { ar: string; en: string; variant: "success" | "warning" | "error" | "info" | "default" }
> = {
  published: { ar: "منشورة", en: "Published", variant: "info" },
  registration_open: { ar: "التسجيل مفتوح", en: "Registration Open", variant: "success" },
  registration_closed: { ar: "التسجيل مغلق", en: "Registration Closed", variant: "warning" },
  in_progress: { ar: "جارية", en: "In Progress", variant: "info" },
  completed: { ar: "مكتملة", en: "Completed", variant: "default" },
  cancelled: { ar: "ملغاة", en: "Cancelled", variant: "error" },
};

function formatTripDate(timestamp: { seconds: number } | undefined, language: string): string {
  if (!timestamp) return language === "ar" ? "غير محدد" : "Not set";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString(language === "ar" ? "ar-KW" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateDuration(departure: { seconds: number } | undefined, returnDate: { seconds: number } | undefined): number | null {
  if (!departure || !returnDate) return null;
  const diff = returnDate.seconds - departure.seconds;
  return Math.ceil(diff / 86400);
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
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itineraryBlocks, setItineraryBlocks] = useState<ItineraryBlock[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const [tripData, itinerary, tiers] = await Promise.all([
          getDocument<Trip>(COLLECTIONS.TRIPS, tripId),
          getDocuments<ItineraryBlock>(
            `${COLLECTIONS.TRIPS}/${tripId}/${SUB_COLLECTIONS.TRIP_ITINERARY}`,
            []
          ),
          getDocuments<PricingTier>(
            `${COLLECTIONS.TRIPS}/${tripId}/${SUB_COLLECTIONS.TRIP_PRICING}`,
            []
          ),
        ]);
        setTrip(tripData);
        setItineraryBlocks(itinerary);
        setPricingTiers(tiers);
        if (tiers.length > 0) setSelectedTier(tiers[0].id);
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
        <Skeleton className="h-64 w-full" />
        <Container className="space-y-4 py-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <Container className="py-16">
          <EmptyState
            icon={<Plane className="h-16 w-16" />}
            title={t("الرحلة غير موجودة", "Trip not found")}
            description={t("لم يتم العثور على هذه الرحلة", "This trip could not be found")}
            action={{
              label: t("العودة للحملة", "Back to Campaign"),
              onClick: () => router.push(`/app/campaigns/${id}`),
            }}
          />
        </Container>
      </div>
    );
  }

  const tripTitle = language === "ar" ? trip.titleAr || trip.title : trip.title || trip.titleAr;
  const tripDescription = language === "ar"
    ? trip.descriptionAr || trip.description
    : trip.description || trip.descriptionAr;
  const statusInfo = statusLabels[trip.status] || statusLabels.published;
  const remainingCapacity = Math.max(trip.remainingCapacity || 0, 0);
  const canBook = isBookableTrip(trip.status) && remainingCapacity > 0;
  const activeTier = pricingTiers.find((t) => t.id === selectedTier);
  const basePrice = activeTier ? activeTier.priceKWD : trip.basePriceKWD;
  const bookingAmount = basePrice * passengerCount;
  const fillPercent = trip.totalCapacity > 0
    ? ((trip.totalCapacity - remainingCapacity) / trip.totalCapacity) * 100
    : 0;
  const duration = calculateDuration(
    trip.departureDate as unknown as { seconds: number },
    trip.returnDate as unknown as { seconds: number }
  );
  const galleryImages = trip.galleryUrls?.length > 0 ? trip.galleryUrls : trip.coverImageUrl ? [trip.coverImageUrl] : [];
  const tripTypeLabel = t(
    { hajj: "حج", umrah: "عمرة", ziyarat: "زيارة", combined: "مشترك" }[trip.type] || trip.type,
    trip.type.charAt(0).toUpperCase() + trip.type.slice(1)
  );
  const destinationLabel = trip.destinations?.[0]?.city || trip.departureCity || t("غير محدد", "Not set");
  const registrationDeadlineLabel = formatTripDate(
    trip.registrationDeadline as unknown as { seconds: number },
    language
  );
  const departureDateLabel = formatTripDate(
    trip.departureDate as unknown as { seconds: number },
    language
  );
  const returnDateLabel = formatTripDate(
    trip.returnDate as unknown as { seconds: number },
    language
  );
  const selectedTierName = activeTier
    ? language === "ar"
      ? activeTier.nameAr || activeTier.name
      : activeTier.name || activeTier.nameAr
    : t("الباقة الأساسية", "Base Package");
  const guidanceItems = [
    {
      key: "booking_window",
      icon: <Calendar className="h-4 w-4 text-info" />,
      title: t("نافذة الحجز", "Booking Window"),
      description: canBook
        ? t(
            `التسجيل متاح حتى ${registrationDeadlineLabel}. الحجز المبكر يساعدك على تثبيت السعر الحالي وتفادي نفاد المقاعد.`,
            `Registration is open until ${registrationDeadlineLabel}. Booking early helps lock the current price and avoid sellout.`
          )
        : t(
            "التسجيل مغلق حالياً لهذه الرحلة. يمكنك حفظها في المفضلة ومتابعة أي تحديثات من الحملة.",
            "Registration is currently closed for this trip. Save it to your wishlist and monitor campaign updates."
          ),
    },
    {
      key: "route",
      icon: <MapPin className="h-4 w-4 text-gold-600" />,
      title: t("مسار الرحلة", "Route Snapshot"),
      description: t(
        `المغادرة من ${trip.departureCity || "الكويت"} إلى ${destinationLabel} بتاريخ ${departureDateLabel}، والعودة ${returnDateLabel}.`,
        `Departure from ${trip.departureCity || "Kuwait"} to ${destinationLabel} on ${departureDateLabel}, returning on ${returnDateLabel}.`
      ),
    },
    {
      key: "capacity",
      icon: <Users className="h-4 w-4 text-success" />,
      title: t("توفر المقاعد", "Seat Availability"),
      description: remainingCapacity > 0
        ? t(
            `المتبقي ${remainingCapacity} من أصل ${trip.totalCapacity} مقاعد. إذا كنتم مجموعة، أكمِلوا الحجز معاً لتأمين المقاعد المتجاورة.`,
            `${remainingCapacity} of ${trip.totalCapacity} seats remain. If you're booking as a group, complete together to secure adjacent seats.`
          )
        : t(
            "لا توجد مقاعد متبقية حالياً. يمكنك متابعة الحملة في حال فتح مقاعد إضافية.",
            "No seats are currently available. Follow the campaign in case additional seats are released."
          ),
    },
    {
      key: "pricing",
      icon: <DollarSign className="h-4 w-4 text-navy-500" />,
      title: t("الميزانية والدفع", "Budget & Payment"),
      description: t(
        `السعر الحالي ${formatKWD(basePrice)} لكل مسافر ضمن "${selectedTierName}". راجع الإجمالي النهائي قبل التأكيد خاصة عند إضافة أكثر من مسافر.`,
        `Current price is ${formatKWD(basePrice)} per traveler under "${selectedTierName}". Review the final total carefully before confirming, especially for multiple passengers.`
      ),
    },
  ];
  const prepChecklist = [
    t(
      "تأكد من مطابقة الأسماء مع الوثائق الرسمية قبل الدفع.",
      "Ensure traveler names exactly match official documents before payment."
    ),
    t(
      "احتفظ بنسخة رقمية من الهوية/الجواز وسهولة الوصول لها أثناء السفر.",
      "Keep a digital copy of ID/passport easily accessible during travel."
    ),
    t(
      "راجع تفاصيل الباقة والخدمات المشمولة لتجنب أي التباس ميداني.",
      "Review package inclusions in advance to avoid on-ground misunderstandings."
    ),
    trip.type === "hajj" || trip.type === "umrah" || trip.type === "ziyarat"
      ? t(
          "حضّر مستلزمات الزيارة المناسبة للمشي الطويل والمواقيت المختلفة.",
          "Prepare suitable essentials for long walks and variable ziyarat timings."
        )
      : t(
          "جهّز خطة يومية مرنة لتوزيع الأنشطة والراحة خلال الرحلة.",
          "Prepare a flexible daily plan to balance activities and rest."
        ),
  ];

  const handleBookNow = async () => {
    if (!firebaseUser || !userData) {
      router.push("/login");
      return;
    }
    if (!canBook) {
      toast({ type: "warning", title: t("الحجز غير متاح حالياً", "Booking not available") });
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
        ...(activeTier ? { pricingTierId: activeTier.id, pricingTierName: activeTier.name } : {}),
        paymentSchedule: trip.registrationDeadline
          ? [{ dueDate: trip.registrationDeadline, amountKWD: bookingAmount, status: "pending" as const }]
          : [],
        ...(specialRequests.trim().length > 0 ? { specialRequests: specialRequests.trim() } : {}),
      });
      toast({ type: "success", title: t("تم إنشاء الحجز بنجاح", "Booking created successfully") });
      router.push(`/app/my-trips/${bookingId}`);
    } catch {
      toast({ type: "error", title: t("تعذر إتمام الحجز حالياً", "Unable to complete booking") });
    } finally {
      setBookingLoading(false);
    }
  };

  const quickInfoItems = [
    {
      label: t("المغادرة", "Departure"),
      value: formatTripDate(trip.departureDate as unknown as { seconds: number }, language),
      icon: <Calendar className="h-4 w-4 text-success" />,
    },
    ...(duration ? [{
      label: t("المدة", "Duration"),
      value: t(`${duration} يوم`, `${duration} days`),
      icon: <Clock className="h-4 w-4 text-info" />,
    }] : []),
    {
      label: t("من", "From"),
      value: trip.departureCity || t("غير محدد", "Not set"),
      icon: <Plane className="h-4 w-4 text-navy-500" />,
    },
    {
      label: t("النوع", "Type"),
      value: tripTypeLabel,
      icon: <Tag className="h-4 w-4 text-gold-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted pb-24 dark:bg-surface-dark">
      {/* Full-Bleed Image Gallery */}
      <ImageGallery
        images={galleryImages}
        alt={tripTitle}
        aspectRatio="16/9"
        overlay={
          <>
            {/* Back button */}
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute start-3 top-3 z-10 flex items-center justify-center rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white dark:bg-navy-800/90"
            >
              <ArrowLeft className="h-5 w-5 text-navy-800 rtl:rotate-180 dark:text-white" />
            </button>
            {/* Wishlist */}
            <div className="absolute end-3 top-3 z-10">
              <WishlistButton
                saved={isWishlisted(trip.id)}
                onToggle={() => toggleWishlist(trip.id)}
                variant="overlay"
              />
            </div>
          </>
        }
      />

      <Container className="space-y-5 py-5 sm:space-y-6 sm:py-6">
        {/* Title + Status + Social Proof */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">
                {tripTitle}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-body-sm text-navy-500">
                <Building2 className="h-3.5 w-3.5" />
                <span>{trip.campaignName}</span>
              </div>
            </div>
            <Badge variant={statusInfo.variant}>
              {language === "ar" ? statusInfo.ar : statusInfo.en}
            </Badge>
          </div>
          <div className="mt-3">
            <SocialProofBadge
              bookedCount={trip.bookedCount || 0}
              remainingCapacity={remainingCapacity}
              totalCapacity={trip.totalCapacity}
            />
          </div>
        </div>

        {/* Quick Info Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {quickInfoItems.map((item) => (
            <div
              key={item.label}
              className="flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-surface-border bg-white px-3 py-2 dark:border-surface-dark-border dark:bg-surface-dark-card"
            >
              {item.icon}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-navy-400">{item.label}</p>
                <p className="text-body-sm font-medium text-navy-800 dark:text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price & Capacity */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm text-navy-500">{t("يبدأ من", "Starting from")}</p>
              <p className="font-numbers text-display-md font-bold text-navy-900 dark:text-white">
                {formatKWD(basePrice)}
              </p>
            </div>
            <div className="text-end">
              <p className="text-body-sm text-navy-500">{t("المقاعد المتبقية", "Seats remaining")}</p>
              <p className="font-numbers text-heading-md font-bold text-navy-900 dark:text-white">
                {remainingCapacity} / {trip.totalCapacity}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted dark:bg-surface-dark-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fillPercent >= 90 ? "bg-error" : fillPercent >= 70 ? "bg-warning" : "bg-success"
                }`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
          </div>
          {remainingCapacity <= 5 && remainingCapacity > 0 && (
            <p className="mt-2 text-body-sm font-medium text-error urgency-pulse">
              {t(`${remainingCapacity} مقاعد متبقية فقط!`, `Only ${remainingCapacity} seats left!`)}
            </p>
          )}
        </Card>

        {/* Description (expandable) */}
        {tripDescription && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-2 text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("عن الرحلة", "About This Trip")}
            </h3>
            <div className={descExpanded ? "" : "max-h-24 overflow-hidden"}>
              <p className="text-body-md leading-relaxed text-navy-600 dark:text-navy-300">
                {tripDescription}
              </p>
            </div>
            {tripDescription.length > 200 && (
              <button
                type="button"
                onClick={() => setDescExpanded(!descExpanded)}
                className="mt-2 flex items-center gap-1 text-body-sm font-medium text-gold-600 transition-colors hover:text-gold-700"
              >
                {descExpanded ? (
                  <>{t("عرض أقل", "Show less")} <ChevronUp className="h-3.5 w-3.5" /></>
                ) : (
                  <>{t("عرض المزيد", "Read more")} <ChevronDown className="h-3.5 w-3.5" /></>
                )}
              </button>
            )}
          </Card>
        )}

        {/* Itinerary Timeline */}
        {itineraryBlocks.length > 0 && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-4 text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("برنامج الرحلة", "Trip Itinerary")}
            </h3>
            <ItineraryTimeline blocks={itineraryBlocks} />
          </Card>
        )}

        {/* Smart Guide */}
        <Card variant="outlined" padding="md">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gold-100 dark:bg-gold-900/30">
              <ShieldCheck className="h-4 w-4 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">
                {t("دليل الرحلة الذكي", "Smart Trip Guide")}
              </h3>
              <p className="text-body-sm text-navy-500 dark:text-navy-400">
                {t(
                  "إرشادات عملية مبنية على حالة هذه الرحلة لمساعدتك قبل الدفع وأثناء الاستعداد.",
                  "Practical guidance based on this trip's live details to help before payment and while preparing."
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {guidanceItems.map((item) => (
              <div
                key={item.key}
                className="rounded-[var(--radius-md)] border border-surface-border bg-surface-muted p-3 dark:border-surface-dark-border dark:bg-surface-dark"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-white dark:bg-surface-dark-card">
                    {item.icon}
                  </span>
                  <p className="text-body-md font-semibold text-navy-900 dark:text-white">
                    {item.title}
                  </p>
                </div>
                <p className="text-body-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[var(--radius-md)] border border-gold-200/70 bg-gold-50/40 p-3 dark:border-gold-900/40 dark:bg-gold-900/10">
            <p className="mb-2 text-body-md font-semibold text-navy-900 dark:text-white">
              {t("قائمة تجهيز سريعة", "Quick Prep Checklist")}
            </p>
            <ul className="space-y-1.5">
              {prepChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body-sm text-navy-700 dark:text-navy-200">
                  <span className="mt-0.5 text-success">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
                    <MapPin className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">
                      {dest.city}
                      {dest.country ? `، ${dest.country}` : ""}
                    </p>
                    <p className="text-body-sm text-navy-500">
                      {formatTripDate(dest.arrivalDate as unknown as { seconds: number }, language)} -{" "}
                      {formatTripDate(dest.departureDate as unknown as { seconds: number }, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Pricing Tiers */}
        {pricingTiers.length > 1 && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-3 text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("باقات الأسعار", "Pricing Tiers")}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier) => {
                const tierName = language === "ar" ? (tier.nameAr || tier.name) : (tier.name || tier.nameAr);
                const isSelected = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`rounded-[var(--radius-md)] border p-4 text-start transition-all ${
                      isSelected
                        ? "border-gold-500 bg-gold-50 shadow-sm dark:border-gold-600 dark:bg-gold-900/20"
                        : "border-surface-border bg-white hover:border-navy-300 dark:border-surface-dark-border dark:bg-surface-dark-card dark:hover:border-navy-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-body-md font-bold text-navy-900 dark:text-white">{tierName}</p>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-white">
                          <ShieldCheck className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-numbers text-heading-sm font-bold text-gold-600 dark:text-gold-400">
                      {formatKWD(tier.priceKWD)}
                    </p>
                    {tier.description && (
                      <p className="mt-1 text-body-sm text-navy-500 dark:text-navy-400">{tier.description}</p>
                    )}
                    {tier.includes && tier.includes.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {tier.includes.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-body-sm text-navy-600 dark:text-navy-300">
                            <span className="text-success">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trip.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[var(--radius-chip)] border border-surface-border bg-white px-3 py-1.5 text-body-sm font-medium text-navy-600 dark:border-surface-dark-border dark:bg-surface-dark-card dark:text-navy-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Campaign Info */}
        <Card variant="outlined" padding="md" onClick={() => router.push(`/app/campaigns/${id}`)}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gold-100 dark:bg-gold-900/30">
              <Building2 className="h-5 w-5 text-gold-600 dark:text-gold-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-md font-bold text-navy-900 dark:text-white">{trip.campaignName}</p>
              <p className="text-body-sm text-gold-600 dark:text-gold-400">
                {t("عرض الحملة", "View Campaign")} →
              </p>
            </div>
          </div>
        </Card>

        {/* Booking Form (toggleable) */}
        {showBookingForm && (
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
                onChange={(event) => setPassengerCount(Math.max(1, Number(event.target.value) || 1))}
              />
              <Textarea
                label={t("طلبات خاصة (اختياري)", "Special Requests (optional)")}
                value={specialRequests}
                onChange={(event) => setSpecialRequests(event.target.value)}
                placeholder={t("مثال: غرفة قريبة من المصعد", "e.g. Room near the elevator")}
              />
              <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-muted p-3 dark:bg-surface-dark">
                <span className="text-body-md text-navy-600 dark:text-navy-300">
                  {t("إجمالي الحجز", "Booking Total")}
                </span>
                <span className="font-numbers text-heading-sm font-bold text-navy-900 dark:text-white">
                  {formatKWD(bookingAmount)}
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={bookingLoading}
                disabled={!canBook}
                onClick={handleBookNow}
              >
                {t("تأكيد الحجز", "Confirm Booking")} - {formatKWD(bookingAmount)}
              </Button>
            </div>
          </Card>
        )}
      </Container>

      {/* Sticky Booking Bar */}
      <div className="sticky-booking-bar px-4 py-3">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-body-sm text-navy-500">{t("يبدأ من", "From")}</p>
              <p className="font-numbers text-heading-md font-bold text-navy-900 dark:text-white">
                {formatKWD(basePrice)}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={!canBook}
              onClick={() => {
                if (showBookingForm) {
                  handleBookNow();
                } else {
                  setShowBookingForm(true);
                  setTimeout(() => {
                    document.querySelector(".travel-card-premium")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }
              }}
              loading={bookingLoading}
            >
              {showBookingForm
                ? `${t("تأكيد الحجز", "Confirm Booking")}`
                : `${t("احجز الآن", "Book Now")}`}
            </Button>
          </div>
          {!canBook && (
            <p className="mt-1 text-body-sm text-error">
              {t("الحجز متوقف حالياً لهذه الرحلة.", "Booking is currently unavailable for this trip.")}
            </p>
          )}
        </Container>
      </div>
    </div>
  );
}
