"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title="الإعدادات"
        breadcrumbs={[
          { label: "الملف الشخصي", href: "/app/profile" },
          { label: "الإعدادات" },
        ]}
      />
      <Container className="py-6">
        <EmptyState
          icon={<Settings className="h-16 w-16" />}
          title="قريبًا"
          description="ستتمكن قريبًا من تخصيص إعدادات التطبيق"
          action={{
            label: "العودة للملف الشخصي",
            onClick: () => router.push("/app/profile"),
          }}
        />
      </Container>
    </div>
  );
}
