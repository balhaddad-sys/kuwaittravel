"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FAB } from "@/components/ui/FAB";
import { useDirection } from "@/providers/DirectionProvider";
import { Users, Map, Wallet, AlertTriangle, Plus, BookOpen, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useDirection();
  return (
    <>
      <AppBar
        title={t("لوحة التحكم", "Dashboard")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal") }, { label: t("لوحة التحكم", "Dashboard") }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            {t("رحلة جديدة", "New Trip")}
          </Button>
        }
      />

      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title={t("الرحلات النشطة", "Active Trips")} value={0} icon={<Map className="h-6 w-6" />} />
          <StatCard title={t("إجمالي المسافرين", "Total Travelers")} value={0} icon={<Users className="h-6 w-6" />} />
          <StatCard title={t("الإيرادات (د.ك)", "Revenue (KWD)")} value="0" icon={<Wallet className="h-6 w-6" />} />
          <StatCard title={t("إجراءات معلقة", "Pending Actions")} value={0} icon={<AlertTriangle className="h-6 w-6" />} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-sm sm:text-heading-md font-bold text-navy-900 dark:text-white">
              {t("الرحلات النشطة", "Active Trips")}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/portal/trips")}>
              {t("عرض الكل", "View All")}
            </Button>
          </div>
          <EmptyState
            icon={<Map className="h-16 w-16" />}
            title={t("لا توجد رحلات نشطة", "No Active Trips")}
            description={t("أنشئ رحلتك الأولى للبدء", "Create your first trip to get started")}
            action={{ label: t("إنشاء رحلة", "Create Trip"), onClick: () => router.push("/portal/trips/create") }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card variant="outlined" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-navy-500" />
              {t("آخر الحجوزات", "Recent Bookings")}
            </h3>
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title={t("لا توجد حجوزات", "No Bookings Yet")}
              description={t("ستظهر هنا أحدث الحجوزات", "Recent bookings will appear here")}
              className="py-8"
            />
          </Card>

          <Card variant="outlined" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-navy-500" />
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
      />
    </>
  );
}
