"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Building2 } from "lucide-react";

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <>
      <AppBar title="إدارة الحملات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "الحملات" }]} />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput placeholder="ابحث بالاسم أو المالك..." onSearch={setSearch} className="flex-1" />
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { value: "all", label: "الكل" },
              { value: "pending", label: "قيد المراجعة" },
              { value: "approved", label: "معتمد" },
              { value: "rejected", label: "مرفوض" },
            ].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`shrink-0 px-3 sm:px-4 py-2 rounded-[var(--radius-chip)] text-body-sm font-medium transition-all ${
                  filter === f.value ? "bg-navy-700 text-white" : "bg-surface-muted text-navy-600 dark:bg-surface-dark-card"
                }`}>{f.label}</button>
            ))}
          </div>
        </div>

        <Card variant="outlined" padding="none">
          <EmptyState
            icon={<Building2 className="h-16 w-16" />}
            title="لا توجد حملات"
            description="ستظهر هنا الحملات المسجلة في المنصة"
          />
        </Card>
      </Container>
    </>
  );
}
