"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDirection } from "@/providers/DirectionProvider";
import { Save, Percent, Wallet } from "lucide-react";

export default function AdminSettingsPage() {
  const { t } = useDirection();
  const [savingSection, setSavingSection] = useState<"commission" | "payments" | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <AppBar title={t("إعدادات المنصة", "Platform Settings")} breadcrumbs={[{ label: t("المشرف العام", "Admin Console"), href: "/admin/dashboard" }, { label: t("الإعدادات", "Settings") }]} />
      <Container size="md" className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="eo-icon-circle eo-icon-circle-sm eo-icon-circle-sky">
              <Percent className="h-4 w-4" />
            </span>
            {t("إعدادات العمولة", "Commission Settings")}
          </h3>
          <Input label={t("نسبة العمولة الافتراضية (%)", "Default Commission Rate (%)")} type="number" defaultValue="2" dir="ltr" hint={t("النسبة المئوية من كل حجز", "Percentage of each booking")} />
          <hr className="eo-divider" />
          <Input label={t("عمولة الحملات الموثقة (%)", "Verified Campaign Rate (%)")} type="number" defaultValue="1.5" dir="ltr" />
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
            {t("حفظ", "Save")}
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="eo-icon-circle eo-icon-circle-sm eo-icon-circle-violet">
              <Wallet className="h-4 w-4" />
            </span>
            {t("إعدادات المدفوعات", "Payment Settings")}
          </h3>
          <Input label={t("جدول التحويلات", "Transfer Schedule")} defaultValue={t("كل خميس", "Every Thursday")} hint={t("متى يتم تحويل المبالغ للحملات", "When funds are transferred to campaigns")} />
          <hr className="eo-divider" />
          <Input label={t("الحد الأدنى للتحويل (د.ك)", "Minimum Transfer (KWD)")} type="number" defaultValue="50" dir="ltr" />
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
            {t("حفظ", "Save")}
          </Button>
        </Card>
      </Container>
    </div>
  );
}
