"use client";

import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { t } = useDirection();

  return (
    <div className="travel-orbit-bg bg-surface-muted/45 dark:bg-surface-dark min-h-screen">
      <div className="travel-cover-pattern bg-white/82 dark:bg-surface-dark-card/80 border-b border-surface-border dark:border-surface-dark-border px-4 pt-8 pb-4 sm:pt-12">
        <Container>
          <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">
            {t("الإشعارات", "Notifications")}
          </h1>
        </Container>
      </div>

      <Container className="py-6">
        <EmptyState
          icon={<Bell className="h-16 w-16" />}
          title={t("لا توجد إشعارات", "No Notifications")}
          description={t("ستظهر هنا جميع التحديثات والتنبيهات المتعلقة برحلاتك", "All trip updates and alerts will appear here")}
        />
      </Container>
    </div>
  );
}
