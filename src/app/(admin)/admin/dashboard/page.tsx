"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Building2, Users, Wallet, Map, TrendingUp, AlertTriangle } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("لوحة تحكم المشرف", "Admin Dashboard")}
        breadcrumbs={[{ label: t("المشرف العام", "Admin Console") }, { label: t("لوحة التحكم", "Dashboard") }]}
      />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title={t("إجمالي الحملات", "Total Campaigns")} value="0" icon={<Building2 className="h-6 w-6" />} />
          <StatCard title={t("إجمالي المستخدمين", "Total Users")} value="0" icon={<Users className="h-6 w-6" />} />
          <StatCard title={t("GMV (د.ك)", "GMV (KWD)")} value={formatKWD(0)} icon={<Wallet className="h-6 w-6" />} />
          <StatCard title={t("الرحلات النشطة", "Active Trips")} value="0" icon={<Map className="h-6 w-6" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-warning" /> {t("حملات بانتظار التحقق", "Campaigns Pending Verification")}
            </h3>
            <EmptyState
              icon={<Building2 className="h-12 w-12" />}
              title={t("لا توجد حملات معلقة", "No Pending Campaigns")}
              description={t("ستظهر هنا الحملات التي تحتاج مراجعة", "Campaigns awaiting review will appear here")}
              className="py-8"
            />
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-error" /> {t("نزاعات مفتوحة", "Open Disputes")}
            </h3>
            <EmptyState
              icon={<AlertTriangle className="h-12 w-12" />}
              title={t("لا توجد نزاعات", "No Open Disputes")}
              description={t("ستظهر هنا النزاعات المفتوحة", "Open disputes will appear here")}
              className="py-8"
            />
          </Card>
        </div>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" /> {t("ملخص الإيرادات", "Revenue Summary")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-body-sm text-navy-500">{t("إجمالي GMV", "Total GMV")}</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(0)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">{t("عمولة المنصة (2%)", "Platform Fee (2%)")}</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-success">{formatKWD(0)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">{t("المدفوعات للحملات", "Campaign Payouts")}</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(0)}</p>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
