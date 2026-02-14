"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserPlus, Users, MoreVertical } from "lucide-react";

const mockStaff = [
  { id: "1", name: "محمد علي", role: "manager", phone: "+965 9900 1111" },
  { id: "2", name: "أحمد حسين", role: "operator", phone: "+965 9900 2222" },
];

const roleLabels: Record<string, string> = {
  manager: "مدير",
  operator: "مشغل",
  viewer: "مشاهد",
};

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
      <Container className="py-6">
        {mockStaff.length > 0 ? (
          <div className="space-y-3">
            {mockStaff.map((member) => (
              <Card key={member.id} variant="outlined" padding="md">
                <div className="flex items-center gap-3">
                  <Avatar size="lg" />
                  <div className="flex-1">
                    <p className="text-body-md font-semibold text-navy-900 dark:text-white">{member.name}</p>
                    <p className="text-body-sm text-navy-500">{member.phone}</p>
                  </div>
                  <Badge variant="default">{roleLabels[member.role]}</Badge>
                  <button className="p-1.5 rounded-lg text-navy-400 hover:bg-surface-muted transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title="لا يوجد أعضاء"
            description="أضف أعضاء فريقك لمساعدتك في إدارة الحملة"
            action={{ label: "إضافة عضو", onClick: () => {} }}
          />
        )}
      </Container>
    </>
  );
}
