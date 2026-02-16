"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertOctagon } from "lucide-react";

export default function DisputesPage() {
  const [filter, setFilter] = useState("all");

  return (
    <>
      <AppBar title="إدارة النزاعات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "النزاعات" }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "الكل" },
            { value: "open", label: "مفتوحة" },
            { value: "resolved", label: "محلولة" },
            { value: "escalated", label: "مُصعدة" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`travel-filter-chip px-3 py-1.5 text-body-sm font-medium ${filter === item.value ? "travel-filter-chip-active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Card variant="elevated" padding="none" className="travel-orbit-bg">
          <EmptyState
            icon={<AlertOctagon className="h-16 w-16" />}
            title="لا توجد نزاعات"
            description="ستظهر هنا النزاعات المرفوعة من المسافرين"
          />
        </Card>
      </Container>
    </>
  );
}
