"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { useDirection } from "@/providers/DirectionProvider";
import { BookOpen } from "lucide-react";

export default function BookingsPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("الحجوزات", "Bookings")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الحجوزات", "Bookings") }]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-4">
        <SearchInput placeholder={t("ابحث برقم الحجز أو اسم المسافر...", "Search by booking ID or traveler name...")} onSearch={() => {}} />
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<BookOpen className="h-16 w-16" />}
            title={t("لا توجد حجوزات", "No Bookings")}
            description={t("ستظهر هنا الحجوزات عند قيام المسافرين بالحجز", "New traveler bookings will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
