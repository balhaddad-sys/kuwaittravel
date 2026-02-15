"use client";

import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, Calendar, CreditCard, FileText, AlertTriangle } from "lucide-react";

const mockNotifications = [
  { id: "1", type: "trip_update", title: "تحديث الرحلة", body: "تم تأكيد حجزك لرحلة كربلاء المقدسة", time: "منذ ساعة", read: false },
  { id: "2", type: "payment", title: "تأكيد الدفع", body: "تم استلام مبلغ 285 د.ك بنجاح", time: "منذ يوم", read: false },
  { id: "3", type: "reminder", title: "تذكير", body: "موعد المغادرة بعد 5 أيام - تأكد من جواز سفرك", time: "منذ يومين", read: true },
  { id: "4", type: "document", title: "مستند مطلوب", body: "يرجى رفع صورة جواز السفر لإتمام الحجز", time: "منذ 3 أيام", read: true },
];

const typeIcons: Record<string, React.ReactNode> = {
  trip_update: <Calendar className="h-5 w-5 text-info" />,
  payment: <CreditCard className="h-5 w-5 text-success" />,
  reminder: <AlertTriangle className="h-5 w-5 text-warning" />,
  document: <FileText className="h-5 w-5 text-navy-500" />,
};

export default function NotificationsPage() {
  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <div className="bg-white dark:bg-surface-dark-card border-b border-surface-border dark:border-surface-dark-border px-4 pt-8 pb-4 sm:pt-12">
        <Container>
          <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">الإشعارات</h1>
        </Container>
      </div>

      <Container className="py-6">
        {mockNotifications.length > 0 ? (
          <div className="space-y-2">
            {mockNotifications.map((notif) => (
              <Card key={notif.id} variant={notif.read ? "outlined" : "elevated"} padding="md" hoverable>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{typeIcons[notif.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-body-md ${notif.read ? "text-navy-600" : "font-semibold text-navy-900 dark:text-white"}`}>
                        {notif.title}
                      </p>
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-gold-500" />}
                    </div>
                    <p className="text-body-sm text-navy-500 mt-0.5">{notif.body}</p>
                    <p className="text-[11px] text-navy-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title="لا توجد إشعارات"
            description="ستظهر هنا جميع التحديثات والتنبيهات المتعلقة برحلاتك"
          />
        )}
      </Container>
    </div>
  );
}
