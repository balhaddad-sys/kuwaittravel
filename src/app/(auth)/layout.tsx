"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, PlaneTakeoff } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-8">
      <div className="pointer-events-none absolute -top-24 -start-16 h-72 w-72 rounded-full bg-gold-300/40 blur-2xl" />
      <div className="pointer-events-none absolute -top-20 -end-16 h-80 w-80 rounded-full bg-navy-300/40 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 start-1/3 h-64 w-64 rounded-full bg-info/15 blur-2xl" />

      <div className="relative mx-auto flex min-h-[94vh] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-surface-border/70 bg-white/76 px-4 py-2 shadow-card backdrop-blur-sm dark:border-surface-dark-border/70 dark:bg-surface-dark-card/72">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_6px_18px_rgba(229,128,29,0.35)]">
              <Compass className="h-4.5 w-4.5 text-white" />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-navy-700 dark:text-navy-100">Rahal</p>
              <p className="text-[11px] text-navy-500 dark:text-navy-300">
                {t("منصة سفر ثنائية اللغة", "Bilingual Travel Platform")}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <main className="mt-7 grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden rounded-3xl border border-surface-border/75 bg-white/76 p-8 shadow-card backdrop-blur-sm dark:border-surface-dark-border/80 dark:bg-surface-dark-card/76 lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-body-sm font-medium text-gold-700 dark:border-gold-700/50 dark:bg-gold-900/25 dark:text-gold-300">
              <PlaneTakeoff className="h-3.5 w-3.5" />
              {t("تجربة تسجيل دخول أكثر أناقة", "A Refined Sign-in Experience")}
            </div>
            <h1 className="mt-5 text-display-md font-extrabold text-navy-900 dark:text-white">
              {t("رحال للسفر الزياري", "Rahal Travel")}
            </h1>
            <p className="mt-3 max-w-xl text-body-lg text-navy-600 dark:text-navy-200">
              {t(
                "واجهة سلسة تدعم العربية والإنجليزية بشكل كامل، ومصممة خصيصًا لإدارة الرحلات الزيارية باحترافية.",
                "A smooth interface designed for pilgrimage travel operations, with full Arabic and English support."
              )}
            </p>
          </section>

          <div className="mx-auto w-full max-w-md">
            <PageTransition variant="auth">{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
