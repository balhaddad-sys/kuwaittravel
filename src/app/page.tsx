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
      gradient: "from-sky-500 via-blue-500 to-indigo-500",
      shadowColor: "shadow-[0_8px_30px_rgba(0,108,228,0.3)]",
      onClick: () => navigateTo("/app/discover"),
    },
    {
      title: t("بوابة الحملات", "Campaign Portal"),
      subtitle: t(
        "إدارة الرحلات والحجوزات والوثائق",
        "Manage trips, bookings, and documents"
      ),
      icon: <Building2 className="h-6 w-6" />,
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
      shadowColor: "shadow-[0_8px_30px_rgba(67,96,229,0.3)]",
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
            gradient: "from-slate-500 via-slate-600 to-slate-700",
            shadowColor: "shadow-[0_8px_30px_rgba(60,74,96,0.3)]",
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
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large gradient orbs */}
        <div className="absolute -top-[40%] end-[-20%] h-[800px] w-[800px] rounded-full bg-gradient-to-br from-gold-500/16 via-sky-400/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[30%] start-[-15%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-navy-400/10 via-gold-400/8 to-transparent blur-[100px]" />
        <div className="absolute top-[20%] start-[40%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-gold-400/8 to-transparent blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.028] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,34,34,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,34,34,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_4px_20px_rgba(0,108,228,0.3)]">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-body-md font-bold text-navy-900 dark:text-white">Rahal</p>
              <p className="text-[11px] text-navy-500 dark:text-white/40">Travel OS</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Hero */}
        <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center sm:mt-0">
          {/* Badge */}
          <div className="animate-stagger-fade-up inline-flex items-center gap-2 rounded-full border border-gold-300/70 bg-gold-50/80 px-4 py-1.5 backdrop-blur-sm dark:border-gold-600/50 dark:bg-gold-900/20">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span className="text-body-sm font-medium text-gold-700 dark:text-gold-300">
              {t("تجربة سفر فاخرة", "Premium Travel Experience")}
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-stagger-fade-up mt-6 text-5xl font-black leading-[1.1] tracking-tight text-navy-900 dark:text-white sm:mt-8 sm:text-7xl lg:text-8xl"
            style={{ "--stagger-delay": "100ms" } as React.CSSProperties}
          >
            {t("رحال", "Rahal")}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-stagger-fade-up mx-auto mt-4 max-w-xl text-body-lg leading-relaxed text-navy-600 dark:text-white/60 sm:mt-6 sm:text-xl"
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
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-7 py-3.5 text-body-lg font-bold text-white shadow-[0_8px_30px_rgba(0,108,228,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,108,228,0.44)] active:scale-[0.98]"
            >
              <PlaneTakeoff className="h-5 w-5" />
              {t("ابدأ الآن", "Start Now")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => navigateTo("/app/discover")}
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-white px-7 py-3.5 text-body-lg font-bold text-navy-700 shadow-[0_4px_18px_rgba(15,17,22,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-300 hover:bg-navy-50 hover:text-navy-900 active:scale-[0.98] dark:border-surface-dark-border dark:bg-surface-dark-card/80 dark:text-navy-100 dark:hover:border-navy-500 dark:hover:bg-navy-900/40"
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
                  <span className="text-gold-500/70 dark:text-gold-300/70">{stat.icon}</span>
                  <p className="font-numbers text-2xl font-black text-navy-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-navy-500 dark:text-white/45 sm:text-body-sm">
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
              className={`animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-surface-border bg-white/90 p-5 text-start shadow-[0_10px_28px_rgba(20,28,40,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 hover:bg-white active:scale-[0.98] dark:border-surface-dark-border dark:bg-surface-dark-card/82 dark:hover:border-navy-500 dark:hover:bg-surface-dark-card/94 sm:rounded-3xl sm:p-6`}
              style={
                { "--stagger-delay": `${500 + i * 100}ms` } as React.CSSProperties
              }
            >
              {/* Card glow */}
              <div
                className={`pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${entry.gradient} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
              />

              <div className="relative flex items-start gap-4">
                <span
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${entry.gradient} ${entry.shadowColor} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {entry.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold text-navy-900 dark:text-white">
                      {entry.title}
                    </h3>
                    <ChevronLeft className="h-5 w-5 shrink-0 text-navy-400 transition-all duration-200 group-hover:text-gold-600 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5 dark:text-white/30 dark:group-hover:text-gold-300" />
                  </div>
                  <p className="mt-1 text-body-sm text-navy-500 group-hover:text-navy-700 dark:text-white/45 dark:group-hover:text-white/65">
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
