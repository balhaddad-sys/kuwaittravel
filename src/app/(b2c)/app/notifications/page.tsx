"use client";

import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Bell, BellRing } from "lucide-react";

export default function NotificationsPage() {
  const { t } = useDirection();

  return (
    <div className="sacred-pattern min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      {/* Header */}
      <div className="sacred-pattern border-b border-surface-border bg-white/82 px-4 pb-4 pt-8 backdrop-blur-sm dark:border-surface-dark-border dark:bg-surface-dark-card/80 sm:pt-12">
        <Container>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md sm:h-11 sm:w-11">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-heading-lg font-bold text-stone-900 dark:text-white sm:text-display-md">
                {t("الإشعارات", "Notifications")}
              </h1>
              <p className="text-body-sm text-stone-500 dark:text-stone-400">
                {t(
                  "تحديثات وتنبيهات الرحلات",
                  "Trip updates and alerts"
                )}
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-6">
        <EmptyState
          icon={<Bell className="h-16 w-16" />}
          title={t("لا توجد إشعارات", "No Notifications")}
          description={t(
            "ستظهر هنا جميع التحديثات والتنبيهات المتعلقة برحلاتك",
            "All trip updates and alerts will appear here"
          )}
        />
      </Container>
    </div>
  );
}
