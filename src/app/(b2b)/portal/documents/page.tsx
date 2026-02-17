"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("المستندات والكشوفات", "Documents & Statements")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("المستندات", "Documents") }]}
      />
      <Container className="sacred-pattern py-3 sm:py-6">
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<FileText className="h-16 w-16" />}
            title={t("لا توجد مستندات", "No Documents")}
            description={t("ستظهر هنا المستندات والكشوفات عند إنشاء رحلاتك", "Generated documents will appear here")}
          />
        </Card>
      </Container>
    </>
  );
}
