"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet, TrendingUp, ArrowUpRight, Building2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";
import { useDirection } from "@/providers/DirectionProvider";

export default function FinancialsPage() {
  const { t } = useDirection();
  const [period, setPeriod] = useState("month");

  return (
    <>
      <AppBar title={t("المالية", "Financials")} breadcrumbs={[{ label: t("المشرف العام", "Admin Console"), href: "/admin/dashboard" }, { label: t("المالية", "Financials") }]} />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title={t("GMV الشهري", "Monthly GMV")} value={formatKWD(0)} icon={<Wallet className="h-5 w-5 text-amber-500" />} hoverable />
          <StatCard title={t("عمولة المنصة", "Platform Commission")} value={formatKWD(0)} icon={<TrendingUp className="h-5 w-5 text-amber-500" />} hoverable />
          <StatCard title={t("المدفوعات المعلقة", "Pending Payouts")} value={formatKWD(0)} icon={<ArrowUpRight className="h-5 w-5 text-amber-500" />} hoverable />
          <StatCard title={t("المبالغ المستردة", "Refunds")} value={formatKWD(0)} icon={<Wallet className="h-5 w-5 text-amber-500" />} hoverable />
        </div>

        <Card variant="elevated" padding="lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">{t("إيرادات الحملات", "Campaign Revenue")}</h3>
            <div className="inline-flex items-center rounded-full border border-surface-border/80 bg-white/72 p-1 dark:border-surface-dark-border/80 dark:bg-surface-dark-card/72">
              {[
                { value: "week", label: t("أسبوعي", "Weekly") },
                { value: "month", label: t("شهري", "Monthly") },
                { value: "quarter", label: t("ربع سنوي", "Quarterly") },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-full px-2 py-1 text-body-sm transition-colors sm:px-3 ${period === item.value ? "bg-stone-700 text-white" : "text-stone-600 dark:text-stone-400"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <EmptyState
            icon={<Building2 className="h-16 w-16" />}
            title={t("لا توجد إيرادات", "No Revenue")}
            description={t("ستظهر هنا إيرادات الحملات عند إتمام الحجوزات", "Campaign revenue will appear here once bookings are completed")}
          />
        </Card>
      </Container>
    </>
  );
}
