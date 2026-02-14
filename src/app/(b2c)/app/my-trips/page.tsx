"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Map, Calendar, MapPin, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatKWD } from "@/lib/utils/format";

const mockBookings = [
  { id: "BK001", trip: "كربلاء المقدسة - أربعين", destination: "كربلاء", departureDate: "2026-03-15", status: "confirmed", amount: 285 },
  { id: "BK002", trip: "عمرة رجب", destination: "مكة", departureDate: "2026-05-10", status: "pending_payment", amount: 650 },
];

const statusLabels: Record<string, { ar: string; variant: "success" | "warning" | "error" | "info" }> = {
  confirmed: { ar: "مؤكد", variant: "success" },
  pending_payment: { ar: "بانتظار الدفع", variant: "warning" },
  completed: { ar: "مكتمل", variant: "info" },
  cancelled: { ar: "ملغي", variant: "error" },
};

export default function MyTripsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <div className="bg-white dark:bg-surface-dark-card border-b border-surface-border dark:border-surface-dark-border px-4 pt-12 pb-4">
        <Container>
          <h1 className="text-display-md font-bold text-navy-900 dark:text-white">رحلاتي</h1>
          <div className="flex gap-2 mt-4">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-[var(--radius-chip)] text-body-sm font-medium transition-all ${
                  tab === t ? "bg-navy-700 text-white" : "bg-surface-muted text-navy-600 dark:bg-surface-dark-card dark:text-navy-300"
                }`}
              >
                {t === "upcoming" ? "القادمة" : "السابقة"}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {mockBookings.length > 0 ? (
          <div className="space-y-3">
            {mockBookings.map((booking) => {
              const statusInfo = statusLabels[booking.status] || statusLabels.confirmed;
              return (
                <Card key={booking.id} variant="elevated" padding="md" hoverable onClick={() => router.push(`/app/my-trips/${booking.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-navy-100 dark:bg-navy-800">
                      <MapPin className="h-6 w-6 text-navy-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-lg font-semibold text-navy-900 dark:text-white truncate">{booking.trip}</h3>
                      <div className="flex items-center gap-3 mt-1 text-body-sm text-navy-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {booking.departureDate}</span>
                        <Badge variant={statusInfo.variant} size="sm">{statusInfo.ar}</Badge>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-body-md font-bold text-navy-900 dark:text-white">{formatKWD(booking.amount)}</p>
                      <ChevronLeft className="h-4 w-4 text-navy-400 ms-auto mt-1 rtl:rotate-180" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Map className="h-16 w-16" />}
            title="لا توجد رحلات"
            description="ابدأ بتصفح الرحلات المتاحة واحجز رحلتك القادمة"
            action={{ label: "تصفح الرحلات", onClick: () => router.push("/app/discover") }}
          />
        )}
      </Container>
    </div>
  );
}
