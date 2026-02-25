"use client";

import { useState, useEffect } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, getDocuments } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { where } from "firebase/firestore";
import { parseTimestamp, formatDate } from "@/lib/utils/format";
import type { Campaign } from "@/types/campaign";
import type { Trip } from "@/types/trip";
import {
  FileText,
  Shield,
  Map,
  Loader2,
  Calendar,
  Users,
  ClipboardList,
} from "lucide-react";

export default function DocumentsPage() {
  const { t, language } = useDirection();
  const { userData } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.campaignId) {
      setLoading(false);
      return;
    }

    const campaignId = userData.campaignId;

    async function fetchData() {
      try {
        const [campaignData, tripsData] = await Promise.all([
          getDocument<Campaign>(COLLECTIONS.CAMPAIGNS, campaignId),
          getDocuments<Trip>(COLLECTIONS.TRIPS, [
            where("campaignId", "==", campaignId),
          ]),
        ]);

        setCampaign(campaignData);
        setTrips(tripsData);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error("Documents fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userData?.campaignId]);

  if (!userData?.campaignId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
        <AppBar
          title={t("المستندات والكشوفات", "Documents & Statements")}
          breadcrumbs={[
            { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
            { label: t("المستندات", "Documents") },
          ]}
        />
        <Container className="py-3 sm:py-6">
          <AlertBanner
            type="warning"
            title={t("لا توجد حملة مرتبطة", "No campaign linked")}
            description={t(
              "حسابك غير مرتبط بأي حملة. يرجى التواصل مع الدعم.",
              "Your account is not linked to any campaign. Please contact support."
            )}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
      <AppBar
        title={t("المستندات والكشوفات", "Documents & Statements")}
        breadcrumbs={[
          { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
          { label: t("المستندات", "Documents") },
        ]}
      />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Campaign License Info */}
            {campaign && (
              <Card variant="outlined" padding="lg" className="border-violet-300/70 dark:border-violet-800/45">
                <div className="flex items-start gap-3">
                  <span className="eo-icon-circle eo-icon-circle-sm eo-icon-circle-accent shrink-0">
                    <Shield className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white mb-2">
                      {t("معلومات الترخيص", "License Information")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-body-sm text-slate-600 dark:text-slate-300/60">
                          {t("رقم الترخيص", "License Number")}
                        </span>
                        <span className="text-body-md font-mono font-semibold text-slate-900 dark:text-white">
                          {campaign.licenseNumber || "—"}
                        </span>
                      </div>
                      {campaign.commercialRegNumber && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-body-sm text-slate-600 dark:text-slate-300/60">
                            {t("السجل التجاري", "Commercial Reg.")}
                          </span>
                          <span className="text-body-md font-mono font-semibold text-slate-900 dark:text-white">
                            {campaign.commercialRegNumber}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-body-sm text-slate-600 dark:text-slate-300/60">
                          {t("حالة التحقق", "Verification Status")}
                        </span>
                        <Badge
                          variant={
                            campaign.verificationStatus === "approved"
                              ? "success"
                              : campaign.verificationStatus === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="sm"
                          dot
                        >
                          {campaign.verificationStatus === "approved"
                            ? t("معتمد", "Approved")
                            : campaign.verificationStatus === "pending"
                            ? t("قيد المراجعة", "Pending")
                            : campaign.verificationStatus === "rejected"
                            ? t("مرفوض", "Rejected")
                            : t("معلق", "Suspended")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Trip Documents */}
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border dark:border-surface-dark-border bg-gradient-to-r from-[#082F49] to-[#2E1065]">
                <h3 className="text-body-lg sm:text-heading-sm font-bold text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  {t("مستندات الرحلات", "Trip Documents")}
                </h3>
                <p className="text-body-sm text-slate-300 mt-0.5">
                  {t(
                    "كشوفات وملخصات تُنشأ تلقائياً لكل رحلة",
                    "Statements and summaries auto-generated per trip"
                  )}
                </p>
              </div>
              {trips.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-16 w-16" />}
                  title={t("لا توجد مستندات", "No Documents")}
                  description={t(
                    "ستظهر هنا المستندات والكشوفات عند إنشاء رحلاتك",
                    "Generated documents will appear here once you create trips"
                  )}
                />
              ) : (
                <div className="divide-y divide-surface-border/50 dark:divide-surface-dark-border/50">
                  {trips.map((trip) => {
                    const departure = parseTimestamp(trip.departureDate);
                    return (
                      <div
                        key={trip.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="eo-icon-circle eo-icon-circle-sm shrink-0">
                          <Map className="h-4 w-4 text-slate-500" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-body-sm font-semibold text-slate-800 dark:text-white truncate">
                            {language === "ar" ? trip.titleAr || trip.title : trip.title}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-300/60 mt-0.5">
                            {departure && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(departure, language === "ar" ? "ar-KW" : "en-US")}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {trip.bookedCount}/{trip.totalCapacity}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Badge
                            variant={
                              trip.status === "completed"
                                ? "success"
                                : trip.status === "cancelled"
                                ? "error"
                                : "default"
                            }
                            size="sm"
                          >
                            {trip.status === "completed"
                              ? t("مكتمل", "Completed")
                              : trip.status === "cancelled"
                              ? t("ملغي", "Cancelled")
                              : trip.status === "draft"
                              ? t("مسودة", "Draft")
                              : t("نشط", "Active")}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Info note */}
            <Card variant="outlined" padding="lg" className="border-sky-200/70 dark:border-sky-800/45">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-body-sm text-slate-700 dark:text-slate-200">
                    {t(
                      "يتم إنشاء كشوفات الحجوزات والتقارير المالية تلقائياً عند اكتمال الرحلات. يمكنك تحميلها من صفحة تفاصيل كل رحلة.",
                      "Booking statements and financial reports are auto-generated when trips are completed. You can download them from each trip's detail page."
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
}
