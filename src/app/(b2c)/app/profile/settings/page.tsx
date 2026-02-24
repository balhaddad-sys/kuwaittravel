"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDirection } from "@/providers/DirectionProvider";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Globe, Moon, Bell, LogOut, LogIn } from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${on ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700/50"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${on ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1 rtl:-translate-x-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useDirection();
  const { resolvedTheme, setTheme } = useTheme();
  const { firebaseUser, logout } = useAuth();
  const isDark = resolvedTheme === "dark";
  const [tripReminders, setTripReminders] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <AppBar
        title={t("الإعدادات", "Settings")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("الإعدادات", "Settings") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-4">
        {/* Language */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"><Globe className="h-4 w-4" /></span>
              <div>
                <p className="text-body-sm sm:text-body-md font-semibold text-slate-900 dark:text-white">{t("اللغة", "Language")}</p>
                <p className="text-xs text-slate-500">{t("عربي / English", "Arabic / English")}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </Card>

        {/* Dark Mode */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-200"><Moon className="h-4 w-4" /></span>
              <div>
                <p className="text-body-sm sm:text-body-md font-semibold text-slate-900 dark:text-white">{t("الوضع الداكن", "Dark Mode")}</p>
                <p className="text-xs text-slate-500">{isDark ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</p>
              </div>
            </div>
            <Toggle on={isDark} onToggle={() => setTheme(isDark ? "light" : "dark")} />
          </div>
        </Card>

        {/* Notifications */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#717171]" />
            {t("إعدادات الإشعارات", "Notification Preferences")}
          </h3>
          {[
            { labelAr: "تذكيرات الرحلات", labelEn: "Trip Reminders", value: tripReminders, set: setTripReminders },
            { labelAr: "تنبيهات المدفوعات", labelEn: "Payment Alerts", value: paymentAlerts, set: setPaymentAlerts },
            { labelAr: "العروض والتحديثات", labelEn: "Promotions", value: promotions, set: setPromotions },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-3 border-b border-surface-border/50 last:border-0 dark:border-surface-dark-border/50">
              <span className="text-body-sm text-slate-700 dark:text-slate-200">{t(item.labelAr, item.labelEn)}</span>
              <Toggle on={item.value} onToggle={() => item.set(!item.value)} />
            </div>
          ))}
        </Card>

        {/* Sign Out / Sign In */}
        {firebaseUser ? (
          <Button
            variant="ghost"
            fullWidth
            className="h-12 rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:bg-[#1E293B]/90 dark:text-red-400 dark:hover:bg-red-900/10"
            leftIcon={<LogOut className="h-[1.125rem] w-[1.125rem]" />}
            onClick={handleLogout}
          >
            {t("تسجيل الخروج", "Sign Out")}
          </Button>
        ) : (
          <Button
            variant="primary"
            fullWidth
            className="h-12 rounded-2xl"
            leftIcon={<LogIn className="h-[1.125rem] w-[1.125rem]" />}
            onClick={() => router.push("/login")}
          >
            {t("تسجيل الدخول", "Sign In")}
          </Button>
        )}
      </Container>
    </div>
  );
}
