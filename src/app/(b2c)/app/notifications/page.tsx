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
    <div className="min-h-screen">
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#EBEBEB] dark:border-[#383838] px-4 pt-10 pb-4">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#222222] dark:text-white">
              {t("الإشعارات", "Notifications")}
              {unreadCount > 0 && (
                <span className="ms-2 inline-flex items-center justify-center rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
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
                  "w-full text-start rounded-xl border p-3 sm:p-4 transition-colors",
                  n.isRead
                    ? "border-[#EBEBEB] bg-white dark:border-[#383838] dark:bg-[#262626]"
                    : "border-sky-200 bg-sky-50/50 dark:border-sky-900/40 dark:bg-sky-900/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg",
                    n.isRead ? "bg-slate-100 text-slate-400 dark:bg-neutral-700/40 dark:text-neutral-400/60" : "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                  )}>
                    {typeIcons[n.type] || <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-body-sm font-bold truncate", n.isRead ? "text-[#717171] dark:text-neutral-200" : "text-[#222222] dark:text-white")}>
                        {language === "ar" ? n.titleAr : n.title}
                      </p>
                      {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                      {language === "ar" ? n.bodyAr : n.body}
                    </p>
                    {date && (
                      <p className="text-[11px] text-slate-400 mt-1">
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
