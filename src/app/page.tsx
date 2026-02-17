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
  MapPin,
  Star,
  ChevronRight,
  ArrowRight,
  Users,
  Globe2,
  Mountain,
  Sunrise,
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

  const destinations = [
    {
      name: t("مكة المكرمة", "Makkah"),
      subtitle: t("الحج والعمرة", "Hajj & Umrah"),
      icon: <Star className="h-5 w-5" />,
      gradient: "from-amber-600 to-amber-800",
    },
    {
      name: t("المدينة المنورة", "Madinah"),
      subtitle: t("زيارة المسجد النبوي", "Visit the Prophet's Mosque"),
      icon: <Sunrise className="h-5 w-5" />,
      gradient: "from-teal-600 to-teal-800",
    },
    {
      name: t("كربلاء", "Karbala"),
      subtitle: t("زيارة الأربعين", "Arbaeen Pilgrimage"),
      icon: <Mountain className="h-5 w-5" />,
      gradient: "from-stone-600 to-stone-800",
    },
    {
      name: t("النجف", "Najaf"),
      subtitle: t("الزيارات الدينية", "Religious Visits"),
      icon: <MapPin className="h-5 w-5" />,
      gradient: "from-teal-700 to-teal-900",
    },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-[opacity,transform] duration-[140ms] ease-out ${exiting ? "scale-[0.97] opacity-0" : ""}`}
    >
      {/* Immersive background — warm desert/sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB] via-[#3B82F6] to-[#F59E0B]/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/90 via-transparent to-[#F59E0B]/20" />
      {/* Soft horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#F59E0B]/25 via-[#F59E0B]/8 to-transparent" />
      {/* Stars-like dots for night sky feel */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-body-md font-bold text-white">Rahal</p>
              <p className="text-[11px] text-white/50">{t("رحلات زيارية", "Pilgrimage Travel")}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Hero */}
        <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center sm:mt-0">
          {/* Badge */}
          <div
            className="animate-stagger-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <Globe2 className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-body-sm font-medium text-white/90">
              {t("تجربة سفر فاخرة", "Premium Travel Experience")}
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-stagger-fade-up mt-6 text-5xl font-black leading-[1.1] tracking-tight text-white sm:mt-8 sm:text-7xl lg:text-8xl"
            style={{ "--stagger-delay": "100ms" } as React.CSSProperties}
          >
            {t("رحال", "Rahal")}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-stagger-fade-up mx-auto mt-4 max-w-xl text-body-lg leading-relaxed text-white/70 sm:mt-6 sm:text-xl"
            style={{ "--stagger-delay": "200ms" } as React.CSSProperties}
          >
            {t(
              "منصة رقمية فاخرة للرحلات الزيارية — احجز رحلة الحج أو العمرة أو الزيارة بسهولة تامة.",
              "A premium platform for pilgrimage journeys — book your Hajj, Umrah, or Ziyarat trip with ease."
            )}
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-stagger-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
            style={{ "--stagger-delay": "300ms" } as React.CSSProperties}
          >
            <button
              onClick={() => navigateTo("/app/discover")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-body-lg font-bold text-[#2563EB] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-amber-50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] active:scale-[0.98]"
            >
              <Compass className="h-5 w-5" />
              {t("استكشف الرحلات", "Explore Trips")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => navigateTo("/login")}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-body-lg font-bold text-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-[0.98]"
            >
              <PlaneTakeoff className="h-5 w-5" />
              {t("تسجيل الدخول", "Sign In")}
            </button>
          </div>

          {/* Stats Row */}
          <div
            className="animate-stagger-fade-up mt-10 flex items-center gap-8 sm:mt-14 sm:gap-12"
            style={{ "--stagger-delay": "400ms" } as React.CSSProperties}
          >
            {[
              { value: "50+", label: t("رحلة متاحة", "Trips Available"), icon: <PlaneTakeoff className="h-4 w-4" /> },
              { value: "20+", label: t("حملة موثقة", "Verified Campaigns"), icon: <Star className="h-4 w-4" /> },
              { value: "10+", label: t("وجهة", "Destinations"), icon: <Globe2 className="h-4 w-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-amber-300/80">{stat.icon}</span>
                  <p className="font-numbers text-2xl font-black text-white sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-white/50 sm:text-body-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Destinations Preview */}
        <div
          className="animate-stagger-fade-up mt-8 sm:mt-10"
          style={{ "--stagger-delay": "500ms" } as React.CSSProperties}
        >
          <p className="mb-3 text-center text-body-sm font-medium text-white/50">
            {t("وجهات شائعة", "Popular Destinations")}
          </p>
          <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => navigateTo("/app/discover")}
                className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 active:scale-[0.98]"
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${dest.gradient} text-white shadow-md`}>
                  {dest.icon}
                </span>
                <div className="text-start">
                  <p className="text-body-md font-bold text-white">{dest.name}</p>
                  <p className="text-[11px] text-white/50">{dest.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Entry Point Cards */}
        <div className="mt-6 grid gap-3 pb-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {/* Traveler Entry */}
          <button
            onClick={() => navigateTo("/app/discover")}
            className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 text-start backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 active:scale-[0.98] sm:rounded-3xl sm:p-6"
            style={{ "--stagger-delay": "600ms" } as React.CSSProperties}
          >
            <div className="relative flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-[0_6px_16px_rgba(245,158,11,0.3)] transition-transform duration-300 group-hover:scale-110">
                <PlaneTakeoff className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-body-lg font-bold text-white">
                    {t("المسافرون", "Travelers")}
                  </h3>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition-all duration-200 group-hover:text-amber-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </div>
                <p className="mt-1 text-body-sm text-white/50 group-hover:text-white/70">
                  {t("اكتشف الرحلات واحجزها خلال دقائق", "Discover and book trips in minutes")}
                </p>
              </div>
            </div>
          </button>

          {/* Campaign Portal Entry */}
          <button
            onClick={() => navigateTo("/portal/dashboard")}
            className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 text-start backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 active:scale-[0.98] sm:rounded-3xl sm:p-6"
            style={{ "--stagger-delay": "700ms" } as React.CSSProperties}
          >
            <div className="relative flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-[0_6px_16px_rgba(37,99,235,0.3)] transition-transform duration-300 group-hover:scale-110">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-body-lg font-bold text-white">
                    {t("بوابة الحملات", "Campaign Portal")}
                  </h3>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition-all duration-200 group-hover:text-amber-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </div>
                <p className="mt-1 text-body-sm text-white/50 group-hover:text-white/70">
                  {t("إدارة الرحلات والحجوزات والوثائق", "Manage trips, bookings, and documents")}
                </p>
              </div>
            </div>
          </button>

          {/* Admin Entry (conditional) */}
          {canSeeAdminEntry && (
            <button
              onClick={() => navigateTo(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
              className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 text-start backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 active:scale-[0.98] sm:rounded-3xl sm:p-6"
              style={{ "--stagger-delay": "800ms" } as React.CSSProperties}
            >
              <div className="relative flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-500 to-stone-700 text-white shadow-[0_6px_16px_rgba(60,74,96,0.3)] transition-transform duration-300 group-hover:scale-110">
                  <Shield className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold text-white">
                      {t("إدارة المشرفين", "Admin Console")}
                    </h3>
                    <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition-all duration-200 group-hover:text-amber-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </div>
                  <p className="mt-1 text-body-sm text-white/50 group-hover:text-white/70">
                    {t("دخول مخصص لفريق الإدارة", "Dedicated entry for administrators")}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="animate-stagger-fade-up mt-2 mb-4 flex items-center justify-center gap-4 text-[11px] text-white/35"
          style={{ "--stagger-delay": "900ms" } as React.CSSProperties}
        >
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {t("آلاف المسافرين", "Thousands of travelers")}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t("حملات موثقة", "Verified campaigns")}
          </span>
        </div>
      </div>
    </div>
  );
}
