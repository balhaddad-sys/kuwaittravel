"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2, Users, Wallet, Map, TrendingUp, AlertTriangle } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  return (
    <>
      <AppBar title="لوحة تحكم المشرف" breadcrumbs={[{ label: "المشرف العام" }, { label: "لوحة التحكم" }]} />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="إجمالي الحملات" value="0" icon={<Building2 className="h-6 w-6" />} />
          <StatCard title="إجمالي المستخدمين" value="0" icon={<Users className="h-6 w-6" />} />
          <StatCard title="GMV (د.ك)" value={formatKWD(0)} icon={<Wallet className="h-6 w-6" />} />
          <StatCard title="الرحلات النشطة" value="0" icon={<Map className="h-6 w-6" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-warning" /> حملات بانتظار التحقق
            </h3>
            <EmptyState
              icon={<Building2 className="h-12 w-12" />}
              title="لا توجد حملات معلقة"
              description="ستظهر هنا الحملات التي تحتاج مراجعة"
              className="py-8"
            />
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-error" /> نزاعات مفتوحة
            </h3>
            <EmptyState
              icon={<AlertTriangle className="h-12 w-12" />}
              title="لا توجد نزاعات"
              description="ستظهر هنا النزاعات المفتوحة"
              className="py-8"
            />
          </Card>
        </div>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" /> ملخص الإيرادات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-body-sm text-navy-500">إجمالي GMV</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(0)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">عمولة المنصة (2%)</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-success">{formatKWD(0)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">المدفوعات للحملات</p>
              <p className="text-heading-md sm:text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(0)}</p>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
