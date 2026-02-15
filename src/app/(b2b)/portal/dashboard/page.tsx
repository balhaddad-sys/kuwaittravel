"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FAB } from "@/components/ui/FAB";
import { Users, Map, Wallet, AlertTriangle, Plus, BookOpen, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <>
      <AppBar
        title="لوحة التحكم"
        breadcrumbs={[{ label: "بوابة الحملة" }, { label: "لوحة التحكم" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            رحلة جديدة
          </Button>
        }
      />

      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="الرحلات النشطة" value={0} icon={<Map className="h-6 w-6" />} />
          <StatCard title="إجمالي المسافرين" value={0} icon={<Users className="h-6 w-6" />} />
          <StatCard title="الإيرادات (د.ك)" value="0" icon={<Wallet className="h-6 w-6" />} />
          <StatCard title="إجراءات معلقة" value={0} icon={<AlertTriangle className="h-6 w-6" />} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-sm sm:text-heading-md font-bold text-navy-900 dark:text-white">
              الرحلات النشطة
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/portal/trips")}>
              عرض الكل
            </Button>
          </div>
          <EmptyState
            icon={<Map className="h-16 w-16" />}
            title="لا توجد رحلات نشطة"
            description="أنشئ رحلتك الأولى للبدء"
            action={{ label: "إنشاء رحلة", onClick: () => router.push("/portal/trips/create") }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card variant="outlined" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-navy-500" />
              آخر الحجوزات
            </h3>
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="لا توجد حجوزات"
              description="ستظهر هنا أحدث الحجوزات"
              className="py-8"
            />
          </Card>

          <Card variant="outlined" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-navy-500" />
              ملخص الأداء
            </h3>
            <EmptyState
              icon={<TrendingUp className="h-12 w-12" />}
              title="لا توجد بيانات"
              description="ستظهر هنا مؤشرات الأداء"
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
