"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title="المساعدة والدعم"
        breadcrumbs={[
          { label: "الملف الشخصي", href: "/app/profile" },
          { label: "المساعدة والدعم" },
        ]}
      />
      <Container className="py-6">
        <EmptyState
          icon={<HelpCircle className="h-16 w-16" />}
          title="قريبًا"
          description="ستتمكن قريبًا من الوصول إلى مركز المساعدة والدعم الفني"
          action={{
            label: "العودة للملف الشخصي",
            onClick: () => router.push("/app/profile"),
          }}
        />
      </Container>
    </div>
  );
}
