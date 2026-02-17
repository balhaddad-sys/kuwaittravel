"use client";

import { useState, useEffect } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FAB } from "@/components/ui/FAB";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Campaign } from "@/types/campaign";
import type { VerificationStatus } from "@/types/common";
import { Users, Map, Wallet, AlertTriangle, Plus, BookOpen, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useDirection();
  const { userData } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    if (!userData?.campaignId) return;
    getDocument<Campaign>(COLLECTIONS.CAMPAIGNS, userData.campaignId).then((campaign) => {
      if (campaign) {
        setVerificationStatus(campaign.verificationStatus);
        setRejectionReason(campaign.rejectionReason ?? null);
      }
    });
  }, [userData?.campaignId]);

  return (
    <>
      <AppBar
        title={t("لوحة التحكم", "Dashboard")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal") }, { label: t("لوحة التحكم", "Dashboard") }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            className="max-[420px]:px-3"
            onClick={() => router.push("/portal/trips/create")}
          >
            <span className="max-[420px]:hidden">{t("رحلة جديدة", "New Trip")}</span>
            <span className="min-[421px]:hidden">{t("جديدة", "New")}</span>
          </Button>
        }
      />

      <Container className="sacred-pattern py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Verification Status Banners */}
        {verificationStatus === "pending" && (
          <AlertBanner
            type="info"
            title={t("حملتك قيد المراجعة", "Your campaign is under review")}
            description={t(
              "يقوم فريقنا بمراجعة وثائقك. سيتم إخطارك فور اكتمال المراجعة.",
              "Our team is reviewing your documents. You will be notified once the review is complete."
            )}
          />
        )}
        {verificationStatus === "rejected" && (
          <AlertBanner
            type="error"
            title={t("تم رفض طلب التحقق", "Verification declined")}
            description={rejectionReason || t("يرجى التواصل مع الدعم لمعرفة التفاصيل", "Please contact support for details")}
          />
        )}
        {verificationStatus === "suspended" && (
          <AlertBanner
            type="warning"
            title={t("حملتك معلقة", "Campaign suspended")}
            description={t("يرجى التواصل مع الدعم لمعرفة التفاصيل", "Please contact support for details")}
          />
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title={t("الرحلات النشطة", "Active Trips")} value={0} icon={<Map className="h-6 w-6" />} className="animate-stagger-in" hoverable />
          <StatCard title={t("إجمالي المسافرين", "Total Travelers")} value={0} icon={<Users className="h-6 w-6" />} className="animate-stagger-in stagger-delay-1" hoverable />
          <StatCard title={t("الإيرادات (د.ك)", "Revenue (KWD)")} value="0" icon={<Wallet className="h-6 w-6" />} className="animate-stagger-in stagger-delay-2" hoverable />
          <StatCard title={t("إجراءات معلقة", "Pending Actions")} value={0} icon={<AlertTriangle className="h-6 w-6" />} className="animate-stagger-in stagger-delay-3" hoverable />
        </div>

        <Card variant="elevated" padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border/85 bg-gradient-to-r from-stone-800 to-stone-900 px-4 py-3 dark:border-surface-dark-border/85">
            <h2 className="text-body-lg sm:text-heading-md font-bold text-white">
              {t("الرحلات النشطة", "Active Trips")}
            </h2>
            <Button variant="secondary" size="sm" onClick={() => router.push("/portal/trips")}>
              {t("عرض الكل", "View All")}
            </Button>
          </div>
          <div className="p-4">
            <EmptyState
              icon={<Map className="h-16 w-16" />}
              title={t("لا توجد رحلات نشطة", "No Active Trips")}
              description={t("أنشئ رحلتك الأولى للبدء", "Create your first trip to get started")}
              action={{ label: t("إنشاء رحلة", "Create Trip"), onClick: () => router.push("/portal/trips/create") }}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                <BookOpen className="h-4 w-4" />
              </span>
              {t("آخر الحجوزات", "Recent Bookings")}
            </h3>
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title={t("لا توجد حجوزات", "No Bookings Yet")}
              description={t("ستظهر هنا أحدث الحجوزات", "Recent bookings will appear here")}
              className="py-8"
            />
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                <TrendingUp className="h-4 w-4" />
              </span>
              {t("ملخص الأداء", "Performance Summary")}
            </h3>
            <EmptyState
              icon={<TrendingUp className="h-12 w-12" />}
              title={t("لا توجد بيانات", "No Data Yet")}
              description={t("ستظهر هنا مؤشرات الأداء", "Performance metrics will appear here")}
              className="py-8"
            />
          </Card>
        </div>
      </Container>

      <FAB
        icon={<Plus className="h-6 w-6" />}
        onClick={() => router.push("/portal/trips/create")}
        position="bottom-right-nav"
      />
    </>
  );
}
