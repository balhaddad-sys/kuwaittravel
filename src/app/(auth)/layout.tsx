"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, PlaneTakeoff, MapPin, Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-8 sm:py-6">
      {/* Warm travel background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#FEFCF8] to-[#FFFBEB] dark:from-[#0C1222] dark:via-[#101828] dark:to-[#0C1222]" />
      <div className="absolute left-0 top-0 h-[50%] w-[60%] bg-gradient-to-br from-teal-100/30 to-transparent dark:from-teal-900/10" />
      <div className="absolute bottom-0 right-0 h-[40%] w-[50%] bg-gradient-to-tl from-amber-100/25 to-transparent dark:from-amber-900/8" />

      <div className="relative mx-auto flex min-h-[94vh] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-border/70 bg-white/76 px-3 py-1.5 shadow-card backdrop-blur-sm dark:border-surface-dark-border/70 dark:bg-surface-dark-card/72 sm:gap-3 sm:px-4 sm:py-2">
            <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-[0_6px_18px_rgba(37,99,235,0.25)]">
              <Compass className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-stone-700 dark:text-stone-100">Rahal</p>
              <p className="hidden text-[11px] text-stone-500 dark:text-stone-400 sm:block">
                {t("رحلات زيارية", "Pilgrimage Travel")}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <main className="mt-5 grid flex-1 items-center gap-8 sm:mt-7 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden p-8 lg:block">
            {/* Decorative travel destinations */}
            <div className="mb-8 flex gap-3">
              {[
                { icon: <MapPin className="h-3.5 w-3.5" />, label: t("مكة", "Makkah") },
                { icon: <Star className="h-3.5 w-3.5" />, label: t("المدينة", "Madinah") },
                { icon: <PlaneTakeoff className="h-3.5 w-3.5" />, label: t("كربلاء", "Karbala") },
              ].map((dest) => (
                <span
                  key={dest.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-white/80 px-3 py-1 text-body-sm font-medium text-stone-600 dark:border-surface-dark-border dark:bg-surface-dark-card/80 dark:text-stone-300"
                >
                  {dest.icon}
                  {dest.label}
                </span>
              ))}
            </div>

            <h1 className="text-display-md font-extrabold text-stone-900 dark:text-white">
              {t("رحال للسفر الزياري", "Rahal Travel")}
            </h1>
            <p className="mt-3 max-w-xl text-body-lg text-stone-600 dark:text-stone-200">
              {t(
                "اكتشف واحجز رحلات الحج والعمرة والزيارات من حملات موثقة — تجربة حجز سلسة باللغتين.",
                "Discover and book Hajj, Umrah, and Ziyarat trips from verified campaigns — a seamless bilingual booking experience."
              )}
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex items-center gap-4 text-body-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Star className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </span>
                {t("20+ حملة موثقة", "20+ verified campaigns")}
              </span>
              <span className="h-4 w-px bg-surface-border dark:bg-surface-dark-border" />
              <span className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <PlaneTakeoff className="h-3 w-3 text-teal-700 dark:text-teal-400" />
                </span>
                {t("50+ رحلة", "50+ trips")}
              </span>
            </div>
          </section>

          <div className="mx-auto w-full max-w-md">
            <PageTransition variant="auth">{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
