"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Wallet, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function WalletPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("المحفظة", "Wallet")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("المحفظة", "Wallet") }]}
      />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title={t("الرصيد المتاح", "Available Balance")} value={formatKWD(0)} icon={<Wallet className="h-5 w-5" />} hoverable />
          <StatCard title={t("رصيد معلق", "Pending Balance")} value={formatKWD(0)} icon={<Clock className="h-5 w-5" />} hoverable />
          <StatCard title={t("التحويل القادم", "Next Transfer")} value="—" icon={<ArrowUpRight className="h-5 w-5" />} hoverable />
          <StatCard title={t("إجمالي الأرباح", "Total Earnings")} value={formatKWD(0)} icon={<CheckCircle2 className="h-5 w-5" />} hoverable />
        </div>

        <Card variant="elevated" padding="none">
          <div className="px-4 py-3 border-b border-surface-border dark:border-surface-dark-border">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">{t("سجل المعاملات", "Transaction History")}</h3>
          </div>
          <EmptyState
            icon={<Wallet className="h-16 w-16" />}
            title={t("لا توجد معاملات", "No Transactions")}
            description={t("ستظهر هنا جميع المعاملات المالية", "All financial transactions will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
