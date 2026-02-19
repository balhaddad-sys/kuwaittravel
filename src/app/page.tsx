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

/* ── Decorative crescent SVG ─────────────────────────── */
function CrescentDecor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 10C32.4 10 10 32.4 10 60s22.4 50 50 50c10.5 0 20.3-3.2 28.3-8.7C76.3 96.8 65 84.4 65 69.5c0-19.3 15.6-35 35-35 2.2 0 4.4.2 6.5.6C100.7 21.5 81.8 10 60 10z"
        fill="currentColor"
        opacity="0.06"
      />
    </svg>
  );
}

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
      from: "#7A3F10",
      to: "#C5A572",
    },
    {
      name: t("المدينة المنورة", "Madinah"),
      subtitle: t("زيارة المسجد النبوي", "Prophet's Mosque"),
      icon: <Sunrise className="h-5 w-5" />,
      from: "#0E1D31",
      to: "#3D78A8",
    },
    {
      name: t("كربلاء", "Karbala"),
      subtitle: t("زيارة الأربعين", "Arbaeen Pilgrimage"),
      icon: <Mountain className="h-5 w-5" />,
      from: "#1A3A28",
      to: "#2E6B4F",
    },
    {
      name: t("النجف", "Najaf"),
      subtitle: t("الزيارات الدينية", "Religious Visits"),
      icon: <MapPin className="h-5 w-5" />,
      from: "#2A1C42",
      to: "#4A35A0",
    },
  ];

  const entryCards = [
    {
      icon: <PlaneTakeoff className="h-6 w-6" />,
      title: t("المسافرون", "Travelers"),
      desc: t("اكتشف الرحلات واحجزها خلال دقائق", "Discover and book trips in minutes"),
      href: "/app/discover",
      iconBg: "linear-gradient(135deg, #9A7538, #C5A572)",
      iconShadow: "rgba(197,165,114,0.35)",
      delay: "600ms",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: t("بوابة الحملات", "Campaign Portal"),
      desc: t("إدارة الرحلات والحجوزات والوثائق", "Manage trips, bookings, and documents"),
      href: "/portal/dashboard",
      iconBg: "linear-gradient(135deg, #0E1D31, #1E3A5F)",
      iconShadow: "rgba(30,58,95,0.35)",
      delay: "700ms",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-[opacity,transform] duration-[140ms] ease-out ${
        exiting ? "scale-[0.97] opacity-0" : ""
      }`}
    >
      {/* ══════════════════════════════════════════
          DARK HERO SECTION
          ══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #040810 0%, #080F1C 30%, #0E1D31 60%, #162B48 100%)",
        }}
      >
        {/* Decorative gold radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 55% 30%, rgba(197,165,114,0.09) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(197,165,114,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Decorative crescents */}
        <CrescentDecor
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 text-orange-400 opacity-50"
        />
        <CrescentDecor
          className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 text-orange-500 opacity-30"
        />

        {/* ── Top Nav ───────────────────────────── */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8">
          <header className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #9A7538, #C5A572)",
                  boxShadow: "0 4px 14px rgba(197,165,114,0.4)",
                }}
              >
                <Compass className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-body-md font-bold" style={{ color: "#F0EAE0" }}>
                  Rahal
                </p>
                <p className="text-[11px]" style={{ color: "rgba(197,165,114,0.8)" }}>
                  {t("رحلات زيارية", "Pilgrimage Travel")}
                </p>
              </div>
            </div>
            <LanguageToggle />
          </header>
        </div>

        {/* ── Hero Content ─────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 pb-16 pt-14 text-center sm:pb-20 sm:pt-16">
          {/* Premium badge */}
          <div
            className="animate-stagger-fade-up inline-flex items-center gap-2 rounded-full px-5 py-2"
            style={{
              border: "1px solid rgba(197,165,114,0.4)",
              background: "rgba(197,165,114,0.08)",
            }}
          >
            <Star className="h-3.5 w-3.5" style={{ color: "#C5A572" }} />
            <span
              className="text-body-sm font-semibold tracking-wide"
              style={{ color: "#D4B05C" }}
            >
              {t("منصة رحلات زيارية مميزة", "Premium Pilgrimage Platform")}
            </span>
          </div>

          {/* Main title */}
          <h1
            className="animate-stagger-fade-up mt-7 font-black leading-[1.0] tracking-tight sm:mt-8"
            style={{
              "--stagger-delay": "100ms",
              fontSize: "clamp(4.5rem, 18vw, 9rem)",
              background: "linear-gradient(160deg, #F0EAE0 0%, #C5A572 50%, #E0BF6F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            } as React.CSSProperties}
          >
            {t("رحّال", "Rahal")}
          </h1>

          {/* Subtitle line */}
          <p
            className="animate-stagger-fade-up mt-3 text-body-lg font-semibold tracking-widest uppercase"
            style={{
              "--stagger-delay": "180ms",
              color: "rgba(197,165,114,0.7)",
              letterSpacing: "0.2em",
              fontSize: "0.7rem",
            } as React.CSSProperties}
          >
            {t("حج · عمرة · زيارات مقدسة", "Hajj · Umrah · Sacred Ziyarat")}
          </p>

          {/* Description */}
          <p
            className="animate-stagger-fade-up mx-auto mt-6 max-w-lg text-body-lg leading-relaxed sm:mt-7"
            style={{
              "--stagger-delay": "250ms",
              color: "rgba(240,234,224,0.65)",
            } as React.CSSProperties}
          >
            {t(
              "منصة رقمية شاملة للرحلات الزيارية — احجز رحلة الحج أو العمرة أو الزيارة بكل يسر وأمان.",
              "A premium platform for pilgrimage journeys — book your Hajj, Umrah, or Ziyarat with ease and confidence."
            )}
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-stagger-fade-up mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
            style={{ "--stagger-delay": "340ms" } as React.CSSProperties}
          >
            <button
              onClick={() => navigateTo("/app/discover")}
              className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-body-lg font-bold text-white transition-all duration-300 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #9A7538, #C5A572, #D4B05C)",
                boxShadow: "0 4px 20px rgba(197,165,114,0.45), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <Compass className="h-5 w-5" />
              {t("استكشف الرحلات", "Explore Trips")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => navigateTo("/login")}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-body-lg font-bold transition-all duration-300 active:scale-[0.97]"
              style={{
                border: "1.5px solid rgba(240,234,224,0.2)",
                background: "rgba(240,234,224,0.06)",
                color: "rgba(240,234,224,0.85)",
              }}
            >
              <PlaneTakeoff className="h-5 w-5" />
              {t("تسجيل الدخول", "Sign In")}
            </button>
          </div>

          {/* Stats */}
          <div
            className="animate-stagger-fade-up mt-12 flex items-center gap-10 sm:mt-14 sm:gap-14"
            style={{ "--stagger-delay": "450ms" } as React.CSSProperties}
          >
            {[
              {
                value: "50+",
                label: t("رحلة متاحة", "Trips Available"),
                icon: <PlaneTakeoff className="h-3.5 w-3.5" />,
              },
              {
                value: "20+",
                label: t("حملة موثقة", "Verified Campaigns"),
                icon: <Star className="h-3.5 w-3.5" />,
              },
              {
                value: "10+",
                label: t("وجهة", "Destinations"),
                icon: <Globe2 className="h-3.5 w-3.5" />,
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="flex items-center justify-center gap-1.5"
                  style={{ color: "#C5A572" }}
                >
                  {stat.icon}
                  <p className="font-numbers text-3xl font-black" style={{ color: "#F0EAE0" }}>
                    {stat.value}
                  </p>
                </div>
                <p className="mt-1 text-[11px]" style={{ color: "rgba(197,165,114,0.65)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave transition */}
        <div className="relative z-10 overflow-hidden" style={{ height: "40px" }}>
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            fill="#FDFBF7"
          >
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          WARM CONTENT SECTION
          ══════════════════════════════════════════ */}
      <div
        className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10"
        style={{ background: "#FDFBF7" }}
      >
        {/* ── Popular Destinations ─────────────── */}
        <div
          className="animate-stagger-fade-up mb-8"
          style={{ "--stagger-delay": "500ms" } as React.CSSProperties}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, #D5CAB9, transparent)" }}
            />
            <p className="text-body-sm font-semibold uppercase tracking-widest" style={{ color: "#B5A894", fontSize: "0.65rem" }}>
              {t("وجهات شائعة", "Popular Destinations")}
            </p>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, #D5CAB9, transparent)" }}
            />
          </div>

          <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => navigateTo("/app/discover")}
                className="group flex shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-300 active:scale-[0.97]"
                style={{
                  border: "1px solid #D5CAB9",
                  boxShadow: "0 1px 3px rgba(26,18,9,0.05), 0 4px 12px rgba(26,18,9,0.05)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 20px rgba(26,18,9,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#B5A894";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 3px rgba(26,18,9,0.05), 0 4px 12px rgba(26,18,9,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#D5CAB9";
                }}
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${dest.from}, ${dest.to})`,
                    boxShadow: "0 4px 12px rgba(26,18,9,0.2)",
                  }}
                >
                  {dest.icon}
                </span>
                <div className="text-start">
                  <p className="text-body-md font-bold" style={{ color: "#1A1209" }}>
                    {dest.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "#8F8070" }}>
                    {dest.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Entry Cards ──────────────────────── */}
        <div
          className="animate-stagger-fade-up grid gap-3 sm:grid-cols-2 sm:gap-4"
          style={
            {
              "--stagger-delay": canSeeAdminEntry ? "600ms" : "600ms",
            } as React.CSSProperties
          }
        >
          {entryCards.map((card) => (
            <button
              key={card.href}
              onClick={() => navigateTo(card.href)}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 text-start transition-all duration-300 active:scale-[0.98] sm:rounded-3xl sm:p-6"
              style={{
                border: "1px solid #D5CAB9",
                boxShadow: "0 1px 3px rgba(26,18,9,0.05), 0 4px 16px rgba(26,18,9,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px rgba(26,18,9,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "#B5A894";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 1px 3px rgba(26,18,9,0.05), 0 4px 16px rgba(26,18,9,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "#D5CAB9";
              }}
            >
              {/* Subtle gold top accent */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, #C5A572, transparent)" }}
              />
              <div className="flex items-start gap-4">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: card.iconBg,
                    boxShadow: `0 6px 16px ${card.iconShadow}`,
                  }}
                >
                  {card.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold" style={{ color: "#1A1209" }}>
                      {card.title}
                    </h3>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      style={{ color: "#B5A894" }}
                    />
                  </div>
                  <p className="mt-1 text-body-sm" style={{ color: "#8F8070" }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Admin Entry (conditional) */}
          {canSeeAdminEntry && (
            <button
              onClick={() =>
                navigateTo(hasAdminRole ? "/admin/dashboard" : "/admin-login")
              }
              className="group relative overflow-hidden rounded-2xl bg-white p-5 text-start transition-all duration-300 active:scale-[0.98] sm:rounded-3xl sm:p-6"
              style={{
                border: "1px solid #D5CAB9",
                boxShadow: "0 1px 3px rgba(26,18,9,0.05), 0 4px 16px rgba(26,18,9,0.06)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, #6B5E4E, transparent)" }}
              />
              <div className="flex items-start gap-4">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #2E2618, #4A3F32)",
                    boxShadow: "0 6px 16px rgba(26,18,9,0.25)",
                  }}
                >
                  <Shield className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body-lg font-bold" style={{ color: "#1A1209" }}>
                      {t("إدارة المشرفين", "Admin Console")}
                    </h3>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      style={{ color: "#B5A894" }}
                    />
                  </div>
                  <p className="mt-1 text-body-sm" style={{ color: "#8F8070" }}>
                    {t("دخول مخصص لفريق الإدارة", "Dedicated entry for administrators")}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* ── Trust Badges ─────────────────────── */}
        <div className="animate-stagger-fade-up mt-8 mb-4 flex items-center justify-center gap-4 text-[11px]"
          style={
            { "--stagger-delay": "750ms", color: "#B5A894" } as React.CSSProperties
          }
        >
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3" style={{ color: "#C5A572" }} />
            {t("آلاف المسافرين الموثوقين", "Thousands of trusted travelers")}
          </span>
          <span className="h-3 w-px" style={{ background: "#D5CAB9" }} />
          <span className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" style={{ color: "#C5A572" }} />
            {t("حملات موثقة ومعتمدة", "Verified & accredited campaigns")}
          </span>
        </div>
      </div>
    </div>
  );
}
