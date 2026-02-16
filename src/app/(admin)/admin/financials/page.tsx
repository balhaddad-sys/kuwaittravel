"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet, TrendingUp, ArrowUpRight, Building2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function FinancialsPage() {
  const [period, setPeriod] = useState("month");

  return (
    <>
      <AppBar title="المالية" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المالية" }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="GMV الشهري" value={formatKWD(0)} icon={<Wallet className="h-5 w-5 text-gold-500" />} hoverable />
          <StatCard title="عمولة المنصة" value={formatKWD(0)} icon={<TrendingUp className="h-5 w-5 text-gold-500" />} hoverable />
          <StatCard title="المدفوعات المعلقة" value={formatKWD(0)} icon={<ArrowUpRight className="h-5 w-5 text-gold-500" />} hoverable />
          <StatCard title="المبالغ المستردة" value={formatKWD(0)} icon={<Wallet className="h-5 w-5 text-gold-500" />} hoverable />
        </div>

        <Card variant="elevated" padding="lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">إيرادات الحملات</h3>
            <div className="inline-flex items-center rounded-full border border-surface-border/80 bg-white/72 p-1 dark:border-surface-dark-border/80 dark:bg-surface-dark-card/72">
              {[
                { value: "week", label: "أسبوعي" },
                { value: "month", label: "شهري" },
                { value: "quarter", label: "ربع سنوي" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-full px-2 py-1 text-body-sm transition-colors sm:px-3 ${period === item.value ? "bg-navy-700 text-white" : "text-navy-600 dark:text-navy-300"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
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
