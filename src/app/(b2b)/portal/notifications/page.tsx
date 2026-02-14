"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Send, Bell, Users, Clock } from "lucide-react";

const mockNotifications = [
  { id: "1", title: "تذكير بموعد المغادرة", body: "تذكير: موعد التجمع غداً الساعة 6 صباحاً في المطار", sent: "2026-02-13", recipients: 38, trip: "كربلاء المقدسة" },
  { id: "2", title: "تحديث التأشيرات", body: "تم اعتماد جميع التأشيرات. يرجى التأكد من حمل جوازاتكم", sent: "2026-02-12", recipients: 45, trip: "كربلاء المقدسة" },
  { id: "3", title: "تحديث الأسعار", body: "تم تحديث أسعار رحلة مشهد المقدسة", sent: "2026-02-11", recipients: 12, trip: "مشهد المقدسة" },
];

export default function NotificationsPage() {
  return (
    <>
      <AppBar
        title="الإشعارات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الإشعارات" }]}
      />
      <Container className="py-6 space-y-6">
        {/* Send new notification */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4">
            إرسال إشعار جديد
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="">اختر الرحلة</option>
                <option value="1">كربلاء المقدسة - أربعين</option>
                <option value="2">مشهد المقدسة</option>
              </select>
              <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card">
                <option value="all">جميع المسافرين</option>
                <option value="bus_a">الحافلة أ</option>
                <option value="bus_b">الحافلة ب</option>
                <option value="unpaid">غير المدفوع</option>
                <option value="missing_docs">مستندات ناقصة</option>
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

        {/* History */}
        <div>
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4">سجل الإشعارات</h3>
          <div className="space-y-3">
            {mockNotifications.map((notif) => (
              <Card key={notif.id} variant="outlined" padding="md">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-800 shrink-0">
                    <Bell className="h-5 w-5 text-navy-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-body-md font-semibold text-navy-900 dark:text-white">{notif.title}</h4>
                      <Badge variant="default" size="sm">{notif.trip}</Badge>
                    </div>
                    <p className="text-body-sm text-navy-600 dark:text-navy-300">{notif.body}</p>
                    <div className="flex items-center gap-4 mt-2 text-body-sm text-navy-400">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {notif.recipients} مستلم</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {notif.sent}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
