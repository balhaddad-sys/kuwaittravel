"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <>
      <AppBar
        title="المستندات والكشوفات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "المستندات" }]}
      />
      <Container className="py-3 sm:py-6">
        <EmptyState
          icon={<FileText className="h-16 w-16" />}
          title="لا توجد مستندات"
          description="ستظهر هنا المستندات والكشوفات عند إنشاء رحلاتك"
        />
      </Container>
    </>
  );
}
