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
      gradient: "from-orange-600 to-orange-800",
    },
    {
      name: t("المدينة المنورة", "Madinah"),
      subtitle: t("زيارة المسجد النبوي", "Visit the Prophet's Mosque"),
      icon: <Sunrise className="h-5 w-5" />,
      gradient: "from-indigo-600 to-indigo-800",
    },
    {
      name: t("كربلاء", "Karbala"),
      subtitle: t("زيارة الأربعين", "Arbaeen Pilgrimage"),
      icon: <Mountain className="h-5 w-5" />,
      gradient: "from-gray-600 to-gray-800",
    },
    {
      name: t("النجف", "Najaf"),
      subtitle: t("الزيارات الدينية", "Religious Visits"),
      icon: <MapPin className="h-5 w-5" />,
      gradient: "from-indigo-700 to-indigo-900",
    },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-[opacity,transform] duration-[140ms] ease-out ${exiting ? "scale-[0.97] opacity-0" : ""}`}
    >
      {/* Light sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-orange-50/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-transparent to-orange-100/30" />
      {/* Warm bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-orange-100/50 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_4px_12px_rgba(37,99,235,0.25)]">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-body-md font-bold text-gray-900">Rahal</p>
              <p className="text-[11px] text-gray-500">{t("رحلات زيارية", "Pilgrimage Travel")}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Hero */}
        <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center sm:mt-0">
          {/* Badge */}
          <div
            className="animate-stagger-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5"
          >
            <Globe2 className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-body-sm font-medium text-indigo-700">
              {t("تجربة سفر فاخرة", "Premium Travel Experience")}
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-stagger-fade-up mt-6 text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:mt-8 sm:text-7xl lg:text-8xl"
            style={{ "--stagger-delay": "100ms" } as React.CSSProperties}
          >
            {t("رحال", "Rahal")}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-stagger-fade-up mx-auto mt-4 max-w-xl text-body-lg leading-relaxed text-gray-600 sm:mt-6 sm:text-xl"
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
              className="group inline-flex items-center gap-2.5 rounded-full bg-indigo-600 px-7 py-3.5 text-body-lg font-bold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] active:scale-[0.98]"
            >
              <Compass className="h-5 w-5" />
              {t("استكشف الرحلات", "Explore Trips")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:trangray-x-0.5 rtl:rotate-180 rtl:group-hover:-trangray-x-0.5" />
            </button>
            <button
              onClick={() => navigateTo("/login")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-body-lg font-bold text-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]"
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
                  <span className="text-indigo-500">{stat.icon}</span>
                  <p className="font-numbers text-2xl font-black text-gray-900 sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-gray-500 sm:text-body-sm">
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
          <p className="mb-3 text-center text-body-sm font-medium text-gray-500">
            {t("وجهات شائعة", "Popular Destinations")}
          </p>
          <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => navigateTo("/app/discover")}
                className="group flex shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${dest.gradient} text-white shadow-md`}>
                  {dest.icon}
                </span>
                <div className="text-start">
                  <p className="text-body-md font-bold text-gray-900">{dest.name}</p>
                  <p className="text-[11px] text-gray-500">{dest.subtitle}</p>
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
            className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-start shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] sm:rounded-3xl sm:p-6"
            style={{ "--stagger-delay": "600ms" } as React.CSSProperties}
          >
            <div className="relative flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_6px_16px_rgba(245,158,11,0.25)] transition-transform duration-300 group-hover:scale-110">
                <PlaneTakeoff className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-body-lg font-bold text-gray-900">
                    {t("المسافرون", "Travelers")}
                  </h3>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-all duration-200 group-hover:text-indigo-500 group-hover:trangray-x-0.5 rtl:rotate-180 rtl:group-hover:-trangray-x-0.5" />
                </div>
                <p className="mt-1 text-body-sm text-gray-500 group-hover:text-gray-600">
                  {t("اكتشف الرحلات واحجزها خلال دقائق", "Discover and book trips in minutes")}
                </p>
              </div>
            </div>
          </button>

          {/* Campaign Portal Entry */}
          <button
            onClick={() => navigateTo("/portal/dashboard")}
            className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-start shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] sm:rounded-3xl sm:p-6"
            style={{ "--stagger-delay": "700ms" } as React.CSSProperties}
          >
            <div className="relative flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_6px_16px_rgba(37,99,235,0.25)] transition-transform duration-300 group-hover:scale-110">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-body-lg font-bold text-gray-900">
                    {t("بوابة الحملات", "Campaign Portal")}
                  </h3>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-all duration-200 group-hover:text-indigo-500 group-hover:trangray-x-0.5 rtl:rotate-180 rtl:group-hover:-trangray-x-0.5" />
                </div>
                <p className="mt-1 text-body-sm text-gray-500 group-hover:text-gray-600">
                  {t("إدارة الرحلات والحجوزات والوثائق", "Manage trips, bookings, and documents")}
                </p>
              </div>
            </div>
          </button>

          {/* Admin Entry (conditional) */}
          {canSeeAdminEntry && (
            <button
              onClick={() => navigateTo(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
              className="animate-stagger-fade-up group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-start shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] sm:rounded-3xl sm:p-6"
              style={{ "--stagger-delay": "800ms" } as React.CSSProperties}
            >
              <div className="relative flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 text-white shadow-[0_6px_16px_rgba(60,74,96,0.2)] transition-transform duration-300 group-hover:scale-110">
                  <Shield className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold text-gray-900">
                      {t("إدارة المشرفين", "Admin Console")}
                    </h3>
                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-all duration-200 group-hover:text-indigo-500 group-hover:trangray-x-0.5 rtl:rotate-180 rtl:group-hover:-trangray-x-0.5" />
                  </div>
                  <p className="mt-1 text-body-sm text-gray-500 group-hover:text-gray-600">
                    {t("دخول مخصص لفريق الإدارة", "Dedicated entry for administrators")}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="animate-stagger-fade-up mt-2 mb-4 flex items-center justify-center gap-4 text-[11px] text-gray-400"
          style={{ "--stagger-delay": "900ms" } as React.CSSProperties}
        >
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {t("آلاف المسافرين", "Thousands of travelers")}
          </span>
          <span className="h-3 w-px bg-gray-300" />
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t("حملات موثقة", "Verified campaigns")}
          </span>
        </div>
      </div>
    </div>
  );
}
