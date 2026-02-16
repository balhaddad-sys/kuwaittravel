"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserPlus, Users } from "lucide-react";

export default function StaffPage() {
  return (
    <>
      <AppBar
        title="فريق العمل"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "فريق العمل" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
            إضافة عضو
          </Button>
        }
      />
      <Container className="travel-orbit-bg py-3 sm:py-6">
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title="لا يوجد أعضاء"
            description="أضف أعضاء فريقك لمساعدتك في إدارة الحملة / Invite teammates to support operations"
            action={{ label: "إضافة عضو", onClick: () => {} }}
          />
        </Card>
      </Container>
    </>
  );
}
