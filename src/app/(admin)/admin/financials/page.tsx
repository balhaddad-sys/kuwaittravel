"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet, TrendingUp, ArrowUpRight, Building2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function FinancialsPage() {
  return (
    <>
      <AppBar title="المالية" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المالية" }]} />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="GMV الشهري" value={formatKWD(0)} icon={<Wallet className="h-5 w-5" />} />
          <StatCard title="عمولة المنصة" value={formatKWD(0)} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard title="المدفوعات المعلقة" value={formatKWD(0)} icon={<ArrowUpRight className="h-5 w-5" />} />
          <StatCard title="المبالغ المستردة" value={formatKWD(0)} icon={<Wallet className="h-5 w-5" />} />
        </div>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4">إيرادات الحملات</h3>
          <EmptyState
            icon={<Building2 className="h-16 w-16" />}
            title="لا توجد إيرادات"
            description="ستظهر هنا إيرادات الحملات عند إتمام الحجوزات"
          />
        </Card>
      </Container>
    </>
  );
}
