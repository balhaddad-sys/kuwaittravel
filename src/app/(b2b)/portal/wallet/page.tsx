"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/data-display/StatCard";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

const mockWallet = {
  available: 8750,
  pending: 2080,
  nextPayout: "2026-02-20",
  totalEarnings: 38250,
};

const mockTransactions = [
  { id: "TX001", type: "inbound" as const, description: "حجز BK001 - أحمد محمد", amount: 285, fee: 5.7, net: 279.3, status: "completed", date: "2026-02-10" },
  { id: "TX002", type: "inbound" as const, description: "حجز BK002 - فاطمة حسين", amount: 450, fee: 9, net: 441, status: "completed", date: "2026-02-11" },
  { id: "TX003", type: "outbound" as const, description: "تحويل إلى الحساب البنكي", amount: 5000, fee: 0, net: 5000, status: "completed", date: "2026-02-08" },
  { id: "TX004", type: "inbound" as const, description: "حجز BK004 - زينب الموسوي", amount: 570, fee: 11.4, net: 558.6, status: "pending", date: "2026-02-12" },
];

export default function WalletPage() {
  return (
    <>
      <AppBar
        title="المحفظة"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "المحفظة" }]}
      />
      <Container className="py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الرصيد المتاح" value={formatKWD(mockWallet.available)} icon={<Wallet className="h-5 w-5" />} />
          <StatCard title="رصيد معلق" value={formatKWD(mockWallet.pending)} icon={<Clock className="h-5 w-5" />} />
          <StatCard title="التحويل القادم" value={mockWallet.nextPayout} icon={<ArrowUpRight className="h-5 w-5" />} />
          <StatCard title="إجمالي الأرباح" value={formatKWD(mockWallet.totalEarnings)} icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <Card variant="outlined" padding="none">
          <div className="px-4 py-3 border-b border-surface-border dark:border-surface-dark-border">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">سجل المعاملات</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border dark:border-surface-dark-border bg-surface-muted dark:bg-surface-dark-card">
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">التاريخ</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الوصف</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المبلغ</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">العمولة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الصافي</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-dark-border">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors">
                    <td className="px-4 py-3 text-body-sm text-navy-500">{tx.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tx.type === "inbound" ? (
                          <ArrowDownRight className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-info" />
                        )}
                        <span className="text-body-md text-navy-700 dark:text-navy-200">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-md font-medium" dir="ltr">{formatKWD(tx.amount)}</td>
                    <td className="px-4 py-3 text-body-md text-navy-500" dir="ltr">{tx.fee > 0 ? formatKWD(tx.fee) : "—"}</td>
                    <td className="px-4 py-3 text-body-md font-semibold text-navy-900 dark:text-white" dir="ltr">{formatKWD(tx.net)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={tx.status === "completed" ? "success" : "warning"} size="sm">
                        {tx.status === "completed" ? "مكتمل" : "معلق"}
                      </Badge>
                    </td>
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
