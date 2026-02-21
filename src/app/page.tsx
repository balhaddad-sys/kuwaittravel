"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import { motion, useInView } from "motion/react";

/* ── Mobile detection hook ─────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
import {
  PlaneTakeoff,
  Building2,
  Shield,
  Compass,
  MapPin,
  Star,
  ArrowRight,
  ArrowDown,
  Users,
  Globe2,
  Mountain,
  Sunrise,
  CheckCircle2,
  Search,
  CreditCard,
  Sparkles,
} from "lucide-react";

/* ── Animated Counter ──────────────────────────── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-numbers tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

/* ── Floating Orb ──────────────────────────────── */
function GlowOrb({
  color,
  size,
  x,
  y,
  delay = 0,
  staticMode = false,
}: {
  color: string;
  size: string;
  x: string;
  y: string;
  delay?: number;
  staticMode?: boolean;
}) {
  // On mobile: render static, smaller orb (no animation, reduced blur)
  if (staticMode) {
    return (
      <div
        className="pointer-events-none absolute rounded-full blur-2xl"
        style={{
          background: color,
          width: `calc(${size} * 0.5)`,
          height: `calc(${size} * 0.5)`,
          left: x,
          top: y,
        }}
      />
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full blur-3xl"
      style={{
        background: color,
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ── Stagger Reveal Wrapper ────────────────────── */
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HomePage() {
  const router = useRouter();
  const { t } = useDirection();
  const { userData, firebaseUser } = useAuth();
  const [exiting, setExiting] = useState(false);

  const isMobile = useIsMobile();

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

  const hasAdminRole = userData?.role === "admin" || userData?.role === "super_admin";
  const isPrivilegedEmail = isPrivilegedAdminEmail(firebaseUser?.email);
  const canSeeAdminEntry = hasAdminRole || isPrivilegedEmail;

  const destinations = [
    {
      name: t("مكة المكرمة", "Makkah"),
      subtitle: t("الحج والعمرة", "Hajj & Umrah"),
      icon: <Star className="h-5 w-5" />,
      gradient: "from-orange-600 to-orange-400",
      size: "large",
    },
    {
      name: t("المدينة المنورة", "Madinah"),
      subtitle: t("زيارة المسجد النبوي", "Prophet's Mosque"),
      icon: <Sunrise className="h-5 w-5" />,
      gradient: "from-sky-600 to-sky-400",
      size: "medium",
    },
    {
      name: t("كربلاء", "Karbala"),
      subtitle: t("زيارة الأربعين", "Arbaeen Pilgrimage"),
      icon: <Mountain className="h-5 w-5" />,
      gradient: "from-emerald-600 to-emerald-400",
      size: "medium",
    },
    {
      name: t("النجف", "Najaf"),
      subtitle: t("الزيارات الدينية", "Religious Visits"),
      icon: <MapPin className="h-5 w-5" />,
      gradient: "from-violet-600 to-violet-400",
      size: "small",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: <Search className="h-6 w-6" />,
      title: t("اكتشف", "Discover"),
      desc: t(
        "تصفح مئات الرحلات الزيارية من حملات موثقة ومعتمدة",
        "Browse hundreds of pilgrimage trips from verified campaigns"
      ),
    },
    {
      num: "02",
      icon: <CreditCard className="h-6 w-6" />,
      title: t("احجز", "Book"),
      desc: t(
        "احجز مقعدك بأمان مع خيارات دفع مرنة ومتعددة",
        "Secure your spot with flexible and multiple payment options"
      ),
    },
    {
      num: "03",
      icon: <PlaneTakeoff className="h-6 w-6" />,
      title: t("سافر", "Travel"),
      desc: t(
        "انطلق في رحلتك الروحية مع تتبع مباشر ودعم مستمر",
        "Embark on your spiritual journey with live tracking & support"
      ),
    },
  ];

  const entryCards = [
    {
      icon: <PlaneTakeoff className="h-6 w-6" />,
      title: t("المسافرون", "Travelers"),
      desc: t("اكتشف الرحلات واحجزها خلال دقائق", "Discover and book trips in minutes"),
      href: "/app/discover",
      gradient: "from-sky-500 to-sky-600",
      glow: "rgba(14,165,233,0.35)",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: t("بوابة الحملات", "Campaign Portal"),
      desc: t("إدارة الرحلات والحجوزات والوثائق", "Manage trips, bookings, and documents"),
      href: "/portal/dashboard",
      gradient: "from-violet-500 to-violet-600",
      glow: "rgba(139,92,246,0.35)",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-[opacity,transform] duration-[140ms] ease-out ${
        exiting ? "scale-[0.97] opacity-0" : ""
      }`}
    >
      {/* ══════════════════════════════════════════
          HERO SECTION — Full Viewport
          ══════════════════════════════════════════ */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Editorial gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #020617 0%, #0C4A6E 45%, #4C1D95 100%)",
          }}
        />

        {/* Animated gradient orbs (static on mobile for performance) */}
        <GlowOrb color="rgba(14,165,233,0.15)" size="600px" x="10%" y="-10%" delay={0} staticMode={isMobile} />
        <GlowOrb color="rgba(139,92,246,0.12)" size="500px" x="60%" y="20%" delay={2} staticMode={isMobile} />
        <GlowOrb color="rgba(249,115,22,0.08)" size="400px" x="80%" y="60%" delay={4} staticMode={isMobile} />
        <GlowOrb color="rgba(14,165,233,0.06)" size="350px" x="-5%" y="70%" delay={6} staticMode={isMobile} />

        {/* Geometric pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* ── Top Nav ───────────────────────────── */}
          <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
                    boxShadow: "0 4px 14px rgba(14,165,233,0.4)",
                  }}
                >
                  <Compass className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-body-md font-bold text-white/95">Rahal</p>
                  <p className="text-[11px] text-sky-300/70">
                    {t("رحلات زيارية", "Pilgrimage Travel")}
                  </p>
                </div>
              </div>
              <LanguageToggle />
            </header>
          </div>

          {/* ── Hero Content ─────────────────────── */}
          <div className="flex flex-1 items-center justify-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pb-16 text-center sm:pb-20"
            >
              {/* Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-body-sm font-semibold tracking-wide text-sky-300/90">
                  {t("منصة رحلات زيارية مميزة", "Premium Pilgrimage Platform")}
                </span>
              </motion.div>

              {/* Main title — bold editorial gradient text */}
              <motion.h1
                variants={fadeUp}
                className="mt-7 font-black leading-[1.0] tracking-tight sm:mt-8"
                style={{
                  fontSize: "clamp(4.5rem, 18vw, 9rem)",
                  background:
                    "linear-gradient(160deg, #F0F9FF 0%, #7DD3FC 30%, #A78BFA 60%, #FB923C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("رحّال", "Rahal")}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sky-400/60"
              >
                {t("حج · عمرة · زيارات مقدسة", "Hajj · Umrah · Sacred Ziyarat")}
              </motion.p>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-lg text-body-lg leading-relaxed text-slate-300/70 sm:mt-7"
              >
                {t(
                  "منصة رقمية شاملة للرحلات الزيارية — احجز رحلة الحج أو العمرة أو الزيارة بكل يسر وأمان.",
                  "A premium platform for pilgrimage journeys — book your Hajj, Umrah, or Ziyarat with ease and confidence."
                )}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
              >
                <button
                  onClick={() => navigateTo("/app/discover")}
                  className="group inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-body-lg font-bold text-white transition-all duration-300 active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
                    boxShadow:
                      "0 4px 20px rgba(14,165,233,0.4), 0 8px 32px rgba(139,92,246,0.2)",
                  }}
                >
                  <Compass className="h-5 w-5" />
                  {t("استكشف الرحلات", "Explore Trips")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigateTo("/login")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-3.5 text-body-lg font-bold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.1] active:scale-[0.97]"
                >
                  <PlaneTakeoff className="h-5 w-5" />
                  {t("تسجيل الدخول", "Sign In")}
                </button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                variants={fadeUp}
                className="mt-14 sm:mt-16"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-[11px] font-medium tracking-wider uppercase text-white/30">
                    {t("اكتشف المزيد", "Discover More")}
                  </span>
                  <ArrowDown className="h-4 w-4 text-white/30" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[60px] overflow-hidden">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full fill-slate-50 dark:fill-[#0B1120]"
          >
            <path d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS BAR — Glass Panel
          ══════════════════════════════════════════ */}
      <StatsSection t={t} />

      {/* ══════════════════════════════════════════
          DESTINATIONS — Bento Grid
          ══════════════════════════════════════════ */}
      <DestinationsSection destinations={destinations} navigateTo={navigateTo} t={t} />

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Dark Editorial
          ══════════════════════════════════════════ */}
      <HowItWorksSection steps={steps} t={t} />

      {/* ══════════════════════════════════════════
          ENTRY POINTS — Portal Cards
          ══════════════════════════════════════════ */}
      <EntryPointsSection
        entryCards={entryCards}
        canSeeAdminEntry={canSeeAdminEntry}
        hasAdminRole={hasAdminRole}
        navigateTo={navigateTo}
        t={t}
      />

      {/* ══════════════════════════════════════════
          CTA SECTION — Final Push
          ══════════════════════════════════════════ */}
      <CTASection navigateTo={navigateTo} t={t} />

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-[#2D3B4F] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-3">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)" }}
            >
              <Compass className="h-4 w-4 text-white" />
            </span>
            <span className="text-body-md font-bold text-slate-800 dark:text-slate-200">
              Rahal
            </span>
          </div>
          <p className="mt-3 text-body-sm text-slate-400 dark:text-slate-500">
            {t(
              "© ٢٠٢٦ رحّال — جميع الحقوق محفوظة",
              "© 2026 Rahal — All rights reserved"
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SECTION COMPONENTS
   ════════════════════════════════════════════════ */

function StatsSection({ t }: { t: (ar: string, en: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const stats = [
    { value: 10, suffix: "+", label: t("وجهة", "Destinations"), icon: <Globe2 className="h-5 w-5" /> },
    { value: 5000, suffix: "+", label: t("مسافر", "Travelers"), icon: <Users className="h-5 w-5" /> },
    { value: 20, suffix: "+", label: t("حملة موثقة", "Verified Campaigns"), icon: <Shield className="h-5 w-5" /> },
    { value: 98, suffix: "%", label: t("رضا العملاء", "Satisfaction"), icon: <Star className="h-5 w-5" /> },
  ];

  return (
    <section className="relative z-10 -mt-6 px-5 sm:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_4px_24px_rgba(2,6,23,0.06),0_1px_3px_rgba(2,6,23,0.04)] backdrop-blur-xl sm:p-8 dark:border-[#2D3B4F] dark:bg-[#111827]/90"
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-900/25 dark:text-sky-400">
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-body-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function DestinationsSection({
  destinations,
  navigateTo,
  t,
}: {
  destinations: {
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    gradient: string;
    size: string;
  }[];
  navigateTo: (url: string) => void;
  t: (ar: string, en: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Section header */}
        <motion.div variants={fadeUp} className="mb-8 text-center sm:mb-10">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-sky-400/50" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-500">
              {t("وجهات شائعة", "Popular Destinations")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-sky-400/50" />
          </div>
          <h2 className="text-display-md font-black text-slate-900 dark:text-white">
            {t("اكتشف وجهتك القادمة", "Discover Your Next Destination")}
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {destinations.map((dest, i) => (
            <motion.button
              key={dest.name}
              variants={fadeScale}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigateTo("/app/discover")}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 text-start shadow-[0_1px_3px_rgba(2,6,23,0.05),0_4px_16px_rgba(2,6,23,0.06)] transition-colors hover:border-sky-200 sm:rounded-3xl sm:p-6 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:hover:border-sky-700/40 ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              {/* Gradient accent on hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />
              <div
                className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br text-white ${dest.gradient} ${
                  i === 0 ? "h-14 w-14" : "h-10 w-10"
                }`}
                style={{ boxShadow: "0 4px 12px rgba(2,6,23,0.12)" }}
              >
                {dest.icon}
              </div>
              <h3
                className={`mt-3 font-bold text-slate-900 dark:text-white ${
                  i === 0 ? "text-heading-lg" : "text-body-lg"
                }`}
              >
                {dest.name}
              </h3>
              <p className="mt-1 text-body-sm text-slate-500 dark:text-slate-400">
                {dest.subtitle}
              </p>
              {i === 0 && (
                <p className="mt-3 text-body-sm text-sky-500 font-semibold dark:text-sky-400">
                  {t("الوجهة الأكثر طلباً", "Most Popular Destination")}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorksSection({
  steps,
  t,
}: {
  steps: { num: string; icon: React.ReactNode; title: string; desc: string }[];
  t: (ar: string, en: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      style={{
        background: "linear-gradient(160deg, #020617 0%, #0C4A6E 60%, #4C1D95 100%)",
      }}
    >
      {/* Pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[15%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12 text-center sm:mb-16">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-400/70">
              {t("كيف تعمل المنصة", "How It Works")}
            </span>
            <h2 className="mt-3 text-display-md font-black text-white">
              {t("ثلاث خطوات نحو رحلتك", "Three Steps to Your Journey")}
            </h2>
          </motion.div>

          {/* Steps grid */}
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] sm:rounded-3xl sm:p-8"
              >
                {/* Step number */}
                <span
                  className="text-5xl font-black"
                  style={{
                    background: "linear-gradient(135deg, #38BDF8, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.3,
                  }}
                >
                  {step.num}
                </span>

                {/* Icon */}
                <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-[0_4px_16px_rgba(14,165,233,0.3)]">
                  {step.icon}
                </div>

                <h3 className="mt-4 text-heading-md font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-body-md leading-relaxed text-slate-300/70">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EntryPointsSection({
  entryCards,
  canSeeAdminEntry,
  hasAdminRole,
  navigateTo,
  t,
}: {
  entryCards: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    href: string;
    gradient: string;
    glow: string;
  }[];
  canSeeAdminEntry: boolean;
  hasAdminRole: boolean;
  navigateTo: (url: string) => void;
  t: (ar: string, en: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8 text-center sm:mb-10">
          <h2 className="text-display-md font-black text-slate-900 dark:text-white">
            {t("ابدأ رحلتك", "Start Your Journey")}
          </h2>
          <p className="mt-2 text-body-lg text-slate-500 dark:text-slate-400">
            {t(
              "اختر البوابة المناسبة لك",
              "Choose the right portal for you"
            )}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entryCards.map((card) => (
            <motion.button
              key={card.href}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo(card.href)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 text-start shadow-[0_1px_3px_rgba(2,6,23,0.05),0_4px_16px_rgba(2,6,23,0.06)] transition-colors hover:border-sky-200 sm:rounded-3xl sm:p-7 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:hover:border-sky-700/40"
            >
              {/* Hover gradient border */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.glow.replace(",0.35)", ",0.8)")}, transparent)`,
                }}
              />
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${card.gradient}`}
                style={{ boxShadow: `0 6px 16px ${card.glow}` }}
              >
                {card.icon}
              </div>
              <h3 className="mt-4 text-heading-md font-bold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-1.5 text-body-md text-slate-500 dark:text-slate-400">
                {card.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-sky-500 dark:text-sky-400">
                {t("ابدأ الآن", "Get Started")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </div>
            </motion.button>
          ))}

          {/* Admin Entry */}
          {canSeeAdminEntry && (
            <motion.button
              variants={fadeUp}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigateTo(hasAdminRole ? "/admin/dashboard" : "/admin-login")
              }
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 text-start shadow-[0_1px_3px_rgba(2,6,23,0.05),0_4px_16px_rgba(2,6,23,0.06)] transition-colors hover:border-slate-300 sm:rounded-3xl sm:p-7 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:hover:border-slate-600"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(100,116,139,0.5), transparent)",
                }}
              />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 text-white"
                style={{ boxShadow: "0 6px 16px rgba(2,6,23,0.25)" }}
              >
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-heading-md font-bold text-slate-900 dark:text-white">
                {t("إدارة المشرفين", "Admin Console")}
              </h3>
              <p className="mt-1.5 text-body-md text-slate-500 dark:text-slate-400">
                {t("دخول مخصص لفريق الإدارة", "Dedicated entry for administrators")}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-slate-600 dark:text-slate-300">
                {t("الدخول", "Enter")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </div>
            </motion.button>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function CTASection({
  navigateTo,
  t,
}: {
  navigateTo: (url: string) => void;
  t: (ar: string, en: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      style={{
        background: "linear-gradient(160deg, #020617 0%, #0C4A6E 50%, #4C1D95 100%)",
      }}
    >
      {/* Glow orbs */}
      <div className="pointer-events-none absolute right-[20%] top-[10%] h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[15%] bottom-[15%] h-[250px] w-[250px] rounded-full bg-sky-500/8 blur-3xl" />

      {/* Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8"
      >
        <h2
          className="text-display-md font-black sm:text-display-lg"
          style={{
            background: "linear-gradient(135deg, #F0F9FF, #7DD3FC, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("ابدأ رحلتك الروحية اليوم", "Start Your Spiritual Journey Today")}
        </h2>
        <p className="mt-4 text-body-lg text-slate-300/70">
          {t(
            "انضم إلى آلاف المسافرين الذين يثقون بمنصة رحّال لتنظيم رحلاتهم الزيارية",
            "Join thousands of travelers who trust Rahal for organizing their pilgrimage journeys"
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateTo("/app/discover")}
            className="group inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-body-lg font-bold text-white transition-all duration-300 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #F97316, #FB923C)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.45), 0 8px 32px rgba(249,115,22,0.2)",
            }}
          >
            <Compass className="h-5 w-5" />
            {t("استكشف الآن", "Explore Now")}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={() => navigateTo("/login")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-4 text-body-lg font-bold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.1] active:scale-[0.97]"
          >
            {t("سجّل كحملة", "List Your Campaign")}
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400/60" />
            {t("آلاف المسافرين الموثوقين", "Thousands of trusted travelers")}
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-violet-400/60" />
            {t("حملات موثقة ومعتمدة", "Verified & accredited campaigns")}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
