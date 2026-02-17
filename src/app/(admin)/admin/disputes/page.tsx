"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { AlertOctagon } from "lucide-react";

export default function DisputesPage() {
  const { t } = useDirection();
  const [filter, setFilter] = useState("all");

  return (
    <>
      <AppBar title={t("إدارة النزاعات", "Manage Disputes")} breadcrumbs={[{ label: t("المشرف العام", "Admin Console"), href: "/admin/dashboard" }, { label: t("النزاعات", "Disputes") }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { value: "all", label: t("الكل", "All") },
            { value: "open", label: t("مفتوحة", "Open") },
            { value: "resolved", label: t("محلولة", "Resolved") },
            { value: "escalated", label: t("مُصعدة", "Escalated") },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`travel-filter-chip shrink-0 px-3 py-1.5 text-body-sm font-medium ${filter === item.value ? "travel-filter-chip-active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Card variant="elevated" padding="none" className="travel-orbit-bg">
          <EmptyState
            icon={<AlertOctagon className="h-16 w-16" />}
            title={t("لا توجد نزاعات", "No Disputes")}
            description={t("ستظهر هنا النزاعات المرفوعة من المسافرين", "Traveler-filed disputes will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
