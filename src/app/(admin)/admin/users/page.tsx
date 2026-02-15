"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { Users } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <AppBar title="إدارة المستخدمين" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المستخدمون" }]} />
      <Container className="py-3 sm:py-6 space-y-3 sm:space-y-4">
        <SearchInput placeholder="ابحث بالاسم أو رقم الهاتف..." onSearch={setSearch} />
        <Card variant="outlined" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title="لا يوجد مستخدمون"
            description="سيظهر هنا المستخدمون المسجلون في المنصة"
          />
        </Card>
      </Container>
    </>
  );
}
