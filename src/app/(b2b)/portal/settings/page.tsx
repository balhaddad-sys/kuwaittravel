"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/feedback/ToastProvider";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();

  return (
    <>
      <AppBar
        title="الإعدادات"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الإعدادات" }]}
      />
      <Container size="md" className="travel-orbit-bg py-6 space-y-6">
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">البيانات البنكية</h3>
          <Input label="اسم البنك" placeholder="بنك الكويت الوطني" />
          <Input label="رقم الآيبان" placeholder="KW00XXXX..." dir="ltr" />
          <Input label="اسم صاحب الحساب" placeholder="الاسم كما يظهر في الحساب" />
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={() => toast({ type: "success", title: "تم حفظ البيانات البنكية" })}>
            حفظ
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">إعدادات الإشعارات</h3>
          <div className="space-y-3">
            {[
              { label: "إشعارات الحجوزات الجديدة", checked: true },
              { label: "إشعارات المدفوعات", checked: true },
              { label: "تنبيهات المستندات الناقصة", checked: true },
              { label: "تقارير أسبوعية", checked: false },
            ].map((setting, i) => (
              <label key={i} className="flex items-center justify-between py-2">
                <span className="text-body-md text-navy-700 dark:text-navy-200">{setting.label}</span>
                <input type="checkbox" defaultChecked={setting.checked} className="h-5 w-5 rounded border-navy-300 text-navy-700" />
              </label>
            ))}
          </div>
        </Card>
      </Container>
    </>
  );
}
