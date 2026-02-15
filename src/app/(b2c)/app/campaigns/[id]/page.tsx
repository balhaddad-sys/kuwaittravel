"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { where } from "firebase/firestore";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
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
} from "lucide-react";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="جاري التحميل..." />
        <Container className="py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Container>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="الحملة" />
        <EmptyState
          icon={<MapPin className="h-16 w-16" />}
          title="الحملة غير موجودة"
          description="لم يتم العثور على هذه الحملة"
          action={{
            label: "العودة للاكتشاف",
            onClick: () => router.push("/app/discover"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title={campaign.nameAr || campaign.name}
        breadcrumbs={[
          { label: "اكتشف", href: "/app/discover" },
          { label: campaign.nameAr || campaign.name },
        ]}
      />

      <Container className="py-6 space-y-6">
        {/* Campaign Info */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            {campaign.logoUrl ? (
              <img
                src={campaign.logoUrl}
                alt={campaign.nameAr || campaign.name}
                className="h-16 w-16 rounded-[var(--radius-lg)] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-navy-100 dark:bg-navy-800">
                <MapPin className="h-8 w-8 text-navy-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-heading-lg font-bold text-navy-900 dark:text-white">
                  {campaign.nameAr || campaign.name}
                </h2>
                {campaign.verificationStatus === "approved" && (
                  <Badge variant="gold" size="sm">موثقة</Badge>
                )}
              </div>
              <p className="mt-2 text-body-md text-navy-600 dark:text-navy-300">
                {campaign.descriptionAr || campaign.description}
              </p>
              {campaign.stats && (
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-body-sm text-navy-500">
                    <Star className="h-4 w-4 text-gold-500" />
                    {campaign.stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-body-sm text-navy-500">
                    {campaign.stats.totalTrips} رحلة
                  </span>
                  <span className="text-body-sm text-navy-500">
                    {campaign.stats.totalReviews} تقييم
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            معلومات التواصل
          </h3>
          <div className="space-y-2">
            {campaign.contactPhone && (
              <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                <Phone className="h-4 w-4 text-navy-400 shrink-0" />
                <span dir="ltr">{campaign.contactPhone}</span>
              </div>
            )}
            {campaign.contactEmail && (
              <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                <Mail className="h-4 w-4 text-navy-400 shrink-0" />
                <span>{campaign.contactEmail}</span>
              </div>
            )}
            {campaign.website && (
              <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                <Globe className="h-4 w-4 text-navy-400 shrink-0" />
                <a
                  href={campaign.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-700 dark:text-navy-200 underline"
                >
                  {campaign.website}
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Trips */}
        <section>
          <h3 className="text-heading-md font-bold text-navy-900 dark:text-white mb-4">
            الرحلات المتاحة
          </h3>
          {trips.length > 0 ? (
            <div className="space-y-3">
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  variant="elevated"
                  padding="md"
                  hoverable
                  onClick={() =>
                    router.push(`/app/campaigns/${id}/trips/${trip.id}`)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-navy-100 dark:bg-navy-800">
                      <Calendar className="h-6 w-6 text-navy-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-lg font-semibold text-navy-900 dark:text-white truncate">
                        {trip.titleAr || trip.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-body-sm text-navy-500">
                        {trip.destinations?.[0] && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {trip.destinations[0].city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {trip.remainingCapacity} متبقي
                        </span>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-body-md font-bold text-navy-900 dark:text-white">
                        {trip.basePriceKWD} د.ك
                      </p>
                      <ChevronLeft className="h-4 w-4 text-navy-400 ms-auto mt-1 rtl:rotate-180" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title="لا توجد رحلات متاحة"
              description="لا توجد رحلات نشطة لهذه الحملة حاليًا"
            />
          )}
        </section>
      </Container>
    </div>
  );
}
