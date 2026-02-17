"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useDirection();

  return (
    <>
      <AppBar
        title={t("الإعدادات", "Settings")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الإعدادات", "Settings") }]}
      />
      <Container size="md" className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">{t("البيانات البنكية", "Bank Details")}</h3>
          <Input label={t("اسم البنك", "Bank Name")} placeholder={t("بنك الكويت الوطني", "National Bank of Kuwait")} />
          <Input label={t("رقم الآيبان", "IBAN Number")} placeholder="KW00XXXX..." dir="ltr" />
          <Input label={t("اسم صاحب الحساب", "Account Holder Name")} placeholder={t("الاسم كما يظهر في الحساب", "Name as it appears on the account")} />
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={() => toast({ type: "success", title: t("تم حفظ البيانات البنكية", "Bank details saved") })}>
            {t("حفظ", "Save")}
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">{t("إعدادات الإشعارات", "Notification Settings")}</h3>
          <div className="space-y-3">
            {[
              { label: t("إشعارات الحجوزات الجديدة", "New booking notifications"), checked: true },
              { label: t("إشعارات المدفوعات", "Payment notifications"), checked: true },
              { label: t("تنبيهات المستندات الناقصة", "Missing document alerts"), checked: true },
              { label: t("تقارير أسبوعية", "Weekly reports"), checked: false },
            ].map((setting, i) => (
              <label key={i} className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                <span className="text-body-sm sm:text-body-md text-navy-700 dark:text-navy-200">{setting.label}</span>
                <input type="checkbox" defaultChecked={setting.checked} className="h-5 w-5 shrink-0 rounded border-navy-300 text-navy-700" />
              </label>
            ))}
          </div>
        </Card>
      </Container>
    </>
  );
}
