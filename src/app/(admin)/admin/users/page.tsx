"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Users } from "lucide-react";
import { useState } from "react";
import { useDirection } from "@/providers/DirectionProvider";

export default function UsersPage() {
  const { t } = useDirection();
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <>
      <AppBar title={t("إدارة المستخدمين", "User Management")} breadcrumbs={[{ label: t("المشرف العام", "Admin"), href: "/admin/dashboard" }, { label: t("المستخدمون", "Users") }]} />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-4">
        <SearchInput placeholder={t("ابحث بالاسم أو رقم الهاتف...", "Search by name or phone number...")} onSearch={() => {}} />
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { value: "all", label: t("الكل", "All") },
            { value: "traveler", label: t("مسافر", "Traveler") },
            { value: "campaign_owner", label: t("صاحب حملة", "Campaign Owner") },
            { value: "campaign_staff", label: t("فريق الحملة", "Campaign Staff") },
            { value: "admin", label: t("مشرف", "Admin") },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setRoleFilter(filter.value)}
              className={`sacred-filter-chip shrink-0 px-3 py-1.5 text-body-sm font-medium ${roleFilter === filter.value ? "sacred-filter-chip-active" : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title={t("لا يوجد مستخدمون", "No users")}
            description={t("ستظهر هنا حسابات المسافرين وأصحاب الحملات مع حالة التحقق", "Traveler and campaign owner accounts with verification status will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
