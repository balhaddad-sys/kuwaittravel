"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { useDirection } from "@/providers/DirectionProvider";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useTheme } from "@/providers/ThemeProvider";
import { Globe, Moon, Bell } from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${on ? "bg-amber-500" : "bg-stone-300 dark:bg-slate-600"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${on ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1 rtl:-translate-x-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { t } = useDirection();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [tripReminders, setTripReminders] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title={t("الإعدادات", "Settings")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("الإعدادات", "Settings") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-4">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Globe className="h-4 w-4" /></span>
              <div>
                <p className="text-body-sm sm:text-body-md font-semibold text-stone-900 dark:text-white">{t("اللغة", "Language")}</p>
                <p className="text-xs text-stone-500">{t("عربي / English", "Arabic / English")}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600 dark:bg-slate-700 dark:text-slate-300"><Moon className="h-4 w-4" /></span>
              <div>
                <p className="text-body-sm sm:text-body-md font-semibold text-stone-900 dark:text-white">{t("الوضع الداكن", "Dark Mode")}</p>
                <p className="text-xs text-stone-500">{isDark ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</p>
              </div>
            </div>
            <Toggle on={isDark} onToggle={() => setTheme(isDark ? "light" : "dark")} />
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            {t("إعدادات الإشعارات", "Notification Preferences")}
          </h3>
          {[
            { labelAr: "تذكيرات الرحلات", labelEn: "Trip Reminders", value: tripReminders, set: setTripReminders },
            { labelAr: "تنبيهات المدفوعات", labelEn: "Payment Alerts", value: paymentAlerts, set: setPaymentAlerts },
            { labelAr: "العروض والتحديثات", labelEn: "Promotions", value: promotions, set: setPromotions },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-3 border-b border-surface-border/50 last:border-0 dark:border-surface-dark-border/50">
              <span className="text-body-sm text-stone-700 dark:text-stone-300">{t(item.labelAr, item.labelEn)}</span>
              <Toggle on={item.value} onToggle={() => item.set(!item.value)} />
            </div>
          ))}
        </Card>
      </Container>
    </div>
  );
}
