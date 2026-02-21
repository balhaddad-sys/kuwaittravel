"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, PlaneTakeoff, MapPin, Star, BadgeCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Full-bleed gradient left panel (desktop) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:start-0 lg:flex lg:w-[52%] lg:flex-col lg:overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0C4A6E] to-[#4C1D95]" />
        {/* Violet radial glow */}
        <div className="absolute inset-0 opacity-100" style={{background:"radial-gradient(ellipse 70% 50% at 60% 30%, rgba(139,92,246,0.1) 0%, transparent 65%)"}} />
        {/* Decorative orbs */}
        <div className="absolute -top-32 -start-32 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute top-1/3 -end-20 h-64 w-64 rounded-full bg-violet-400/12 blur-3xl" />
        <div className="absolute bottom-10 start-10 h-48 w-48 rounded-full bg-sky-300/15 blur-2xl" />

        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-inner"
              style={{background:"linear-gradient(135deg, #0EA5E9, #8B5CF6)", boxShadow:"0 4px 12px rgba(139,92,246,0.35)"}}
            >
              <Compass className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-bold text-white">Rahal</p>
              <p className="text-xs" style={{color:"rgba(139,92,246,0.8)"}}>{t("رحلات زيارية", "Pilgrimage Travel")}</p>
            </div>
          </div>

          {/* Marketing copy */}
          <div>
            <div className="mb-6 flex gap-2">
              {[
                { icon: <MapPin className="h-3 w-3" />, label: t("مكة", "Makkah") },
                { icon: <Star className="h-3 w-3" />, label: t("المدينة", "Madinah") },
                { icon: <PlaneTakeoff className="h-3 w-3" />, label: t("كربلاء", "Karbala") },
              ].map((dest) => (
                <span
                  key={dest.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {dest.icon}
                  {dest.label}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
              {t("سفرك الزياري\nيبدأ هنا", "Your Pilgrimage\nJourney Starts Here")}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-sky-100">
              {t(
                "اكتشف واحجز رحلات الحج والعمرة والزيارات من حملات موثوقة — تجربة حجز سهلة ومضمونة.",
                "Discover and book Hajj, Umrah & Ziyarat trips from verified campaigns — seamless, trusted, bilingual."
              )}
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-5">
              <div className="flex items-center gap-2 text-sm text-sky-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/20">
                  <BadgeCheck className="h-3.5 w-3.5 text-sky-300" />
                </span>
                {t("20+ حملة موثقة", "20+ verified campaigns")}
              </div>
              <span className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2 text-sm text-sky-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <PlaneTakeoff className="h-3.5 w-3.5 text-white" />
                </span>
                {t("50+ رحلة", "50+ trips")}
              </div>
            </div>
          </div>

          {/* Bottom testimonial-style quote */}
          <blockquote className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-white/90">
              {t(
                "\"منصة رائعة ومنظمة — حجزت رحلة العمرة في دقائق وكل شيء كان واضحاً من البداية.\"",
                "\"Amazing and organized — I booked my Umrah trip in minutes, everything was crystal clear from the start.\""
              )}
            </p>
            <footer className="mt-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">م</span>
              <div>
                <p className="text-xs font-semibold text-white">{t("محمد الكويتي", "Mohammed Al-Kuwaiti")}</p>
                <p className="text-[11px] text-sky-200">{t("مسافر موثق", "Verified traveler")}</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form area */}
      <div className="flex min-h-screen flex-col lg:ms-[52%]">
        <header className="flex items-center justify-between px-6 py-5 sm:px-8">
          {/* Mobile brand (hidden on desktop — shown on left panel) */}
          <div className="flex items-center gap-2.5 lg:invisible">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{background:"linear-gradient(135deg, #0EA5E9, #8B5CF6)", boxShadow:"0 3px 10px rgba(139,92,246,0.35)"}}
            >
              <Compass className="h-4 w-4 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Rahal</p>
              <p className="text-[11px] text-slate-500">{t("رحلات زيارية", "Pilgrimage Travel")}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <main className="flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:px-8 sm:py-8">
          <div className="w-full max-w-[480px]">
            <PageTransition variant="auth">{children}</PageTransition>
          </div>
        </main>

        <footer className="pb-6 text-center">
          <p className="text-xs text-slate-400">
            {t("© 2025 رحال للسفر الزياري. جميع الحقوق محفوظة.", "© 2025 Rahal Travel. All rights reserved.")}
          </p>
        </footer>
      </div>
    </div>
  );
}
