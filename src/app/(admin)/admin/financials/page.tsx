"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Wallet, TrendingUp, ArrowUpRight, Building2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function FinancialsPage() {
  return (
    <>
      <AppBar title="المالية" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المالية" }]} />
      <Container className="py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="GMV الشهري" value={formatKWD(42500)} icon={<Wallet className="h-5 w-5" />} change={{ value: 18, label: "عن الشهر الماضي" }} />
          <StatCard title="عمولة المنصة" value={formatKWD(850)} icon={<TrendingUp className="h-5 w-5" />} change={{ value: 18, label: "عن الشهر الماضي" }} />
          <StatCard title="المدفوعات المعلقة" value={formatKWD(3200)} icon={<ArrowUpRight className="h-5 w-5" />} />
          <StatCard title="المبالغ المستردة" value={formatKWD(285)} icon={<Wallet className="h-5 w-5" />} />
        </div>

        <Card variant="elevated" padding="lg">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4">إيرادات الحملات</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted dark:bg-surface-dark-card">
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحملة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">GMV</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">العمولة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">صافي الحملة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحجوزات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {[
                  { name: "حملة النور", gmv: 18500, commission: 370, net: 18130, bookings: 42 },
                  { name: "حملة الهدى", gmv: 12800, commission: 256, net: 12544, bookings: 28 },
                  { name: "حملة السلام", gmv: 11200, commission: 224, net: 10976, bookings: 18 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-navy-400" />
                        <span className="text-body-md font-medium text-navy-900 dark:text-white">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-md font-medium" dir="ltr">{formatKWD(row.gmv)}</td>
                    <td className="px-4 py-3 text-body-md text-success font-medium" dir="ltr">{formatKWD(row.commission)}</td>
                    <td className="px-4 py-3 text-body-md" dir="ltr">{formatKWD(row.net)}</td>
                    <td className="px-4 py-3 text-body-md text-navy-600">{row.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </>
  );
}
