"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <>
      <AppBar title="إعدادات المنصة" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "الإعدادات" }]} />
      <Container size="md" className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">إعدادات العمولة</h3>
          <Input label="نسبة العمولة الافتراضية (%)" type="number" defaultValue="2" dir="ltr" hint="النسبة المئوية من كل حجز" />
          <Input label="عمولة الحملات الموثقة (%)" type="number" defaultValue="1.5" dir="ltr" />
          <Button variant="primary" fullWidth className="sm:w-auto" leftIcon={<Save className="h-4 w-4" />}>حفظ</Button>
        </Card>

        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">إعدادات المدفوعات</h3>
          <Input label="جدول التحويلات" defaultValue="كل خميس" hint="متى يتم تحويل المبالغ للحملات" />
          <Input label="الحد الأدنى للتحويل (د.ك)" type="number" defaultValue="50" dir="ltr" />
          <Button variant="primary" fullWidth className="sm:w-auto" leftIcon={<Save className="h-4 w-4" />}>حفظ</Button>
        </Card>
      </Container>
    </>
  );
}
