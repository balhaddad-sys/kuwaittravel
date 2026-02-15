"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function WalletPage() {
  return (
    <>
      <AppBar
        title="المحفظة"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "المحفظة" }]}
      />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="الرصيد المتاح" value={formatKWD(0)} icon={<Wallet className="h-5 w-5" />} />
          <StatCard title="رصيد معلق" value={formatKWD(0)} icon={<Clock className="h-5 w-5" />} />
          <StatCard title="التحويل القادم" value="—" icon={<ArrowUpRight className="h-5 w-5" />} />
          <StatCard title="إجمالي الأرباح" value={formatKWD(0)} icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <Card variant="outlined" padding="none">
          <div className="px-4 py-3 border-b border-surface-border dark:border-surface-dark-border">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">سجل المعاملات</h3>
          </div>
          <EmptyState
            icon={<Wallet className="h-16 w-16" />}
            title="لا توجد معاملات"
            description="ستظهر هنا جميع المعاملات المالية"
          />
        </Card>
      </Container>
    </>
  );
}
