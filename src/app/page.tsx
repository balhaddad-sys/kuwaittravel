"use client";

import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { Button } from "@/components/ui/Button";
import { PlaneTakeoff, Building2, Shield, Compass, Sparkles } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useDirection();

  const entryPoints = [
    {
      title: t("المسافرون", "Travelers"),
      subtitle: t("اكتشف الرحلات واحجزها خلال دقائق", "Discover and book trips in minutes"),
      icon: <PlaneTakeoff className="h-5 w-5 text-white" />,
      iconBg: "from-navy-500 to-navy-700",
      onClick: () => router.push("/app/discover"),
    },
    {
      title: t("بوابة الحملات", "Campaign Portal"),
      subtitle: t("إدارة الرحلات والحجوزات والوثائق", "Manage trips, bookings, and documents"),
      icon: <Building2 className="h-5 w-5 text-white" />,
      iconBg: "from-gold-500 to-gold-600",
      onClick: () => router.push("/portal/dashboard"),
    },
    {
      title: t("إدارة المشرفين", "Admin Console"),
      subtitle: t("دخول مخصص لفريق الإدارة", "Dedicated entry for administrators"),
      icon: <Shield className="h-5 w-5 text-white" />,
      iconBg: "from-navy-700 to-navy-900",
      onClick: () => router.push("/admin-login"),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-8">
      <div className="pointer-events-none absolute -top-24 -start-16 h-72 w-72 rounded-full bg-gold-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 -end-16 h-80 w-80 rounded-full bg-navy-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 start-1/3 h-64 w-64 rounded-full bg-info/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-surface-border/70 bg-white/75 px-4 py-2 shadow-card backdrop-blur-sm dark:border-surface-dark-border/70 dark:bg-surface-dark-card/72">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_6px_18px_rgba(229,128,29,0.35)]">
              <Compass className="h-4.5 w-4.5 text-white" />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-navy-700 dark:text-navy-100">Rahal Travel OS</p>
              <p className="text-[11px] text-navy-500 dark:text-navy-300">
                {t("منصة رحلات ثنائية اللغة", "Bilingual Travel Platform")}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-surface-border/75 bg-white/78 p-7 shadow-card backdrop-blur-sm dark:border-surface-dark-border/80 dark:bg-surface-dark-card/78 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-body-sm font-medium text-gold-700 dark:border-gold-700/50 dark:bg-gold-900/25 dark:text-gold-300">
              <Sparkles className="h-3.5 w-3.5" />
              {t("تجربة سفر أكثر أناقة", "Refined Travel Experience")}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy-900 dark:text-white sm:text-5xl">
              {t("رحال", "Rahal")}
            </h1>
            <p className="mt-3 max-w-2xl text-body-lg text-navy-600 dark:text-navy-200">
              {t(
                "بوابة سفر رقمية مصممة خصيصًا للرحلات الزيارية، مع واجهة متقنة تدعم العربية والإنجليزية بسلاسة كاملة.",
                "A premium travel operating system for pilgrimage journeys, crafted for seamless Arabic and English experiences."
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                leftIcon={<PlaneTakeoff className="h-4 w-4" />}
              >
                {t("ابدأ الآن", "Start Now")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/app/discover")}
              >
                {t("استكشاف الرحلات", "Explore Trips")}
              </Button>
            </div>
          </section>

          <section className="grid gap-3">
            {entryPoints.map((entry) => (
              <button
                key={entry.title}
                onClick={entry.onClick}
                className="group rounded-2xl border border-surface-border/80 bg-white/80 p-4 text-start shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-surface-dark-border/80 dark:bg-surface-dark-card/75"
              >
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${entry.iconBg} shadow-md`}>
                    {entry.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-lg font-bold text-navy-900 dark:text-white">{entry.title}</p>
                    <p className="mt-0.5 text-body-sm text-navy-500 dark:text-navy-300">{entry.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </section>
        </div>

        <div className="mt-auto pt-6 text-center">
          <p className="text-body-sm text-navy-500 dark:text-navy-300">
            Rahal v0.1.0
          </p>
          <p className="mt-1 text-[11px] text-navy-400 dark:text-navy-400">
            {t("مُهيأ للعربية والإنجليزية", "Built for Arabic and English")}
          </p>
        </div>
      </div>
    </div>
  );
}
