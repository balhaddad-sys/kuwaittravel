"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Booking } from "@/types";
import {
  Users,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

const statusLabels: Record<
  string,
  { ar: string; en: string; variant: "success" | "warning" | "error" | "info" | "default" }
> = {
  pending_payment: { ar: "بانتظار الدفع", en: "Pending Payment", variant: "warning" },
  confirmed: { ar: "مؤكد", en: "Confirmed", variant: "success" },
  partially_paid: { ar: "مدفوع جزئيًا", en: "Partially Paid", variant: "warning" },
  fully_paid: { ar: "مدفوع بالكامل", en: "Fully Paid", variant: "success" },
  checked_in: { ar: "تم تسجيل الوصول", en: "Checked In", variant: "info" },
  in_transit: { ar: "في الطريق", en: "In Transit", variant: "info" },
  completed: { ar: "مكتمل", en: "Completed", variant: "default" },
  cancelled: { ar: "ملغي", en: "Cancelled", variant: "error" },
  refunded: { ar: "مسترد", en: "Refunded", variant: "error" },
};

const statusIcons: Record<string, React.ReactNode> = {
  pending_payment: <Clock className="h-5 w-5" />,
  confirmed: <CheckCircle2 className="h-5 w-5" />,
  partially_paid: <AlertCircle className="h-5 w-5" />,
  fully_paid: <CheckCircle2 className="h-5 w-5" />,
  cancelled: <XCircle className="h-5 w-5" />,
  refunded: <XCircle className="h-5 w-5" />,
};

function formatPaymentDate(dueDate: unknown, language: string): string {
  if (!dueDate || typeof dueDate !== "object") return language === "ar" ? "غير محدد" : "Not set";
  const ts = dueDate as { seconds: number };
  if (!ts.seconds) return language === "ar" ? "غير محدد" : "Not set";
  return new Date(ts.seconds * 1000).toLocaleDateString(
    language === "ar" ? "ar-KW" : "en-US"
  );
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t, language } = useDirection();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const bookingData = await getDocument<Booking>(COLLECTIONS.BOOKINGS, id);
        setBooking(bookingData);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("جاري التحميل...", "Loading...")} />
        <Container className="space-y-4 py-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
        <AppBar title={t("الحجز", "Booking")} />
        <EmptyState
          icon={<Receipt className="h-16 w-16" />}
          title={t("الحجز غير موجود", "Booking not found")}
          description={t("لم يتم العثور على هذا الحجز", "This booking could not be found")}
          action={{
            label: t("العودة لرحلاتي", "Back to My Trips"),
            onClick: () => router.push("/app/my-trips"),
          }}
        />
      </div>
    );
  }

  const statusInfo = statusLabels[booking.status] || statusLabels.confirmed;

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      <AppBar
        title={t("تفاصيل الحجز", "Booking Details")}
        breadcrumbs={[
          { label: t("رحلاتي", "My Trips"), href: "/app/my-trips" },
          { label: booking.tripTitle },
        ]}
      />

      <Container className="space-y-6 py-6">
        {/* Booking Status */}
        <Card variant="elevated" padding="lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-indigo-800 dark:text-indigo-300/60">
              {statusIcons[booking.status] || <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-heading-lg font-bold text-gray-900 dark:text-white">
                {booking.tripTitle}
              </h2>
              <Badge variant={statusInfo.variant} className="mt-1">
                {language === "ar" ? statusInfo.ar : statusInfo.en}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-gray-500">
            <span>{t("رقم الحجز:", "Booking ID:")}</span>
            <span className="font-mono font-medium text-gray-700 dark:text-indigo-100">
              {booking.id}
            </span>
          </div>
        </Card>

        {/* Passengers */}
        <Card variant="outlined" padding="md">
          <h3 className="mb-3 text-heading-sm font-bold text-gray-900 dark:text-white">
            {t("المسافرون", "Passengers")}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gray-100 dark:bg-indigo-800">
              <Users className="h-5 w-5 text-gray-600 dark:text-indigo-300/60" />
            </div>
            <div>
              <p className="text-body-md font-medium text-gray-900 dark:text-white">
                {booking.numberOfPassengers} {t("مسافر", "passengers")}
              </p>
              <p className="text-body-sm text-gray-500">
                {booking.travelerName}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card variant="outlined" padding="md">
          <h3 className="mb-3 text-heading-sm font-bold text-gray-900 dark:text-white">
            {t("تفاصيل الدفع", "Payment Details")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border py-2 dark:border-surface-dark-border">
              <span className="text-body-md text-gray-500">{t("المبلغ الإجمالي", "Total Amount")}</span>
              <span className="text-body-md font-bold text-gray-900 dark:text-white">
                {booking.totalKWD} {t("د.ك", "KWD")}
              </span>
            </div>
            {booking.discountKWD > 0 && (
              <div className="flex items-center justify-between border-b border-surface-border py-2 dark:border-surface-dark-border">
                <span className="text-body-md text-gray-500">{t("الخصم", "Discount")}</span>
                <span className="text-body-md font-medium text-green-600 dark:text-green-400">
                  -{booking.discountKWD} {t("د.ك", "KWD")}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-surface-border py-2 dark:border-surface-dark-border">
              <span className="text-body-md text-gray-500">{t("المدفوع", "Paid")}</span>
              <span className="text-body-md font-medium text-gray-900 dark:text-white">
                {booking.paidKWD} {t("د.ك", "KWD")}
              </span>
            </div>
            {booking.remainingKWD > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-body-md text-gray-500">{t("المتبقي", "Remaining")}</span>
                <span className="text-body-md font-bold text-error">
                  {booking.remainingKWD} {t("د.ك", "KWD")}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Schedule */}
        {booking.paymentSchedule && booking.paymentSchedule.length > 0 && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-3 text-heading-sm font-bold text-gray-900 dark:text-white">
              {t("جدول الدفع", "Payment Schedule")}
            </h3>
            <div className="space-y-3">
              {booking.paymentSchedule.map((payment, index) => {
                const paymentDate = formatPaymentDate(payment.dueDate, language);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-muted p-3 dark:bg-surface-dark"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-body-sm font-medium text-gray-900 dark:text-white">
                          {t(`القسط ${index + 1}`, `Installment ${index + 1}`)}
                        </p>
                        <p className="text-body-sm text-gray-500">
                          {paymentDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-body-sm font-bold text-gray-900 dark:text-white">
                        {payment.amountKWD} {t("د.ك", "KWD")}
                      </p>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "success"
                            : payment.status === "overdue"
                            ? "error"
                            : "warning"
                        }
                        size="sm"
                      >
                        {payment.status === "paid"
                          ? t("مدفوع", "Paid")
                          : payment.status === "overdue"
                          ? t("متأخر", "Overdue")
                          : t("معلق", "Pending")}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <Card variant="outlined" padding="md">
            <h3 className="mb-2 text-heading-sm font-bold text-gray-900 dark:text-white">
              {t("طلبات خاصة", "Special Requests")}
            </h3>
            <p className="text-body-md text-gray-600 dark:text-indigo-300/60">
              {booking.specialRequests}
            </p>
          </Card>
        )}
      </Container>
    </div>
  );
}
