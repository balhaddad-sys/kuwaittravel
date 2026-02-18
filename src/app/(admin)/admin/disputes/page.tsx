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
      <Container className="sacred-pattern overflow-visible py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className={`sacred-filter-chip shrink-0 px-3 py-1.5 text-body-sm font-medium ${filter === item.value ? "sacred-filter-chip-active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Card variant="elevated" padding="none" className="sacred-pattern">
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
