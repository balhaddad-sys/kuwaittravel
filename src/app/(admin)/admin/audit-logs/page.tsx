"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollText, User, Clock } from "lucide-react";

const mockLogs = [
  { id: "1", actor: "المشرف العام", action: "campaign.approve", target: "حملة النور", date: "2026-02-14 10:30" },
  { id: "2", actor: "محمد العلي", action: "trip.create", target: "رحلة كربلاء - أربعين", date: "2026-02-14 09:15" },
  { id: "3", actor: "المشرف العام", action: "dispute.resolve", target: "DSP-003", date: "2026-02-13 16:45" },
  { id: "4", actor: "أحمد الصالح", action: "booking.cancel", target: "BK-789", date: "2026-02-13 14:20" },
  { id: "5", actor: "المشرف العام", action: "payout.process", target: "حملة الهدى - 5000 د.ك", date: "2026-02-12 11:00" },
];

const actionLabels: Record<string, { ar: string; variant: "success" | "info" | "warning" | "error" }> = {
  "campaign.approve": { ar: "اعتماد حملة", variant: "success" },
  "trip.create": { ar: "إنشاء رحلة", variant: "info" },
  "dispute.resolve": { ar: "حل نزاع", variant: "success" },
  "booking.cancel": { ar: "إلغاء حجز", variant: "error" },
  "payout.process": { ar: "تحويل مبلغ", variant: "warning" },
};

export default function AuditLogsPage() {
  return (
    <>
      <AppBar title="سجل العمليات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "سجل العمليات" }]} />
      <Container className="py-6">
        <Card variant="outlined" padding="none">
          <div className="divide-y divide-surface-border dark:divide-surface-dark-border">
            {mockLogs.map((log) => {
              const al = actionLabels[log.action] || { ar: log.action, variant: "info" as const };
              return (
                <div key={log.id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-800 shrink-0">
                    <ScrollText className="h-4 w-4 text-navy-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-body-md font-medium text-navy-900 dark:text-white">{log.actor}</span>
                      <Badge variant={al.variant} size="sm">{al.ar}</Badge>
                      <span className="text-body-md text-navy-600 dark:text-navy-300">{log.target}</span>
                    </div>
                  </div>
                  <span className="text-body-sm text-navy-400 shrink-0 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {log.date}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </Container>
    </>
  );
}
