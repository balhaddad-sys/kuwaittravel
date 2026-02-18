"use client";

import { useState, useEffect } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocuments, createDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { where, orderBy } from "firebase/firestore";
import { parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { Trip } from "@/types/trip";
import type { Notification } from "@/types/notification";
import type { Booking } from "@/types/booking";
import { Send, Bell, Loader2, CheckCircle2, Clock } from "lucide-react";

export default function NotificationsPage() {
  const { t, language } = useDirection();
  const { userData, firebaseUser } = useAuth();
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form state
  const [selectedTripId, setSelectedTripId] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifTitleAr, setNotifTitleAr] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifBodyAr, setNotifBodyAr] = useState("");

  useEffect(() => {
    if (!userData?.campaignId) {
      setLoading(false);
      return;
    }

    const campaignId = userData.campaignId;

    async function fetchData() {
      try {
        const [tripsData, notifsData] = await Promise.all([
          getDocuments<Trip>(COLLECTIONS.TRIPS, [
            where("campaignId", "==", campaignId),
          ]),
          getDocuments<Notification>(COLLECTIONS.NOTIFICATIONS, [
            where("recipientId", "==", campaignId),
          ]),
        ]);

        setTrips(tripsData);

        // Sort notifications by createdAt descending
        const sorted = [...notifsData].sort((a, b) => {
          const dateA = parseTimestamp(a.createdAt)?.getTime() || 0;
          const dateB = parseTimestamp(b.createdAt)?.getTime() || 0;
          return dateB - dateA;
        });
        setNotifications(sorted);
      } catch (err) {
        console.error("Notifications fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userData?.campaignId]);

  const handleSend = async () => {
    if (!notifTitle.trim() && !notifTitleAr.trim()) {
      toast({
        type: "warning",
        title: t("يرجى إدخال عنوان الإشعار", "Please enter notification title"),
      });
      return;
    }
    if (!notifBody.trim() && !notifBodyAr.trim()) {
      toast({
        type: "warning",
        title: t("يرجى إدخال نص الرسالة", "Please enter message body"),
      });
      return;
    }
    if (!userData?.campaignId || !firebaseUser) return;

    setSending(true);
    try {
      // Get all bookings for the selected trip (or all campaign bookings)
      const bookingConstraints = selectedTripId
        ? [
            where("campaignId", "==", userData.campaignId),
            where("tripId", "==", selectedTripId),
          ]
        : [where("campaignId", "==", userData.campaignId)];

      const bookings = await getDocuments<Booking>(
        COLLECTIONS.BOOKINGS,
        bookingConstraints
      );

      // Get unique traveler IDs
      const travelerIds = [...new Set(bookings.map((b) => b.travelerId))];

      if (travelerIds.length === 0) {
        toast({
          type: "warning",
          title: t(
            "لا يوجد مسافرون لإرسال الإشعار لهم",
            "No travelers to send notification to"
          ),
        });
        setSending(false);
        return;
      }

      // Create a notification for each traveler
      const promises = travelerIds.map((travelerId) =>
        createDocument(COLLECTIONS.NOTIFICATIONS, {
          recipientId: travelerId,
          recipientRole: "traveler" as const,
          type: "trip_update" as const,
          title: notifTitle || notifTitleAr,
          titleAr: notifTitleAr || notifTitle,
          body: notifBody || notifBodyAr,
          bodyAr: notifBodyAr || notifBody,
          data: selectedTripId
            ? {
                screen: "trip_details",
                entityId: selectedTripId,
                entityType: "trip",
              }
            : undefined,
          isRead: false,
          isPushed: false,
        })
      );

      await Promise.all(promises);

      toast({
        type: "success",
        title: t("تم إرسال الإشعار بنجاح", "Notification sent successfully"),
        description: t(
          `تم إرسال الإشعار إلى ${travelerIds.length} مسافر`,
          `Notification sent to ${travelerIds.length} travelers`
        ),
      });

      // Reset form
      setNotifTitle("");
      setNotifTitleAr("");
      setNotifBody("");
      setNotifBodyAr("");
      setSelectedTripId("");
    } catch (err) {
      console.error("Send notification error:", err);
      toast({
        type: "error",
        title: t("فشل إرسال الإشعار", "Failed to send notification"),
      });
    } finally {
      setSending(false);
    }
  };

  if (!userData?.campaignId) {
    return (
      <>
        <AppBar
          title={t("الإشعارات", "Notifications")}
          breadcrumbs={[
            { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
            { label: t("الإشعارات", "Notifications") },
          ]}
        />
        <Container className="sacred-pattern py-3 sm:py-6">
          <AlertBanner
            type="warning"
            title={t("لا توجد حملة مرتبطة", "No campaign linked")}
            description={t(
              "حسابك غير مرتبط بأي حملة. يرجى التواصل مع الدعم.",
              "Your account is not linked to any campaign. Please contact support."
            )}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar
        title={t("الإشعارات", "Notifications")}
        breadcrumbs={[
          { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
          { label: t("الإشعارات", "Notifications") },
        ]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Send Notification Form */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4">
            {t("إرسال إشعار جديد", "Send New Notification")}
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-label font-medium text-stone-700 dark:text-stone-200 mb-1.5 block">
                  {t("الرحلة", "Trip")}
                </label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card"
                >
                  <option value="">
                    {t("جميع الرحلات", "All Trips")}
                  </option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {language === "ar"
                        ? trip.titleAr || trip.title
                        : trip.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label font-medium text-stone-700 dark:text-stone-200 mb-1.5 block">
                  {t("المستلمون", "Recipients")}
                </label>
                <select
                  disabled
                  className="w-full rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md dark:border-surface-dark-border dark:bg-surface-dark-card opacity-60"
                >
                  <option value="all">
                    {t("جميع المسافرين", "All Travelers")}
                  </option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={t("العنوان (عربي)", "Title (Arabic)")}
                placeholder={t("عنوان الإشعار بالعربي", "Arabic notification title")}
                value={notifTitleAr}
                onChange={(e) => setNotifTitleAr(e.target.value)}
              />
              <Input
                label={t("العنوان (إنجليزي)", "Title (English)")}
                placeholder={t("عنوان الإشعار بالإنجليزي", "English notification title")}
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                dir="ltr"
              />
            </div>
            <Textarea
              label={t("نص الرسالة (عربي)", "Message Body (Arabic)")}
              placeholder={t("نص الرسالة بالعربي...", "Arabic message body...")}
              className="min-h-[80px]"
              value={notifBodyAr}
              onChange={(e) => setNotifBodyAr(e.target.value)}
            />
            <Textarea
              label={t("نص الرسالة (إنجليزي)", "Message Body (English)")}
              placeholder={t("نص الرسالة بالإنجليزي...", "English message body...")}
              className="min-h-[80px]"
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              dir="ltr"
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                leftIcon={
                  sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )
                }
                disabled={sending}
                onClick={handleSend}
              >
                {sending
                  ? t("جاري الإرسال...", "Sending...")
                  : t("إرسال", "Send")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Notification History */}
        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">
              {t("الإشعارات الواردة", "Incoming Notifications")}
            </h3>
            <p className="text-body-sm text-stone-500 dark:text-stone-400">
              {t(
                "الإشعارات المرسلة إلى حملتك من النظام",
                "System notifications sent to your campaign"
              )}
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-16 w-16" />}
              title={t("لا توجد إشعارات", "No Notifications")}
              description={t(
                "ستظهر هنا الإشعارات الواردة من النظام",
                "System notifications will appear here"
              )}
            />
          ) : (
            <div className="divide-y divide-surface-border/50 dark:divide-surface-dark-border/50">
              {notifications.map((notif) => {
                const date = parseTimestamp(notif.createdAt);
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      notif.isRead
                        ? ""
                        : "bg-blue-50/30 dark:bg-blue-900/10"
                    }`}
                  >
                    <span
                      className={`travel-icon-circle travel-icon-circle-sm shrink-0 mt-0.5 ${
                        notif.isRead
                          ? ""
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      {notif.isRead ? (
                        <CheckCircle2 className="h-4 w-4 text-stone-400" />
                      ) : (
                        <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-semibold text-stone-800 dark:text-white">
                        {language === "ar"
                          ? notif.titleAr || notif.title
                          : notif.title || notif.titleAr}
                      </p>
                      <p className="text-body-sm text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                        {language === "ar"
                          ? notif.bodyAr || notif.body
                          : notif.body || notif.bodyAr}
                      </p>
                      {date && (
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(
                            date,
                            language === "ar" ? "ar-KW" : "en-US"
                          )}
                        </p>
                      )}
                    </div>
                    {!notif.isRead && (
                      <Badge variant="info" size="sm">
                        {t("جديد", "New")}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
