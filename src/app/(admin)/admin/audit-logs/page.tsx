"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollText } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <>
      <AppBar title="سجل العمليات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "سجل العمليات" }]} />
      <Container className="py-3 sm:py-6">
        <Card variant="outlined" padding="none">
          <EmptyState
            icon={<ScrollText className="h-16 w-16" />}
            title="لا توجد عمليات"
            description="ستظهر هنا سجلات العمليات والتغييرات في المنصة"
          />
        </Card>
      </Container>
    </>
  );
}
