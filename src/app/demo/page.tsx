"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { LiveTripTracker } from "@/components/shared/LiveTripTracker";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { ItineraryTimeline } from "@/components/shared/ItineraryTimeline";
import { StatCard } from "@/components/data-display/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { motion, useInView } from "motion/react";
import type { ItineraryBlock } from "@/types";
import {
  PlaneTakeoff,
  Building2,
  Shield,
  Compass,
  MapPin,
  Star,
  Users,
  Globe2,
  Wallet,
  Map,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Languages,
  Radio,
  Search,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Sparkles,
} from "lucide-react";

/* ── Framer Motion Variants ──────────────────────── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};
const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ── Mobile Detection ────────────────────────────── */
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

/* ── Animated Counter ────────────────────────────── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, value]);
  return (
    <span ref={ref} className="font-numbers tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ── Floating Orb ────────────────────────────────── */
function GlowOrb({ color, size, x, y, delay = 0, staticMode = false }: {
  color: string; size: string; x: string; y: string; delay?: number; staticMode?: boolean;
}) {
  if (staticMode) {
    return (
      <div className="pointer-events-none absolute rounded-full blur-2xl"
        style={{ background: color, width: `calc(${size} * 0.5)`, height: `calc(${size} * 0.5)`, left: x, top: y }} />
    );
  }
  return (
    <motion.div className="pointer-events-none absolute rounded-full blur-3xl"
      style={{ background: color, width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -30, 0, 20, 0], x: [0, 15, -10, 5, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }} />
  );
}

/* ── Mock Timestamp Helper ───────────────────────── */
function mockTimestamp(dateStr: string) {
  return {
    seconds: Math.floor(new Date(dateStr).getTime() / 1000),
    nanoseconds: 0,
    toDate: () => new Date(dateStr),
    toMillis: () => new Date(dateStr).getTime(),
    isEqual: () => false,
    valueOf: () => "",
  } as unknown as import("firebase/firestore").Timestamp;
}

/* ── Section Wrapper with InView ─────────────────── */
function AnimatedSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO PAGE
   ═══════════════════════════════════════════════════ */
export default function DemoPage() {
  const { t, language } = useDirection();
  const isMobile = useIsMobile();

  /* ── Interactive State ─────────────────────────── */
  const [activeFilter, setActiveFilter] = useState("all");
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set(["trip-2"]));
  const [currentPhase, setCurrentPhase] = useState<"not_started" | "departing" | "in_destination" | "returning" | "completed">("in_destination");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>({ 0: 24, 1: 12 });
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, "pending" | "approved" | "rejected">>({ "1": "pending", "2": "pending", "3": "pending" });
  const [bookingFilter, setBookingFilter] = useState("all");

  const toggleWishlist = useCallback((id: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ── Mock Data ─────────────────────────────────── */
  const mockTrips = [
    { id: "trip-1", title: t("رحلة العمرة الذهبية", "Golden Umrah Package"), destination: t("مكة المكرمة", "Makkah"), departureDate: "Mar 15, 2026", returnDate: "Mar 25, 2026", price: 450, capacity: 50, booked: 42, campaignName: t("حملة النور", "Al Noor Campaign"), tags: [t("عمرة", "Umrah"), t("5 نجوم", "5 Star"), t("VIP", "VIP")], tripType: "umrah" },
    { id: "trip-2", title: t("زيارة كربلاء المقدسة", "Holy Karbala Pilgrimage"), destination: t("كربلاء", "Karbala"), departureDate: "Apr 5, 2026", returnDate: "Apr 12, 2026", price: 280, capacity: 40, booked: 35, campaignName: t("حملة الإمام", "Al Imam Campaign"), tags: [t("زيارة", "Ziyarat"), t("أربعين", "Arbaeen")], tripType: "ziyarat" },
    { id: "trip-3", title: t("رحلة الحج المباركة", "Blessed Hajj Journey"), destination: t("مكة والمدينة", "Makkah & Madinah"), departureDate: "Jun 1, 2026", returnDate: "Jun 20, 2026", price: 1200, capacity: 60, booked: 55, campaignName: t("حملة الصفا", "Al Safa Campaign"), tags: [t("حج", "Hajj"), t("شامل", "All Inclusive")], tripType: "hajj" },
    { id: "trip-4", title: t("زيارة النجف الأشرف", "Holy Najaf Visit"), destination: t("النجف", "Najaf"), departureDate: "May 10, 2026", returnDate: "May 15, 2026", price: 195, capacity: 30, booked: 12, campaignName: t("حملة المسار", "Al Masar Campaign"), tags: [t("زيارة", "Ziyarat"), t("اقتصادي", "Economy")], tripType: "ziyarat" },
  ];

  const filterPills = [
    { id: "all", label: t("الكل", "All"), emoji: "🧭" },
    { id: "hajj", label: t("حج", "Hajj"), emoji: "🕋" },
    { id: "umrah", label: t("عمرة", "Umrah"), emoji: "✨" },
    { id: "ziyarat", label: t("زيارة", "Ziyarat"), emoji: "🌿" },
  ];

  const filteredTrips = activeFilter === "all" ? mockTrips : mockTrips.filter((trip) => trip.tripType === activeFilter);

  const trackerSteps = [
    { labelAr: "المغادرة", labelEn: "Departure", date: "Mar 15", location: t("الكويت", "Kuwait") },
    { labelAr: "في الوجهة", labelEn: "At Destination", date: "Mar 16-24", location: t("مكة", "Makkah") },
    { labelAr: "العودة", labelEn: "Return", date: "Mar 24" },
    { labelAr: "الوصول", labelEn: "Arrival", date: "Mar 25", location: t("الكويت", "Kuwait") },
  ];

  const mockReviews = [
    { travelerName: t("أحمد الكندري", "Ahmed Al-Kandari"), rating: 5, title: t("رحلة لا تُنسى", "An Unforgettable Journey"), body: t("تجربة رائعة من البداية إلى النهاية. التنظيم كان ممتازاً والفندق قريب جداً من الحرم. أنصح الجميع بهذه الحملة. الخدمة كانت فوق التوقعات والمرشدين كانوا على دراية كاملة بجميع المناسك.", "A wonderful experience from start to finish. The organization was excellent and the hotel was very close to the Haram. I recommend this campaign to everyone. The service exceeded expectations and guides were fully knowledgeable about all rituals."), helpful: 24, verified: true, createdAt: t("قبل ٣ أيام", "3 days ago") },
    { travelerName: t("فاطمة العلي", "Fatima Al-Ali"), rating: 4, title: t("تجربة مميزة", "A Special Experience"), body: t("رحلة جميلة وتنظيم جيد. كنت أتمنى لو كانت الإقامة أطول قليلاً لكن بشكل عام كانت تجربة رائعة .", "Beautiful trip and good organization. I wished the stay was a bit longer but overall it was a great experience."), helpful: 12, verified: true, createdAt: t("قبل أسبوع", "1 week ago") },
  ];

  const mockCampaigns = [
    { name: t("حملة النور للحج والعمرة", "Al Noor Hajj & Umrah"), description: t("حملة رائدة في تنظيم رحلات الحج والعمرة منذ أكثر من ١٥ عام", "A leading campaign organizing Hajj & Umrah trips for over 15 years"), rating: 4.8, totalTrips: 24, verified: true },
    { name: t("حملة المسار", "Al Masar Campaign"), description: t("متخصصون في الزيارات الدينية إلى العراق وإيران", "Specialists in religious visits to Iraq and Iran"), rating: 4.6, totalTrips: 18, verified: true },
  ];

  const mockBookings = [
    { id: "b1", traveler: t("خالد الشمري", "Khaled Al-Shamri"), trip: t("العمرة الذهبية", "Golden Umrah"), status: "confirmed" as const, amount: 450 },
    { id: "b2", traveler: t("نورة العتيبي", "Noura Al-Otibi"), trip: t("حج ٢٠٢٦", "Hajj 2026"), status: "pending" as const, amount: 1200 },
    { id: "b3", traveler: t("محمد الدوسري", "Mohammed Al-Dosari"), trip: t("زيارة كربلاء", "Karbala Visit"), status: "paid" as const, amount: 280 },
    { id: "b4", traveler: t("سارة الحربي", "Sara Al-Harbi"), trip: t("النجف الأشرف", "Holy Najaf"), status: "confirmed" as const, amount: 195 },
  ];

  const verificationQueue = [
    { id: "1", name: t("حملة الهداية", "Al Hedaya Campaign"), submitted: t("قبل يومين", "2 days ago"), docs: 5 },
    { id: "2", name: t("حملة الإيمان", "Al Iman Campaign"), submitted: t("قبل ٤ أيام", "4 days ago"), docs: 3 },
    { id: "3", name: t("حملة السلام", "Al Salam Campaign"), submitted: t("قبل أسبوع", "1 week ago"), docs: 7 },
  ];

  const mockItinerary: ItineraryBlock[] = [
    { id: "1", dayNumber: 1, sortOrder: 1, type: "flight", title: "Kuwait → Jeddah", titleAr: "الكويت → جدة", description: "Direct flight KU 101", descriptionAr: "رحلة مباشرة KU 101", location: "Jeddah", startTime: "06:00", endTime: "08:30", date: mockTimestamp("2026-03-15") },
    { id: "2", dayNumber: 1, sortOrder: 2, type: "transport", title: "Airport to Hotel", titleAr: "المطار إلى الفندق", location: "Makkah", startTime: "09:30", date: mockTimestamp("2026-03-15") },
    { id: "3", dayNumber: 1, sortOrder: 3, type: "hotel_checkin", title: "Hotel Check-in", titleAr: "تسجيل الفندق", description: "Hilton Makkah Convention", descriptionAr: "هيلتون مكة", location: "Makkah", startTime: "11:00", date: mockTimestamp("2026-03-15") },
    { id: "4", dayNumber: 2, sortOrder: 1, type: "religious", title: "Umrah Rituals", titleAr: "مناسك العمرة", description: "Tawaf and Sa'i", descriptionAr: "الطواف والسعي", location: "Masjid al-Haram", startTime: "05:00", endTime: "10:00", date: mockTimestamp("2026-03-16") },
    { id: "5", dayNumber: 2, sortOrder: 2, type: "meal", title: "Group Lunch", titleAr: "غداء جماعي", location: "Hotel Restaurant", startTime: "13:00", date: mockTimestamp("2026-03-16") },
    { id: "6", dayNumber: 2, sortOrder: 3, type: "free_time", title: "Free Time", titleAr: "وقت حر", description: "Shopping or rest", descriptionAr: "تسوق أو استراحة", startTime: "15:00", endTime: "20:00", date: mockTimestamp("2026-03-16") },
    { id: "7", dayNumber: 3, sortOrder: 1, type: "activity", title: "Guided Tour", titleAr: "جولة مع مرشد", description: "Historical sites of Makkah", descriptionAr: "المواقع التاريخية في مكة", location: "Makkah", startTime: "08:00", endTime: "12:00", date: mockTimestamp("2026-03-17") },
  ];

  const filteredBookings = bookingFilter === "all" ? mockBookings : mockBookings.filter((b) => b.status === bookingFilter);
  const statusVariantMap: Record<string, "success" | "warning" | "info"> = { confirmed: "success", pending: "warning", paid: "info" };

  const features = [
    { icon: <Languages className="h-6 w-6" />, title: t("منصة ثنائية اللغة", "Bilingual Platform"), desc: t("عربي وإنجليزي مع دعم كامل للكتابة من اليمين لليسار", "Arabic & English with full RTL support"), large: true },
    { icon: <Radio className="h-6 w-6" />, title: t("تتبع مباشر", "Live Tracking"), desc: t("تتبع رحلتك في الوقت الفعلي", "Real-time trip progress tracking") },
    { icon: <Search className="h-6 w-6" />, title: t("بحث ذكي", "Smart Search"), desc: t("تصفية حسب النوع والوجهة والسعر", "Filter by type, destination, price") },
    { icon: <CreditCard className="h-6 w-6" />, title: t("دفع آمن", "Secure Payments"), desc: t("كي نت وفيزا وماستركارد", "KNET, Visa, MasterCard"), large: true },
    { icon: <BarChart3 className="h-6 w-6" />, title: t("تحليلات الحملات", "Campaign Analytics"), desc: t("الإيرادات والحجوزات والسعة", "Revenue, bookings, capacity insights") },
    { icon: <HeadphonesIcon className="h-6 w-6" />, title: t("دعم على مدار الساعة", "24/7 Support"), desc: t("تنبيهات طوارئ وحل نزاعات", "SOS alerts & dispute resolution") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* ═══ STICKY NAV ═══════════════════════════════ */}
      <nav className="sticky top-0 z-[var(--z-topbar)] border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#0B1120]/80">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500">
                <Compass className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Rahal</span>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">DEMO</span>
            </div>
            <LanguageToggle />
          </div>
        </Container>
      </nav>

      {/* ═══ HERO ═════════════════════════════════════ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="eo-gradient-hero absolute inset-0" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <GlowOrb color="rgba(14,165,233,0.15)" size="400px" x="10%" y="20%" delay={0} staticMode={isMobile} />
        <GlowOrb color="rgba(139,92,246,0.12)" size="350px" x="70%" y="10%" delay={2} staticMode={isMobile} />
        <GlowOrb color="rgba(249,115,22,0.08)" size="250px" x="50%" y="70%" delay={4} staticMode={isMobile} />

        <Container className="relative text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-sky-200 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-300" />
              {t("عرض تفاعلي للمنصة", "Interactive Platform Demo")}
            </motion.div>

            <motion.h1 variants={fadeUp} className="eo-text-gradient text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl" style={{ lineHeight: 1.1 }}>
              Rahal
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-2 text-lg font-medium text-sky-100 sm:text-xl">
              {t("حج · عمرة · زيارات مقدسة", "Hajj · Umrah · Sacred Ziyarat")}
            </motion.p>

            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sky-200/70 sm:text-base">
              {t(
                "استكشف منصة رحال الكاملة — من اكتشاف الرحلات إلى إدارة الحملات والإشراف الإداري. جميع الميزات تفاعلية.",
                "Explore the full Rahal platform — from trip discovery to campaign management to admin oversight. All features, all interactive."
              )}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => scrollTo("traveler")} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-xl hover:shadow-sky-500/30">
                <PlaneTakeoff className="h-4 w-4" />
                {t("تطبيق المسافر", "Traveler App")}
              </button>
              <button onClick={() => scrollTo("campaign")} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                <Building2 className="h-4 w-4" />
                {t("بوابة الحملات", "Campaign Portal")}
              </button>
              <button onClick={() => scrollTo("admin")} className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                <Shield className="h-4 w-4" />
                {t("لوحة الإدارة", "Admin Console")}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <ChevronDown className="mx-auto h-6 w-6 text-sky-300/50" />
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ═══ STATS BAR ════════════════════════════════ */}
      <AnimatedSection className="relative z-10 -mt-10 px-4">
        <Container size="lg">
          <motion.div variants={fadeUp} className="eo-glass rounded-2xl border border-white/20 p-6 shadow-[0_8px_40px_rgba(2,6,23,0.12)] dark:border-[#2D3B4F] dark:bg-[#111827]/90">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: 12500, suffix: "+", label: t("مسافر سعيد", "Happy Travelers"), icon: <Users className="h-5 w-5 text-sky-500" /> },
                { value: 340, suffix: "+", label: t("رحلة مكتملة", "Trips Completed"), icon: <Map className="h-5 w-5 text-violet-500" /> },
                { value: 45, suffix: "", label: t("حملة موثقة", "Verified Campaigns"), icon: <Shield className="h-5 w-5 text-emerald-500" /> },
                { value: 4.9, suffix: "/5", label: t("تقييم المنصة", "Platform Rating"), icon: <Star className="h-5 w-5 text-orange-400" /> },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1E293B]">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {stat.value === 4.9 ? <span className="font-numbers tabular-nums">4.9/5</span> : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* ═══ TRAVELER APP SHOWCASE ════════════════════ */}
      <AnimatedSection id="traveler" className="py-20">
        <Container>
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              <PlaneTakeoff className="h-3.5 w-3.5" />
              {t("تطبيق المسافر", "Traveler App")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {t("اكتشف واحجز رحلتك", "Discover & Book Your Pilgrimage")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("تصفح الرحلات، قارن الأسعار، واحجز بثقة", "Browse trips, compare prices, and book with confidence")}
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === pill.id
                    ? "bg-sky-900 text-white dark:bg-sky-50 dark:text-sky-900"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-slate-200"
                }`}
              >
                <span>{pill.emoji}</span>
                {pill.label}
              </button>
            ))}
          </motion.div>

          {/* Trip cards grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTrips.map((trip, i) => (
              <motion.div key={trip.id} variants={fadeScale} className="animate-stagger-fade-up" style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}>
                <TripCard
                  title={trip.title}
                  destination={trip.destination}
                  departureDate={trip.departureDate}
                  returnDate={trip.returnDate}
                  price={trip.price}
                  capacity={trip.capacity}
                  booked={trip.booked}
                  status="active"
                  campaignName={trip.campaignName}
                  tags={trip.tags}
                  tripId={trip.id}
                  wishlisted={wishlistedIds.has(trip.id)}
                  onWishlistToggle={() => toggleWishlist(trip.id)}
                  onClick={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Live Trip Tracker */}
          <motion.div variants={fadeUp} className="mt-16">
            <h3 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
              <Radio className="mb-1 inline h-5 w-5 text-sky-500" />{" "}
              {t("تتبع رحلتك مباشرة", "Track Your Trip Live")}
            </h3>
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2D3B4F] dark:bg-[#1E293B]">
              <LiveTripTracker currentPhase={currentPhase} steps={trackerSteps} />
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(["not_started", "departing", "in_destination", "returning", "completed"] as const).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setCurrentPhase(phase)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      currentPhase === phase
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-[#2D3B4F] dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {phase === "not_started" ? t("لم تبدأ", "Not Started")
                      : phase === "departing" ? t("المغادرة", "Departing")
                      : phase === "in_destination" ? t("في الوجهة", "At Destination")
                      : phase === "returning" ? t("العودة", "Returning")
                      : t("مكتملة", "Completed")}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div variants={fadeUp} className="mt-16">
            <h3 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
              <Star className="mb-1 inline h-5 w-5 text-orange-400" />{" "}
              {t("آراء المسافرين", "Traveler Reviews")}
            </h3>
            <div className="mx-auto max-w-2xl space-y-4">
              {mockReviews.map((review, i) => (
                <ReviewCard
                  key={i}
                  travelerName={review.travelerName}
                  rating={review.rating}
                  title={review.title}
                  body={review.body}
                  helpful={helpfulCounts[i] ?? review.helpful}
                  verified={review.verified}
                  createdAt={review.createdAt}
                  onHelpful={() => setHelpfulCounts((prev) => ({ ...prev, [i]: (prev[i] ?? review.helpful) + 1 }))}
                />
              ))}
            </div>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* ═══ CAMPAIGN PORTAL SHOWCASE ═════════════════ */}
      <AnimatedSection id="campaign" className="relative overflow-hidden py-20">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #020617, #0C4A6E, #4C1D95)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <GlowOrb color="rgba(139,92,246,0.12)" size="300px" x="80%" y="10%" delay={1} staticMode={isMobile} />
        <GlowOrb color="rgba(14,165,233,0.1)" size="250px" x="5%" y="60%" delay={3} staticMode={isMobile} />

        <Container className="relative">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <Building2 className="h-3.5 w-3.5" />
              {t("بوابة الحملات", "Campaign Portal")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              {t("أدر حملاتك بكفاءة", "Manage Your Campaigns")}
            </h2>
            <p className="mt-2 text-sky-200/60">
              {t("لوحة تحكم شاملة لمنظمي الرحلات", "A comprehensive dashboard for trip organizers")}
            </p>
          </motion.div>

          {/* Campaign Cards */}
          <motion.div variants={fadeUp} className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
            {mockCampaigns.map((campaign, i) => (
              <CampaignCard key={i} name={campaign.name} description={campaign.description} rating={campaign.rating} totalTrips={campaign.totalTrips} verified={campaign.verified} onClick={() => {}} />
            ))}
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div variants={fadeUp} className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title={t("إجمالي الحجوزات", "Total Bookings")} value="1,248" change={{ value: 12, label: t("هذا الشهر", "this month") }} icon={<BookOpen className="h-5 w-5 text-sky-500" />} />
            <StatCard title={t("الإيرادات", "Revenue")} value="45,800 KWD" change={{ value: 8, label: t("هذا الشهر", "this month") }} icon={<Wallet className="h-5 w-5 text-emerald-500" />} />
            <StatCard title={t("الرحلات النشطة", "Active Trips")} value="6" icon={<Map className="h-5 w-5 text-violet-500" />} />
            <StatCard title={t("المسافرون", "Travelers")} value="312" change={{ value: 15, label: t("هذا الشهر", "this month") }} icon={<Users className="h-5 w-5 text-orange-500" />} />
          </motion.div>

          {/* Booking Table */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-white">{t("الحجوزات الأخيرة", "Recent Bookings")}</h3>
              <div className="flex gap-2">
                {[
                  { id: "all", label: t("الكل", "All") },
                  { id: "confirmed", label: t("مؤكد", "Confirmed") },
                  { id: "pending", label: t("بانتظار", "Pending") },
                  { id: "paid", label: t("مدفوع", "Paid") },
                ].map((f) => (
                  <button key={f.id} onClick={() => setBookingFilter(f.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${bookingFilter === f.id ? "bg-white/15 text-white" : "text-sky-200/60 hover:text-white"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar alt={booking.traveler} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-white">{booking.traveler}</p>
                      <p className="text-xs text-sky-200/50">{booking.trip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariantMap[booking.status] ?? "default"} size="sm">
                      {booking.status === "confirmed" ? t("مؤكد", "Confirmed") : booking.status === "pending" ? t("بانتظار", "Pending") : t("مدفوع", "Paid")}
                    </Badge>
                    <span className="font-numbers text-sm font-semibold text-white">{booking.amount} KWD</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* ═══ ADMIN CONSOLE SHOWCASE ═══════════════════ */}
      <AnimatedSection id="admin" className="relative py-20">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <Container className="relative">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              <Shield className="h-3.5 w-3.5" />
              {t("لوحة الإدارة", "Admin Console")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {t("الإشراف والتحكم بالمنصة", "Platform Oversight & Control")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("مراقبة شاملة، تحقق من الحملات، وإدارة النزاعات", "Full monitoring, campaign verification, and dispute management")}
            </p>
          </motion.div>

          {/* Admin Stats */}
          <motion.div variants={fadeUp} className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title={t("الحملات المسجلة", "Campaigns")} value="45" change={{ value: 5, label: t("هذا الأسبوع", "this week") }} icon={<Building2 className="h-5 w-5 text-violet-500" />} />
            <StatCard title={t("المستخدمون", "Users")} value="12,580" change={{ value: 320, label: t("جدد", "new") }} icon={<Users className="h-5 w-5 text-sky-500" />} />
            <StatCard title={t("إجمالي المعاملات", "Transactions")} value="89,450 KWD" icon={<Wallet className="h-5 w-5 text-emerald-500" />} />
            <StatCard title={t("النزاعات المفتوحة", "Disputes")} value="3" change={{ value: -2, label: t("هذا الأسبوع", "this week") }} icon={<AlertTriangle className="h-5 w-5 text-orange-500" />} />
          </motion.div>

          {/* Verification Queue */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              {t("طلبات التحقق", "Verification Queue")}
            </h3>
            <div className="space-y-3">
              {verificationQueue.map((item) => {
                const status = verificationStatuses[item.id];
                return (
                  <div key={item.id} className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                    status === "approved" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/10"
                    : status === "rejected" ? "border-red-200 bg-red-50 dark:border-red-800/30 dark:bg-red-900/10"
                    : "border-slate-200 bg-white dark:border-[#2D3B4F] dark:bg-[#1E293B]"
                  }`}>
                    <div className="flex items-center gap-3">
                      <Avatar alt={item.name} size="md" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t("تقدم", "Submitted")} {item.submitted} · {item.docs} {t("مستندات", "documents")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === "approved" ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" /> {t("تمت الموافقة", "Approved")}
                        </span>
                      ) : status === "rejected" ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                          <XCircle className="h-4 w-4" /> {t("مرفوض", "Rejected")}
                        </span>
                      ) : (
                        <>
                          <Button size="sm" variant="primary" onClick={() => setVerificationStatuses((prev) => ({ ...prev, [item.id]: "approved" }))}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> {t("موافقة", "Approve")}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setVerificationStatuses((prev) => ({ ...prev, [item.id]: "rejected" }))}>
                            <XCircle className="h-3.5 w-3.5" /> {t("رفض", "Reject")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* ═══ FEATURE BENTO GRID ═══════════════════════ */}
      <AnimatedSection className="relative overflow-hidden py-20">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #020617, #0C4A6E, #4C1D95)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <Container className="relative">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t("كل ما تحتاجه في منصة واحدة", "Everything You Need in One Platform")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeScale}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.07] ${feat.large ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="mt-1 text-sm text-sky-200/60">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </AnimatedSection>

      {/* ═══ ITINERARY PREVIEW ════════════════════════ */}
      <AnimatedSection className="py-20">
        <Container>
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              <MapPin className="h-3.5 w-3.5" />
              {t("جدول الرحلة", "Trip Itinerary")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {t("خطة يومية مفصلة", "Detailed Day-by-Day Plan")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("اعرف ما يحدث في كل يوم من رحلتك", "Know exactly what happens each day of your trip")}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2D3B4F] dark:bg-[#1E293B]">
            <ItineraryTimeline blocks={mockItinerary} />
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* ═══ CTA SECTION ══════════════════════════════ */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #020617, #0C4A6E, #4C1D95)" }} />
        <GlowOrb color="rgba(139,92,246,0.15)" size="300px" x="20%" y="30%" delay={0} staticMode={isMobile} />
        <GlowOrb color="rgba(14,165,233,0.12)" size="250px" x="75%" y="50%" delay={2} staticMode={isMobile} />

        <Container className="relative text-center">
          <h2 className="eo-text-gradient text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            {t("مستعد لتحويل تجربة سفرك؟", "Ready to Transform Your Travel?")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sky-200/60">
            {t(
              "انضم إلى آلاف المسافرين الذين يستخدمون رحال لرحلات حج وعمرة وزيارات لا تُنسى.",
              "Join thousands of travelers using Rahal for unforgettable Hajj, Umrah, and Ziyarat trips."
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/discover" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 animate-cta-glow">
              <Compass className="h-4 w-4" />
              {t("استكشف الرحلات", "Explore Trips")}
            </Link>
            <Link href="/register-campaign" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              <Building2 className="h-4 w-4" />
              {t("سجّل حملتك", "List Your Campaign")}
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-sky-200/40">
            <span className="flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" /> {t("١٠+ وجهات", "10+ Destinations")}</span>
            <span className="h-3 w-px bg-sky-400/20" />
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t("حملات موثقة", "Verified Campaigns")}</span>
            <span className="h-3 w-px bg-sky-400/20" />
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {t("١٢,٥٠٠+ مسافر", "12,500+ Travelers")}</span>
          </div>
        </Container>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-[#2D3B4F] dark:bg-[#0B1120]">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500">
                <Compass className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Rahal</span>
            </div>
            <p className="text-xs text-slate-400">
              © 2026 Rahal. {t("جميع الحقوق محفوظة.", "All rights reserved.")}
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
