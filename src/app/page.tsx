"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import {
  PlaneTakeoff,
  Building2,
  Shield,
  Compass,
  Sparkles,
  Star,
  ChevronLeft,
  ArrowRight,
  Plane,
  Globe2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useDirection();
  const { userData, firebaseUser } = useAuth();
  const [exiting, setExiting] = useState(false);

  const navigateTo = useCallback(
    (url: string) => {
      if (exiting) return;
      setExiting(true);
      window.dispatchEvent(new Event("nav:start"));
      setTimeout(() => router.push(url), 140);
    },
    [exiting, router]
  );

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/app/discover");
    router.prefetch("/portal/dashboard");
    router.prefetch("/admin-login");
  }, [router]);

  const hasAdminRole =
    userData?.role === "admin" || userData?.role === "super_admin";
  const isPrivilegedEmail = isPrivilegedAdminEmail(firebaseUser?.email);
  const canSeeAdminEntry = hasAdminRole || isPrivilegedEmail;

  const entryPoints = [
    {
      title: t("المسافرون", "Travelers"),
      subtitle: t(
        "اكتشف الرحلات واحجزها خلال دقائق",
        "Discover and book trips in minutes"
      ),
      icon: <PlaneTakeoff className="h-6 w-6" />,
      gradient: "from-teal-500 to-teal-700",
      shadowColor: "shadow-[0_6px_16px_rgba(30,58,95,0.24)]",
      onClick: () => navigateTo("/app/discover"),
    },
    {
      title: t("بوابة الحملات", "Campaign Portal"),
      subtitle: t(
        "إدارة الرحلات والحجوزات والوثائق",
        "Manage trips, bookings, and documents"
      ),
      icon: <Building2 className="h-6 w-6" />,
      gradient: "from-amber-500 to-amber-700",
      shadowColor: "shadow-[0_6px_16px_rgba(197,165,114,0.24)]",
      onClick: () => navigateTo("/portal/dashboard"),
    },
    ...(canSeeAdminEntry
      ? [
          {
            title: t("إدارة المشرفين", "Admin Console"),
            subtitle: t(
              "دخول مخصص لفريق الإدارة",
              "Dedicated entry for administrators"
            ),
            icon: <Shield className="h-6 w-6" />,
            gradient: "from-slate-600 to-slate-700",
            shadowColor: "shadow-[0_6px_16px_rgba(60,74,96,0.24)]",
            onClick: () =>
              navigateTo(
                hasAdminRole ? "/admin/dashboard" : "/admin-login"
              ),
          },
        ]
      : []),
  ];

  const stats = [
    { value: "50+", label: t("رحلة متاحة", "Available Trips"), icon: <Plane className="h-4 w-4" /> },
    { value: "20+", label: t("حملة موثقة", "Verified Campaigns"), icon: <Star className="h-4 w-4" /> },
    { value: "10+", label: t("وجهة", "Destinations"), icon: <Globe2 className="h-4 w-4" /> },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-white transition-[opacity,transform] duration-[140ms] ease-out dark:bg-[#0f1116] ${exiting ? "scale-[0.97] opacity-0" : ""}`}
    >
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_4px_12px_rgba(197,165,114,0.2)]">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-body-md font-bold text-stone-900 dark:text-white">Rahal</p>
              <p className="text-[11px] text-stone-500 dark:text-white/40">Travel OS</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Hero */}
        <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center sm:mt-0">
          {/* Badge */}
          <div className="animate-stagger-fade-up inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50 px-4 py-1.5 dark:border-amber-600/50 dark:bg-amber-900/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-body-sm font-medium text-amber-700 dark:text-amber-300">
              {t("تجربة سفر فاخرة", "Premium Travel Experience")}
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-stagger-fade-up mt-6 text-5xl font-black leading-[1.1] tracking-tight text-stone-900 dark:text-white sm:mt-8 sm:text-7xl lg:text-8xl"
            style={{ "--stagger-delay": "100ms" } as React.CSSProperties}
          >
            {t("رحال", "Rahal")}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-stagger-fade-up mx-auto mt-4 max-w-xl text-body-lg leading-relaxed text-stone-600 dark:text-white/60 sm:mt-6 sm:text-xl"
            style={{ "--stagger-delay": "200ms" } as React.CSSProperties}
          >
            {t(
              "منصة رقمية مصممة للرحلات الزيارية، مع واجهة متقنة تدعم العربية والإنجليزية بسلاسة كاملة.",
              "A premium digital platform for pilgrimage journeys, with seamless Arabic and English support."
            )}
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-stagger-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
            style={{ "--stagger-delay": "300ms" } as React.CSSProperties}
          >
            <button
              onClick={() => navigateTo("/login")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-amber-500 px-7 py-3.5 text-body-lg font-bold text-white shadow-[0_6px_16px_rgba(197,165,114,0.25)] transition-all duration-300 hover:bg-amber-600 active:scale-[0.98]"
            >
              <PlaneTakeoff className="h-5 w-5" />
              {t("ابدأ الآن", "Start Now")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => navigateTo("/app/discover")}
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-white px-7 py-3.5 text-body-lg font-bold text-stone-700 shadow-[0_2px_10px_rgba(15,17,22,0.06)] transition-all duration-300 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 active:scale-[0.98] dark:border-surface-dark-border dark:bg-surface-dark-card/80 dark:text-stone-100 dark:hover:border-stone-500 dark:hover:bg-stone-900/40"
            >
              {t("استكشاف الرحلات", "Explore Trips")}
            </button>
          </div>

          {/* Stats Row */}
          <div
            className="animate-stagger-fade-up mt-10 flex items-center gap-6 sm:mt-14 sm:gap-10"
            style={{ "--stagger-delay": "400ms" } as React.CSSProperties}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-amber-500/70 dark:text-amber-300/70">{stat.icon}</span>
                  <p className="font-numbers text-2xl font-black text-stone-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-stone-500 dark:text-white/45 sm:text-body-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Entry Point Cards */}
        <div className="mt-10 grid gap-3 pb-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {entryPoints.map((entry, i) => (
            <button
              key={entry.title}
              onClick={entry.onClick}
              className={`animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-surface-border bg-white p-5 text-start shadow-[0_4px_16px_rgba(20,28,40,0.07)] transition-all duration-300 hover:border-stone-400 hover:bg-white active:scale-[0.98] dark:border-surface-dark-border dark:bg-surface-dark-card dark:hover:border-stone-500 sm:rounded-3xl sm:p-6`}
              style={
                { "--stagger-delay": `${500 + i * 100}ms` } as React.CSSProperties
              }
            >
              <div className="relative flex items-start gap-4">
                <span
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${entry.gradient} ${entry.shadowColor} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {entry.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold text-stone-900 dark:text-white">
                      {entry.title}
                    </h3>
                    <ChevronLeft className="h-5 w-5 shrink-0 text-stone-400 transition-all duration-200 group-hover:text-amber-600 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5 dark:text-white/30 dark:group-hover:text-amber-300" />
                  </div>
                  <p className="mt-1 text-body-sm text-stone-500 group-hover:text-stone-700 dark:text-white/45 dark:group-hover:text-white/65">
                    {entry.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
