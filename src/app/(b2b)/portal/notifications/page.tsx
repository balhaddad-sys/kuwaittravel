"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Send, Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <AppBar
        title="الإشعارات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الإشعارات" }]}
      />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-6">
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
            <textarea
              placeholder="نص الرسالة..."
              className="w-full rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md min-h-[80px] resize-y focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none dark:border-surface-dark-border dark:bg-surface-dark-card"
            />
            <div className="flex justify-end">
              <Button variant="primary" leftIcon={<Send className="h-4 w-4" />}>
                إرسال
              </Button>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4">سجل الإشعارات</h3>
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title="لا توجد إشعارات مرسلة"
            description="ستظهر هنا الإشعارات التي أرسلتها لمسافريك"
          />
        </div>
      </Container>
    </>
  );
}
