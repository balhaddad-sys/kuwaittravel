"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet } from "lucide-react";

export default function PaymentMethodsPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title="طرق الدفع"
        breadcrumbs={[
          { label: "الملف الشخصي", href: "/app/profile" },
          { label: "طرق الدفع" },
        ]}
      />
      <Container className="py-6">
        <EmptyState
          icon={<Wallet className="h-16 w-16" />}
          title="قريبًا"
          description="ستتمكن قريبًا من إدارة طرق الدفع الخاصة بك"
          action={{
            label: "العودة للملف الشخصي",
            onClick: () => router.push("/app/profile"),
          }}
        />
      </Container>
    </div>
  );
}
