"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { useDirection } from "@/providers/DirectionProvider";
import { ScrollText } from "lucide-react";

export default function AuditLogsPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar title={t("سجل العمليات", "Audit Logs")} breadcrumbs={[{ label: t("المشرف العام", "Admin Console"), href: "/admin/dashboard" }, { label: t("سجل العمليات", "Audit Logs") }]} />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <SearchInput placeholder={t("ابحث بالمستخدم أو نوع العملية...", "Search by user or action type...")} onSearch={() => {}} />
          <div className="rounded-[var(--radius-input)] border border-surface-border/90 bg-white/80 px-4 py-2.5 text-body-sm text-stone-500 backdrop-blur-sm dark:border-surface-dark-border/90 dark:bg-surface-dark-card/80 dark:text-stone-400">
            {t("آخر 30 يوماً", "Last 30 days")}
          </div>
        </div>
        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-md font-semibold text-stone-900 dark:text-white">{t("سجل النشاط والتدقيق", "Activity & Audit Log")}</h3>
          </div>
          <EmptyState
            icon={<ScrollText className="h-16 w-16" />}
            title={t("لا توجد عمليات", "No Activity")}
            description={t("ستظهر هنا سجلات العمليات، تغييرات الصلاحيات، وتتبع الإجراءات الإدارية", "Operations logs, permission changes, and admin actions will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
