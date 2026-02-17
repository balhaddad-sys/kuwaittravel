"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { UserPlus, Users } from "lucide-react";

export default function StaffPage() {
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("فريق العمل", "Team")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("فريق العمل", "Team") }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
            {t("إضافة عضو", "Add Member")}
          </Button>
        }
      />
      <Container className="sacred-pattern py-3 sm:py-6">
        <Card variant="elevated" padding="none">
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title={t("لا يوجد أعضاء", "No Members")}
            description={t("أضف أعضاء فريقك لمساعدتك في إدارة الحملة", "Invite teammates to support operations")}
            action={{ label: t("إضافة عضو", "Add Member"), onClick: () => {} }}
          />
        </Card>
      </Container>
    </>
  );
}
