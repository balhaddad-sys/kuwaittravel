"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title="الأمان والخصوصية"
        breadcrumbs={[
          { label: "الملف الشخصي", href: "/app/profile" },
          { label: "الأمان والخصوصية" },
        ]}
      />
      <Container className="py-6">
        <EmptyState
          icon={<ShieldCheck className="h-16 w-16" />}
          title="قريبًا"
          description="ستتمكن قريبًا من إدارة إعدادات الأمان والخصوصية"
          action={{
            label: "العودة للملف الشخصي",
            onClick: () => router.push("/app/profile"),
          }}
        />
      </Container>
    </div>
  );
}
