"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { Send, Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <AppBar
        title="الإشعارات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الإشعارات" }]}
      />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4">
            إرسال إشعار جديد
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="">اختر الرحلة</option>
              </select>
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="all">جميع المسافرين</option>
              </select>
            </div>
            <Input placeholder="عنوان الإشعار" />
            <Textarea placeholder="نص الرسالة..." className="min-h-[80px]" />
            <div className="flex justify-end">
              <Button variant="primary" leftIcon={<Send className="h-4 w-4" />}>
                إرسال
              </Button>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">سجل الإشعارات</h3>
          </div>
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title="لا توجد إشعارات مرسلة"
            description="ستظهر هنا الإشعارات التي أرسلتها لمسافريك / Sent notifications history appears here"
          />
        </Card>
      </Container>
    </>
  );
}
