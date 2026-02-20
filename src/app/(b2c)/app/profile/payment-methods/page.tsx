"use client";

import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDirection } from "@/providers/DirectionProvider";
import { CreditCard, Banknote, Building2, ShieldCheck } from "lucide-react";

export default function PaymentMethodsPage() {
  const { t } = useDirection();

  const methods = [
    { nameAr: "كي نت (KNET)", nameEn: "KNET", descAr: "الدفع المباشر من حسابك البنكي الكويتي", descEn: "Direct payment from your Kuwaiti bank account", icon: Banknote, available: true },
    { nameAr: "فيزا / ماستركارد", nameEn: "Visa / Mastercard", descAr: "الدفع ببطاقة الائتمان أو السحب الآلي", descEn: "Pay with credit or debit card", icon: CreditCard, available: true },
    { nameAr: "تحويل بنكي", nameEn: "Bank Transfer", descAr: "التحويل المباشر إلى حساب الحملة", descEn: "Direct transfer to campaign account", icon: Building2, available: true },
  ];

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title={t("طرق الدفع", "Payment Methods")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("طرق الدفع", "Payments") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-4">
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4">
            {t("طرق الدفع المدعومة", "Supported Payment Methods")}
          </h3>
          <div className="space-y-3">
            {methods.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-surface-border/70 p-3 dark:border-surface-dark-border/70">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                  <m.icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-bold text-gray-900 dark:text-white">{t(m.nameAr, m.nameEn)}</p>
                  <p className="text-xs text-gray-500 dark:text-indigo-300/60">{t(m.descAr, m.descEn)}</p>
                </div>
                <Badge variant="success" size="sm">{t("متاح", "Available")}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="outlined" padding="lg" className="border-orange-300/50 dark:border-orange-800/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
            <div>
              <p className="text-body-sm font-bold text-gray-900 dark:text-white mb-1">{t("دفع آمن ومشفر", "Secure & Encrypted")}</p>
              <p className="text-body-sm text-gray-600 dark:text-indigo-300/60 leading-relaxed">
                {t(
                  "يتم الدفع مباشرة عند حجز الرحلة عبر بوابة دفع آمنة. لا نقوم بتخزين بيانات بطاقتك — كل عملية دفع تتم عبر بوابة مشفرة.",
                  "Payment is processed at booking time via a secure gateway. We do not store your card details — every transaction goes through an encrypted gateway."
                )}
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
