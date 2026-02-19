"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange, updateDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { where } from "firebase/firestore";
import { cn } from "@/lib/utils/cn";
import { parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { Notification } from "@/types/notification";
import { Bell, BellRing, CheckCheck, BookOpen, CreditCard, AlertTriangle, Megaphone, Info, LogIn } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  booking_confirmed: <BookOpen className="h-4 w-4" />,
  payment_received: <CreditCard className="h-4 w-4" />,
  trip_reminder: <BellRing className="h-4 w-4" />,
  trip_update: <Megaphone className="h-4 w-4" />,
  sos_alert: <AlertTriangle className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
};

export default function NotificationsPage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { firebaseUser, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notReady = authLoading || !firebaseUser;
  const [loading, setLoading] = useState(!notReady);

  useEffect(() => {
    if (notReady) return;
    const unsub = onCollectionChange<Notification>(
      COLLECTIONS.NOTIFICATIONS,
      [where("recipientId", "==", firebaseUser.uid)],
      (data) => {
        data.sort((a, b) => {
          const da = parseTimestamp(a.createdAt)?.getTime() ?? 0;
          const db = parseTimestamp(b.createdAt)?.getTime() ?? 0;
          return db - da;
        });
        setNotifications(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [firebaseUser, notReady]);

  const markAsRead = async (id: string) => {
    await updateDocument(COLLECTIONS.NOTIFICATIONS, id, { isRead: true });
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => updateDocument(COLLECTIONS.NOTIFICATIONS, n.id, { isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="sacred-pattern min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      <div className="border-b border-surface-border bg-white/82 px-4 pb-4 pt-8 backdrop-blur-sm dark:border-surface-dark-border dark:bg-surface-dark-card/80 sm:pt-12">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md sm:h-11 sm:w-11">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-heading-lg font-bold text-stone-900 dark:text-white sm:text-display-md">
                  {t("الإشعارات", "Notifications")}
                </h1>
                <p className="text-body-sm text-stone-500 dark:text-stone-400">
                  {t("تحديثات وتنبيهات الرحلات", "Trip updates and alerts")}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                <CheckCheck className="h-4 w-4 me-1" />
                {t("قراءة الكل", "Read all")}
              </Button>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-4 sm:py-6 space-y-2">
        {!firebaseUser && !authLoading ? (
          <div className="py-10">
            <EmptyState
              icon={<LogIn className="h-14 w-14" />}
              title={t("سجّل دخولك", "Sign in required")}
              description={t("سجّل دخولك لعرض إشعاراتك", "Sign in to view your notifications")}
              action={{ label: t("تسجيل الدخول", "Sign In"), onClick: () => router.push("/login") }}
            />
          </div>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title={t("لا توجد إشعارات", "No Notifications")}
            description={t("ستظهر هنا جميع التحديثات والتنبيهات المتعلقة برحلاتك", "All trip updates and alerts will appear here")}
          />
        ) : (
          notifications.map((n) => {
            const date = parseTimestamp(n.createdAt);
            return (
              <button
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={cn(
                  "w-full text-start rounded-xl border p-3 sm:p-4 transition-all",
                  n.isRead
                    ? "border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                    : "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-900/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg",
                    n.isRead ? "bg-stone-100 text-stone-400 dark:bg-slate-700 dark:text-slate-500" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {typeIcons[n.type] || <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-body-sm font-bold truncate", n.isRead ? "text-stone-700 dark:text-stone-300" : "text-stone-900 dark:text-white")}>
                        {language === "ar" ? n.titleAr : n.title}
                      </p>
                      {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {language === "ar" ? n.bodyAr : n.body}
                    </p>
                    {date && (
                      <p className="text-[11px] text-stone-400 mt-1">
                        {formatRelativeTime(date, language === "ar" ? "ar-KW" : "en-US")}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </Container>
    </div>
  );
}
