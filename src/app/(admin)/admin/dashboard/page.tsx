"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building2, Users, Wallet, Map, TrendingUp, AlertTriangle } from "lucide-react";
import { formatKWD } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  return (
    <>
      <AppBar title="لوحة تحكم المشرف" breadcrumbs={[{ label: "المشرف العام" }, { label: "لوحة التحكم" }]} />
      <Container className="py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الحملات" value="24" icon={<Building2 className="h-6 w-6" />} change={{ value: 4, label: "هذا الشهر" }} />
          <StatCard title="إجمالي المستخدمين" value="1,847" icon={<Users className="h-6 w-6" />} change={{ value: 12, label: "هذا الشهر" }} />
          <StatCard title="GMV (د.ك)" value={formatKWD(127500)} icon={<Wallet className="h-6 w-6" />} change={{ value: 18, label: "عن الشهر الماضي" }} />
          <StatCard title="الرحلات النشطة" value="15" icon={<Map className="h-6 w-6" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pending Verifications */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-warning" /> حملات بانتظار التحقق
            </h3>
            <div className="space-y-3">
              {[
                { name: "حملة البيان", license: "AWQ-2026-5678", date: "2026-02-12" },
                { name: "حملة الصفا", license: "AWQ-2026-9012", date: "2026-02-13" },
                { name: "حملة المصطفى", license: "AWQ-2026-3456", date: "2026-02-14" },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border last:border-0">
                  <div>
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">{campaign.name}</p>
                    <p className="text-body-sm text-navy-500">{campaign.license} | {campaign.date}</p>
                  </div>
                  <Badge variant="warning" size="sm">قيد المراجعة</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Disputes */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-error" /> نزاعات مفتوحة
            </h3>
            <div className="space-y-3">
              {[
                { id: "DSP-001", subject: "طلب استرداد - جودة الخدمة", campaign: "حملة النور", status: "open" },
                { id: "DSP-002", subject: "عدم تطابق الغرفة مع الوصف", campaign: "حملة الهدى", status: "under_review" },
              ].map((dispute, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border last:border-0">
                  <div>
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">{dispute.subject}</p>
                    <p className="text-body-sm text-navy-500">{dispute.id} | {dispute.campaign}</p>
                  </div>
                  <Badge variant={dispute.status === "open" ? "error" : "warning"} size="sm">
                    {dispute.status === "open" ? "مفتوح" : "قيد المراجعة"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" /> ملخص الإيرادات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-body-sm text-navy-500">إجمالي GMV</p>
              <p className="text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(127500)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">عمولة المنصة (2%)</p>
              <p className="text-heading-lg font-bold text-success">{formatKWD(2550)}</p>
            </div>
            <div>
              <p className="text-body-sm text-navy-500">المدفوعات للحملات</p>
              <p className="text-heading-lg font-bold text-navy-900 dark:text-white">{formatKWD(124950)}</p>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
