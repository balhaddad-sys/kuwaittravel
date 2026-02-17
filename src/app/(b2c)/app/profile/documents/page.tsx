"use client";

import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileUpload } from "@/components/forms/FileUpload";
import { ArrowRight, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <div className="bg-white dark:bg-surface-dark-card border-b border-surface-border dark:border-surface-dark-border px-4 pt-12 pb-4">
        <Container>
          <button onClick={() => router.back()} className="flex items-center gap-1 text-body-sm text-stone-500 mb-2">
            <ArrowRight className="h-4 w-4 rtl:rotate-180" /> رجوع
          </button>
          <h1 className="text-heading-lg font-bold text-stone-900 dark:text-white">المستندات والجوازات</h1>
          <p className="text-body-md text-stone-500 mt-1">خزنة مستنداتك المشفرة والآمنة</p>
        </Container>
      </div>

      <Container className="py-6 space-y-4">
        {/* Passport */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-stone-500" />
              <h3 className="text-heading-sm font-bold text-stone-900 dark:text-white">جواز السفر</h3>
            </div>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="h-3 w-3 me-1" /> مرفوع
            </Badge>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-surface-muted dark:bg-surface-dark-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-md font-medium text-stone-900 dark:text-white">جواز سفر - أحمد محمد العلي</p>
                <p className="text-body-sm text-stone-500">صالح حتى: 2028-06-15</p>
              </div>
              <Button variant="outline" size="sm">تحديث</Button>
            </div>
          </div>
        </Card>

        {/* Civil ID */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-stone-500" />
              <h3 className="text-heading-sm font-bold text-stone-900 dark:text-white">البطاقة المدنية</h3>
            </div>
            <Badge variant="warning" size="sm">
              <AlertCircle className="h-3 w-3 me-1" /> غير مرفوع
            </Badge>
          </div>
          <FileUpload
            accept="image/*,.pdf"
            onFilesChange={() => {}}
            hint="ارفع صورة البطاقة المدنية (الوجهان)"
          />
        </Card>

        {/* Photo */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-stone-500" />
              <h3 className="text-heading-sm font-bold text-stone-900 dark:text-white">صورة شخصية</h3>
            </div>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="h-3 w-3 me-1" /> مرفوع
            </Badge>
          </div>
          <p className="text-body-sm text-stone-500">صورة شخصية بخلفية بيضاء للتأشيرات</p>
        </Card>
      </Container>
    </div>
  );
}
