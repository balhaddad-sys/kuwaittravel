"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, FolderArchive, Table, FileSpreadsheet } from "lucide-react";

const mockTripsForDocs = [
  { id: "1", name: "كربلاء المقدسة - أربعين", passengers: 38, docsComplete: 32, departure: "2026-03-15" },
  { id: "2", name: "مشهد المقدسة", passengers: 12, docsComplete: 8, departure: "2026-04-01" },
];

export default function DocumentsPage() {
  return (
    <>
      <AppBar
        title="المستندات والكشوفات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "المستندات" }]}
      />
      <Container className="py-6 space-y-6">
        {mockTripsForDocs.map((trip) => (
          <Card key={trip.id} variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">{trip.name}</h3>
                <p className="text-body-sm text-navy-500 mt-1">
                  المغادرة: {trip.departure} | المستندات: {trip.docsComplete}/{trip.passengers} مكتملة
                </p>
              </div>
              <Badge variant={trip.docsComplete === trip.passengers ? "success" : "warning"}>
                {trip.docsComplete === trip.passengers ? "مكتمل" : "ناقص"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "كشف المنفذ (PDF)", icon: FileText, desc: "كشف رسمي للحدود" },
                { label: "كشف الركاب (Excel)", icon: FileSpreadsheet, desc: "جدول بيانات" },
                { label: "نسخ الجوازات (ZIP)", icon: FolderArchive, desc: "صور الجوازات مسماة" },
                { label: "توزيع الغرف", icon: Table, desc: "قائمة توزيع الغرف" },
              ].map((doc, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-surface-border dark:border-surface-dark-border p-3 text-start hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors"
                >
                  <doc.icon className="h-5 w-5 text-navy-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-navy-700 dark:text-navy-200 truncate">{doc.label}</p>
                    <p className="text-[11px] text-navy-400">{doc.desc}</p>
                  </div>
                  <Download className="h-4 w-4 text-navy-400 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        ))}
      </Container>
    </>
  );
}
