"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertOctagon } from "lucide-react";

export default function DisputesPage() {
  return (
    <>
      <AppBar title="إدارة النزاعات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "النزاعات" }]} />
      <Container className="py-3 sm:py-6">
        <EmptyState
          icon={<AlertOctagon className="h-16 w-16" />}
          title="لا توجد نزاعات"
          description="ستظهر هنا النزاعات المرفوعة من المسافرين"
        />
      </Container>
    </>
  );
}
