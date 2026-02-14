"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertOctagon, MessageSquare, Clock, User } from "lucide-react";

const mockDisputes = [
  { id: "DSP-001", subject: "طلب استرداد - جودة الخدمة", traveler: "أحمد العلي", campaign: "حملة النور", amount: 285, status: "open", date: "2026-02-10", messages: 3 },
  { id: "DSP-002", subject: "عدم تطابق الغرفة مع الوصف", traveler: "فاطمة حسين", campaign: "حملة الهدى", amount: 450, status: "under_review", date: "2026-02-08", messages: 7 },
  { id: "DSP-003", subject: "إلغاء الرحلة بدون إخطار", traveler: "حسن الشمري", campaign: "حملة السلام", amount: 650, status: "resolved", date: "2026-01-25", messages: 12 },
];

const statusConfig: Record<string, { ar: string; variant: "error" | "warning" | "success" }> = {
  open: { ar: "مفتوح", variant: "error" },
  under_review: { ar: "قيد المراجعة", variant: "warning" },
  resolved: { ar: "تم الحل", variant: "success" },
};

export default function DisputesPage() {
  return (
    <>
      <AppBar title="إدارة النزاعات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "النزاعات" }]} />
      <Container className="py-6 space-y-4">
        {mockDisputes.map((dispute) => {
          const sc = statusConfig[dispute.status];
          return (
            <Card key={dispute.id} variant="elevated" padding="lg" hoverable>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light shrink-0">
                    <AlertOctagon className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-lg font-semibold text-navy-900 dark:text-white">{dispute.subject}</h3>
                      <Badge variant={sc.variant} size="sm">{sc.ar}</Badge>
                    </div>
                    <p className="text-body-sm text-navy-500 mb-2">{dispute.id}</p>
                    <div className="flex flex-wrap items-center gap-4 text-body-sm text-navy-500">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {dispute.traveler}</span>
                      <span>ضد {dispute.campaign}</span>
                      <span className="font-medium">{dispute.amount} د.ك</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {dispute.date}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {dispute.messages} رسالة</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </Container>
    </>
  );
}
