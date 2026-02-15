"use client";

import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <div className="bg-white dark:bg-surface-dark-card border-b border-surface-border dark:border-surface-dark-border px-4 pt-8 pb-4 sm:pt-12">
        <Container>
          <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">الإشعارات</h1>
        </Container>
      </div>

      <Container className="py-6">
        <EmptyState
          icon={<Bell className="h-16 w-16" />}
          title="لا توجد إشعارات"
          description="ستظهر هنا جميع التحديثات والتنبيهات المتعلقة برحلاتك"
        />
      </Container>
    </div>
  );
}
