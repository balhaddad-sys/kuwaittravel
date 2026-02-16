"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { ScrollText } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <>
      <AppBar title="سجل العمليات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "سجل العمليات" }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <SearchInput placeholder="ابحث بالمستخدم أو نوع العملية..." onSearch={() => {}} />
          <div className="rounded-[var(--radius-input)] border border-surface-border/90 bg-white/80 px-4 py-2.5 text-body-sm text-navy-500 backdrop-blur-sm dark:border-surface-dark-border/90 dark:bg-surface-dark-card/80 dark:text-navy-300">
            آخر 30 يوماً
          </div>
        </div>
        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-md font-semibold text-navy-900 dark:text-white">سجل النشاط والتدقيق</h3>
          </div>
          <EmptyState
            icon={<ScrollText className="h-16 w-16" />}
            title="لا توجد عمليات"
            description="ستظهر هنا سجلات العمليات، تغييرات الصلاحيات، وتتبع الإجراءات الإدارية"
          />
        </Card>
      </Container>
    </>
  );
}
