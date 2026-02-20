"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { where } from "firebase/firestore";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { formatKWD } from "@/lib/utils/format";
import type { Campaign, Trip } from "@/types";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Users,
  Star,
  ChevronLeft,
  Building2,
} from "lucide-react";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t, language } = useDirection();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignData, tripsData] = await Promise.all([
          getDocument<Campaign>(COLLECTIONS.CAMPAIGNS, id),
          getDocuments<Trip>(COLLECTIONS.TRIPS, [
            where("campaignId", "==", id),
          ]),
        ]);
        setCampaign(campaignData);
        setTrips(tripsData.filter((trip) => trip.status !== "draft"));
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const getName = (c: Campaign) =>
    language === "ar" ? c.nameAr || c.name : c.name || c.nameAr;

  const getDescription = (c: Campaign) =>
    language === "ar"
      ? c.descriptionAr || c.description
      : c.description || c.descriptionAr;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("جاري التحميل...", "Loading...")} />
        <Container className="space-y-4 py-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Container>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("الحملة", "Campaign")} />
        <Container className="py-6">
          <EmptyState
            icon={<MapPin className="h-16 w-16" />}
            title={t("الحملة غير موجودة", "Campaign not found")}
            description={t(
              "لم يتم العثور على هذه الحملة",
              "This campaign could not be found"
            )}
            action={{
              label: t("العودة للاكتشاف", "Back to Discover"),
              onClick: () => router.push("/app/discover"),
            }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      <AppBar
        title={getName(campaign)}
        breadcrumbs={[
          { label: t("اكتشف", "Discover"), href: "/app/discover" },
          { label: getName(campaign) },
        ]}
      />

      <Container className="space-y-6 py-6">
        {/* Campaign Info */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            {campaign.logoUrl ? (
              <Image
                src={campaign.logoUrl}
                alt={getName(campaign)}
                width={64}
                height={64}
                className="h-16 w-16 rounded-[var(--radius-lg)] object-cover shadow-md"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <Building2 className="h-8 w-8 text-gray-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-heading-lg font-bold text-gray-900 dark:text-white">
                  {getName(campaign)}
                </h2>
                {campaign.verificationStatus === "approved" && (
                  <Badge variant="gold" size="sm">
                    {t("موثقة", "Verified")}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-body-md leading-relaxed text-gray-600 dark:text-indigo-300/60">
                {getDescription(campaign)}
              </p>
              {campaign.stats && (
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-body-sm text-gray-500">
                    <Star className="h-4 w-4 text-orange-500" />
                    {campaign.stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-body-sm text-gray-500">
                    {campaign.stats.totalTrips} {t("رحلة", "trips")}
                  </span>
                  <span className="text-body-sm text-gray-500">
                    {campaign.stats.totalReviews} {t("تقييم", "reviews")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        {(campaign.contactPhone ||
          campaign.contactEmail ||
          campaign.website) && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-3 text-heading-sm font-bold text-gray-900 dark:text-white">
              {t("معلومات التواصل", "Contact Information")}
            </h3>
            <div className="space-y-2.5">
              {campaign.contactPhone && (
                <div className="flex items-center gap-2.5 text-body-md text-gray-600 dark:text-indigo-300/60">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100/70 dark:bg-indigo-800/70">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <span dir="ltr">{campaign.contactPhone}</span>
                </div>
              )}
              {campaign.contactEmail && (
                <div className="flex items-center gap-2.5 text-body-md text-gray-600 dark:text-indigo-300/60">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100/70 dark:bg-indigo-800/70">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="truncate">{campaign.contactEmail}</span>
                </div>
              )}
              {campaign.website && (
                <div className="flex items-center gap-2.5 text-body-md text-gray-600 dark:text-indigo-300/60">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100/70 dark:bg-indigo-800/70">
                    <Globe className="h-4 w-4 text-gray-500" />
                  </div>
                  <a
                    href={campaign.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-gray-700 underline dark:text-indigo-100"
                  >
                    {campaign.website}
                  </a>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Trips */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            <h3 className="text-heading-md font-bold text-gray-900 dark:text-white">
              {t("الرحلات المتاحة", "Available Trips")}
            </h3>
            {trips.length > 0 && (
              <span className="rounded-full bg-gray-100/80 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-indigo-800/80 dark:text-indigo-300/60">
                {trips.length}
              </span>
            )}
          </div>
          {trips.length > 0 ? (
            <div className="space-y-3">
              {trips.map((trip, i) => {
                const tripTitle =
                  language === "ar"
                    ? trip.titleAr || trip.title
                    : trip.title || trip.titleAr;

                return (
                  <div
                    key={trip.id}
                    className="animate-stagger-fade-up"
                    style={
                      {
                        "--stagger-delay": `${i * 60}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <Card
                      variant="elevated"
                      padding="md"
                      hoverable
                      onClick={() =>
                        router.push(`/app/campaigns/${id}/trips/${trip.id}`)
                      }
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 sm:h-14 sm:w-14">
                          <Calendar className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-body-md font-semibold text-gray-900 dark:text-white sm:text-body-lg">
                            {tripTitle}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-body-sm text-gray-500 sm:gap-3">
                            {trip.destinations?.[0] && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {trip.destinations[0].city}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {trip.remainingCapacity}{" "}
                              {t("متبقي", "remaining")}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-end">
                          <p className="font-numbers text-body-md font-bold text-gray-900 dark:text-white">
                            {formatKWD(trip.basePriceKWD)}
                          </p>
                          <ChevronLeft className="ms-auto mt-1 h-4 w-4 text-gray-400 rtl:rotate-180" />
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title={t(
                "لا توجد رحلات متاحة",
                "No available trips"
              )}
              description={t(
                "لا توجد رحلات نشطة لهذه الحملة حاليًا",
                "No active trips for this campaign at this time"
              )}
            />
          )}
        </section>
      </Container>
    </div>
  );
}
