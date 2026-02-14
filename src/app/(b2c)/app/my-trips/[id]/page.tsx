"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
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
  { ar: string; variant: "success" | "warning" | "error" | "info" | "default" }
> = {
  pending_payment: { ar: "بانتظار الدفع", variant: "warning" },
  confirmed: { ar: "مؤكد", variant: "success" },
  partially_paid: { ar: "مدفوع جزئيًا", variant: "warning" },
  fully_paid: { ar: "مدفوع بالكامل", variant: "success" },
  checked_in: { ar: "تم تسجيل الوصول", variant: "info" },
  in_transit: { ar: "في الطريق", variant: "info" },
  completed: { ar: "مكتمل", variant: "default" },
  cancelled: { ar: "ملغي", variant: "error" },
  refunded: { ar: "مسترد", variant: "error" },
};

const statusIcons: Record<string, React.ReactNode> = {
  pending_payment: <Clock className="h-5 w-5" />,
  confirmed: <CheckCircle2 className="h-5 w-5" />,
  partially_paid: <AlertCircle className="h-5 w-5" />,
  fully_paid: <CheckCircle2 className="h-5 w-5" />,
  cancelled: <XCircle className="h-5 w-5" />,
  refunded: <XCircle className="h-5 w-5" />,
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const bookingData = await getDocument<Booking>(
          COLLECTIONS.BOOKINGS,
          id
        );
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="جاري التحميل..." />
        <Container className="py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
        <AppBar title="الحجز" />
        <EmptyState
          icon={<Receipt className="h-16 w-16" />}
          title="الحجز غير موجود"
          description="لم يتم العثور على هذا الحجز"
          action={{
            label: "العودة لرحلاتي",
            onClick: () => router.push("/app/my-trips"),
          }}
        />
      </div>
    );
  }

  const statusInfo = statusLabels[booking.status] || statusLabels.confirmed;

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title="تفاصيل الحجز"
        breadcrumbs={[
          { label: "رحلاتي", href: "/app/my-trips" },
          { label: booking.tripTitle },
        ]}
      />

      <Container className="py-6 space-y-6">
        {/* Booking Status */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
              {statusIcons[booking.status] || <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-heading-lg font-bold text-navy-900 dark:text-white">
                {booking.tripTitle}
              </h2>
              <Badge variant={statusInfo.variant} className="mt-1">
                {statusInfo.ar}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-navy-500">
            <span>رقم الحجز:</span>
            <span className="font-mono font-medium text-navy-700 dark:text-navy-200">
              {booking.id}
            </span>
          </div>
        </Card>

        {/* Passengers */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            المسافرون
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy-100 dark:bg-navy-800">
              <Users className="h-5 w-5 text-navy-600 dark:text-navy-300" />
            </div>
            <div>
              <p className="text-body-md font-medium text-navy-900 dark:text-white">
                {booking.numberOfPassengers} مسافر
              </p>
              <p className="text-body-sm text-navy-500">
                {booking.travelerName}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
            تفاصيل الدفع
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border">
              <span className="text-body-md text-navy-500">المبلغ الإجمالي</span>
              <span className="text-body-md font-bold text-navy-900 dark:text-white">
                {booking.totalKWD} د.ك
              </span>
            </div>
            {booking.discountKWD > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border">
                <span className="text-body-md text-navy-500">الخصم</span>
                <span className="text-body-md font-medium text-green-600 dark:text-green-400">
                  -{booking.discountKWD} د.ك
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border">
              <span className="text-body-md text-navy-500">المدفوع</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">
                {booking.paidKWD} د.ك
              </span>
            </div>
            {booking.remainingKWD > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-body-md text-navy-500">المتبقي</span>
                <span className="text-body-md font-bold text-error">
                  {booking.remainingKWD} د.ك
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Schedule */}
        {booking.paymentSchedule && booking.paymentSchedule.length > 0 && (
          <Card variant="outlined" padding="md">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
              جدول الدفع
            </h3>
            <div className="space-y-3">
              {booking.paymentSchedule.map((payment, index) => {
                const paymentDate = payment.dueDate
                  ? new Date(
                      (payment.dueDate as unknown as { seconds: number }).seconds * 1000
                    ).toLocaleDateString("ar-KW")
                  : "غير محدد";
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-surface-muted dark:bg-surface-dark"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-navy-400" />
                      <div>
                        <p className="text-body-sm font-medium text-navy-900 dark:text-white">
                          القسط {index + 1}
                        </p>
                        <p className="text-body-sm text-navy-500">
                          {paymentDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-body-sm font-bold text-navy-900 dark:text-white">
                        {payment.amountKWD} د.ك
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
                          ? "مدفوع"
                          : payment.status === "overdue"
                          ? "متأخر"
                          : "معلق"}
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
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-2">
              طلبات خاصة
            </h3>
            <p className="text-body-md text-navy-600 dark:text-navy-300">
              {booking.specialRequests}
            </p>
          </Card>
        )}
      </Container>
    </div>
  );
}
