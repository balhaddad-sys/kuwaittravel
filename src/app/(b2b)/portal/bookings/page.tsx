"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/forms/SearchInput";
import { BOOKING_STATUSES } from "@/lib/utils/constants";
import { formatKWD } from "@/lib/utils/format";

const mockBookings = [
  { id: "BK001", traveler: "أحمد محمد العلي", trip: "كربلاء المقدسة", date: "2026-02-10", amount: 285, passengers: 1, status: "fully_paid" as const },
  { id: "BK002", traveler: "فاطمة حسين", trip: "مشهد المقدسة", date: "2026-02-11", amount: 900, passengers: 2, status: "partially_paid" as const },
  { id: "BK003", traveler: "علي الحسيني", trip: "كربلاء المقدسة", date: "2026-02-12", amount: 285, passengers: 1, status: "pending_payment" as const },
  { id: "BK004", traveler: "زينب الموسوي", trip: "كربلاء المقدسة", date: "2026-02-12", amount: 570, passengers: 2, status: "confirmed" as const },
  { id: "BK005", traveler: "حسن الشمري", trip: "عمرة رجب", date: "2026-02-13", amount: 650, passengers: 1, status: "cancelled" as const },
];

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockBookings.filter(
    (b) => b.traveler.includes(searchQuery) || b.id.includes(searchQuery) || b.trip.includes(searchQuery)
  );

  return (
    <>
      <AppBar
        title="الحجوزات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الحجوزات" }]}
      />
      <Container className="py-6 space-y-4">
        <SearchInput placeholder="ابحث برقم الحجز أو اسم المسافر..." onSearch={setSearchQuery} />

        <Card variant="outlined" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border dark:border-surface-dark-border bg-surface-muted dark:bg-surface-dark-card">
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">رقم الحجز</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المسافر</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الرحلة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المبلغ</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المسافرون</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-dark-border">
                {filtered.map((booking) => {
                  const statusInfo = BOOKING_STATUSES[booking.status];
                  return (
                    <tr key={booking.id} className="hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-body-md font-mono text-navy-500">{booking.id}</td>
                      <td className="px-4 py-3 text-body-md font-medium text-navy-900 dark:text-white">{booking.traveler}</td>
                      <td className="px-4 py-3 text-body-md text-navy-600 dark:text-navy-300">{booking.trip}</td>
                      <td className="px-4 py-3 text-body-md font-semibold text-navy-900 dark:text-white" dir="ltr">{formatKWD(booking.amount)}</td>
                      <td className="px-4 py-3 text-body-md text-navy-600">{booking.passengers}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusInfo.color as "success" | "warning" | "error" | "info"} size="sm">
                          {statusInfo.nameAr}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </>
  );
}
