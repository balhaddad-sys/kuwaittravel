"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Percent, Wallet } from "lucide-react";

export default function AdminSettingsPage() {
  const [savingSection, setSavingSection] = useState<"commission" | "payments" | null>(null);

  return (
    <>
      <AppBar title="إعدادات المنصة" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "الإعدادات" }]} />
      <Container size="md" className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
              <Percent className="h-4 w-4" />
            </span>
            إعدادات العمولة
          </h3>
          <Input label="نسبة العمولة الافتراضية (%)" type="number" defaultValue="2" dir="ltr" hint="النسبة المئوية من كل حجز" />
          <hr className="travel-divider" />
          <Input label="عمولة الحملات الموثقة (%)" type="number" defaultValue="1.5" dir="ltr" />
          <Button
            variant="primary"
            fullWidth
            className="sm:w-auto"
            leftIcon={<Save className="h-4 w-4" />}
            loading={savingSection === "commission"}
            onClick={async () => {
              setSavingSection("commission");
              await new Promise((resolve) => setTimeout(resolve, 600));
              setSavingSection(null);
            }}
          >
            حفظ
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
              <Wallet className="h-4 w-4" />
            </span>
            إعدادات المدفوعات
          </h3>
          <Input label="جدول التحويلات" defaultValue="كل خميس" hint="متى يتم تحويل المبالغ للحملات" />
          <hr className="travel-divider" />
          <Input label="الحد الأدنى للتحويل (د.ك)" type="number" defaultValue="50" dir="ltr" />
          <Button
            variant="primary"
            fullWidth
            className="sm:w-auto"
            leftIcon={<Save className="h-4 w-4" />}
            loading={savingSection === "payments"}
            onClick={async () => {
              setSavingSection("payments");
              await new Promise((resolve) => setTimeout(resolve, 600));
              setSavingSection(null);
            }}
          >
            حفظ
          </Button>
        </Card>
      </Container>
    </>
  );
}
