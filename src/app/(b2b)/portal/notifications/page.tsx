"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { Send, Bell } from "lucide-react";

export default function NotificationsPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("الإشعارات", "Notifications")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الإشعارات", "Notifications") }]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4">
            {t("إرسال إشعار جديد", "Send New Notification")}
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="">{t("اختر الرحلة", "Select Trip")}</option>
              </select>
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="all">{t("جميع المسافرين", "All Travelers")}</option>
              </select>
            </div>
            <Input placeholder={t("عنوان الإشعار", "Notification Title")} />
            <Textarea placeholder={t("نص الرسالة...", "Message body...")} className="min-h-[80px]" />
            <div className="flex justify-end">
              <Button variant="primary" leftIcon={<Send className="h-4 w-4" />}>
                {t("إرسال", "Send")}
              </Button>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">{t("سجل الإشعارات", "Notification History")}</h3>
          </div>
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title={t("لا توجد إشعارات مرسلة", "No Sent Notifications")}
            description={t("ستظهر هنا الإشعارات التي أرسلتها لمسافريك", "Sent notifications history appears here")}
          />
        </Card>
      </Container>
    </>
  );
}
