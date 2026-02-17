"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, PlaneTakeoff } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  return (
    <div className="sacred-pattern min-h-screen px-4 py-4 sm:px-8 sm:py-6">
      <div className="relative mx-auto flex min-h-[94vh] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-border/70 bg-white/76 px-3 py-1.5 shadow-card backdrop-blur-sm dark:border-surface-dark-border/70 dark:bg-surface-dark-card/72 sm:gap-3 sm:px-4 sm:py-2">
            <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-[0_6px_18px_rgba(30,58,95,0.25)]">
              <Compass className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-stone-700 dark:text-stone-100">Rahal</p>
              <p className="hidden text-[11px] text-stone-500 dark:text-stone-400 sm:block">
                {t("منصة سفر ثنائية اللغة", "Bilingual Travel Platform")}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <main className="mt-5 grid flex-1 items-center gap-8 sm:mt-7 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="sacred-section hidden p-8 lg:block">
            <div className="sacred-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-body-sm font-medium">
              <PlaneTakeoff className="h-3.5 w-3.5" />
              {t("تجربة تسجيل دخول أكثر أناقة", "A Refined Sign-in Experience")}
            </div>
            <h1 className="mt-5 text-display-md font-extrabold text-stone-900 dark:text-white">
              {t("رحال للسفر الزياري", "Rahal Travel")}
            </h1>
            <p className="mt-3 max-w-xl text-body-lg text-stone-600 dark:text-stone-200">
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
