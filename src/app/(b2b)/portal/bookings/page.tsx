"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { BookOpen } from "lucide-react";

export default function BookingsPage() {
  return (
    <>
      <AppBar
        title="الحجوزات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الحجوزات" }]}
      />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <SearchInput placeholder="ابحث برقم الحجز أو اسم المسافر..." onSearch={() => {}} />
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<BookOpen className="h-16 w-16" />}
            title="لا توجد حجوزات"
            description="ستظهر هنا الحجوزات عند قيام المسافرين بالحجز / New traveler bookings will appear here"
          />
        </Card>
      </Container>
    </>
  );
}
