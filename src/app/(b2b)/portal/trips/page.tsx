"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TripCard } from "@/components/shared/TripCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { FAB } from "@/components/ui/FAB";
import { Plus, Map, Filter } from "lucide-react";

const mockTrips = [
  { id: "1", title: "رحلة كربلاء المقدسة - أربعين", destination: "كربلاء", departureDate: "2026-03-15", returnDate: "2026-03-20", price: 285, capacity: 45, booked: 38, status: "active" as const },
  { id: "2", title: "رحلة مشهد المقدسة", destination: "مشهد", departureDate: "2026-04-01", returnDate: "2026-04-05", price: 450, capacity: 30, booked: 12, status: "active" as const },
  { id: "3", title: "عمرة رجب", destination: "مكة", departureDate: "2026-05-10", returnDate: "2026-05-17", price: 650, capacity: 50, booked: 50, status: "completed" as const },
  { id: "4", title: "زيارة النجف الأشرف", destination: "النجف", departureDate: "2026-02-20", returnDate: "2026-02-23", price: 180, capacity: 40, booked: 40, status: "completed" as const },
];

export default function TripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch = trip.title.includes(searchQuery) || trip.destination.includes(searchQuery);
    const matchesFilter = filter === "all" || trip.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <AppBar
        title="الرحلات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الرحلات" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            رحلة جديدة
          </Button>
        }
      />

      <Container className="py-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="ابحث في الرحلات..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          <div className="flex gap-2">
            {[
              { value: "all", label: "الكل" },
              { value: "active", label: "نشطة" },
              { value: "draft", label: "مسودة" },
              { value: "completed", label: "مكتملة" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-[var(--radius-chip)] text-body-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-navy-700 text-white"
                    : "bg-surface-muted text-navy-600 hover:bg-navy-100 dark:bg-surface-dark-card dark:text-navy-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                onClick={() => router.push(`/portal/trips/${trip.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Map className="h-16 w-16" />}
            title="لا توجد رحلات"
            description={searchQuery ? "لم يتم العثور على نتائج مطابقة" : "ابدأ بإنشاء رحلتك الأولى"}
            action={!searchQuery ? { label: "إنشاء رحلة", onClick: () => router.push("/portal/trips/create") } : undefined}
          />
        )}
      </Container>

      <FAB icon={<Plus className="h-6 w-6" />} onClick={() => router.push("/portal/trips/create")} />
    </>
  );
}
