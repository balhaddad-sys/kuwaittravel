"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Users, ShieldCheck, Eye, Settings } from "lucide-react";

export default function StaffPage() {
  const { t } = useDirection();
  const { userData } = useAuth();
  const { toast } = useToast();

  const handleAddMember = () => {
    toast({
      type: "info",
      title: t("قريباً", "Coming Soon"),
      description: t(
        "ميزة إدارة فريق العمل قيد التطوير وستكون متاحة قريباً.",
        "Team management feature is under development and will be available soon."
      ),
    });
  };

  if (!userData?.campaignId) {
    return (
      <>
        <AppBar
          title={t("فريق العمل", "Team")}
          breadcrumbs={[
            { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
            { label: t("فريق العمل", "Team") },
          ]}
        />
        <Container className="sacred-pattern py-3 sm:py-6">
          <AlertBanner
            type="warning"
            title={t("لا توجد حملة مرتبطة", "No campaign linked")}
            description={t(
              "حسابك غير مرتبط بأي حملة. يرجى التواصل مع الدعم.",
              "Your account is not linked to any campaign. Please contact support."
            )}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar
        title={t("فريق العمل", "Team")}
        breadcrumbs={[
          { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
          { label: t("فريق العمل", "Team") },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={handleAddMember}
          >
            {t("إضافة عضو", "Add Member")}
          </Button>
        }
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Roles info */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4">
            {t("أدوار فريق العمل", "Team Roles")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-surface-border/60 dark:border-surface-dark-border/60">
              <span className="travel-icon-circle travel-icon-circle-sm">
                <Settings className="h-4 w-4 text-gray-500" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-gray-800 dark:text-white">
                  {t("مدير", "Manager")}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-indigo-300/60">
                  {t(
                    "إدارة كاملة للرحلات والحجوزات والفريق",
                    "Full access to trips, bookings, and team"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-surface-border/60 dark:border-surface-dark-border/60">
              <span className="travel-icon-circle travel-icon-circle-sm">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-gray-800 dark:text-white">
                  {t("مشغل", "Operator")}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-indigo-300/60">
                  {t(
                    "إدارة الرحلات والحجوزات فقط",
                    "Manage trips and bookings only"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-surface-border/60 dark:border-surface-dark-border/60">
              <span className="travel-icon-circle travel-icon-circle-sm">
                <Eye className="h-4 w-4 text-gray-500" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-gray-800 dark:text-white">
                  {t("مشاهد", "Viewer")}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-indigo-300/60">
                  {t(
                    "عرض البيانات فقط بدون تعديل",
                    "View-only access, no editing"
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Staff list - currently empty */}
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title={t("لا يوجد أعضاء", "No Members")}
            description={t(
              "أضف أعضاء فريقك لمساعدتك في إدارة الحملة. سيتم دعم إدارة الفريق قريباً.",
              "Invite teammates to support operations. Team management will be available soon."
            )}
            action={{
              label: t("إضافة عضو", "Add Member"),
              onClick: handleAddMember,
            }}
          />
        </Card>
      </Container>
    </>
  );
}
