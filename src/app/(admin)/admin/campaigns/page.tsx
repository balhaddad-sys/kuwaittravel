"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Building2 } from "lucide-react";
import { useDirection } from "@/providers/DirectionProvider";

export default function AdminCampaignsPage() {
  const { t } = useDirection();
  const [filter, setFilter] = useState("all");

  return (
    <>
      <AppBar title={t("إدارة الحملات", "Campaign Management")} breadcrumbs={[{ label: t("المشرف العام", "Admin"), href: "/admin/dashboard" }, { label: t("الحملات", "Campaigns") }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput placeholder={t("ابحث بالاسم أو المالك...", "Search by name or owner...")} onSearch={() => {}} className="flex-1" />
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { value: "all", label: t("الكل", "All"), count: 0 },
              { value: "pending", label: t("قيد المراجعة", "Under Review"), count: 0 },
              { value: "approved", label: t("معتمد", "Approved"), count: 0 },
              { value: "rejected", label: t("مرفوض", "Rejected"), count: 0 },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`travel-filter-chip shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-body-sm font-medium ${filter === f.value ? "travel-filter-chip-active" : ""}`}
              >
                <span>{f.label}</span>
                <Badge variant={filter === f.value ? "default" : "gold"} size="sm">
                  {f.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Building2 className="h-16 w-16" />}
            title={t("لا توجد حملات", "No campaigns")}
            description={t("ستظهر هنا الحملات المسجلة في المنصة", "Registered campaigns will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
