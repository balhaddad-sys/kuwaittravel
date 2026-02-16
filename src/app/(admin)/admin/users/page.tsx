"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Users } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <>
      <AppBar title="إدارة المستخدمين" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المستخدمون" }]} />
      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-4">
        <SearchInput placeholder="ابحث بالاسم أو رقم الهاتف..." onSearch={() => {}} />
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { value: "all", label: "الكل" },
            { value: "traveler", label: "مسافر" },
            { value: "campaign_owner", label: "صاحب حملة" },
            { value: "campaign_staff", label: "فريق الحملة" },
            { value: "admin", label: "مشرف" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setRoleFilter(filter.value)}
              className={`travel-filter-chip shrink-0 px-3 py-1.5 text-body-sm font-medium ${roleFilter === filter.value ? "travel-filter-chip-active" : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title="لا يوجد مستخدمون"
            description="ستظهر هنا حسابات المسافرين وأصحاب الحملات مع حالة التحقق"
          />
        </Card>
      </Container>
    </>
  );
}
