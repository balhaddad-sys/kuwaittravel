"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import {
  PlaneTakeoff,
  Building2,
  Shield,
  Compass,
  Sparkles,
  MapPin,
  Users,
  Star,
  ChevronLeft,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { userData, firebaseUser } = useAuth();

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
      icon: <PlaneTakeoff className="h-5 w-5 text-white" />,
      iconBg: "from-navy-600 to-navy-800",
      stats: t("36+ رحلة", "36+ trips"),
      onClick: () => router.push("/app/discover"),
    },
    {
      title: t("بوابة الحملات", "Campaign Portal"),
      subtitle: t(
        "إدارة الرحلات والحجوزات والوثائق",
        "Manage trips, bookings, and documents"
      ),
      icon: <Building2 className="h-5 w-5 text-white" />,
      iconBg: "from-gold-500 to-gold-600",
      stats: t("إدارة شاملة", "Full management"),
      onClick: () => router.push("/portal/dashboard"),
    },
    ...(canSeeAdminEntry
      ? [
          {
            title: t("إدارة المشرفين", "Admin Console"),
            subtitle: t(
              "دخول مخصص لفريق الإدارة",
              "Dedicated entry for administrators"
            ),
            icon: <Shield className="h-5 w-5 text-white" />,
            iconBg: "from-navy-700 to-navy-900",
            stats: t("وصول متقدم", "Advanced access"),
            onClick: () =>
              router.push(hasAdminRole ? "/admin/dashboard" : "/admin-login"),
          },
        ]
      : []),
  ];

  const highlights = [
    {
      icon: <MapPin className="h-4 w-4" />,
      label: t("وجهات متعددة", "Multiple Destinations"),
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: t("حجز جماعي", "Group Booking"),
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: t("حملات موثقة", "Verified Campaigns"),
    },
  ];

  return (
    <div className="travel-orbit-bg min-h-screen px-4 py-4 sm:px-8 sm:py-6">
      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-border/75 bg-white/76 px-3 py-1.5 shadow-card backdrop-blur-sm dark:border-surface-dark-border/75 dark:bg-surface-dark-card/74 sm:gap-3 sm:px-4 sm:py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_6px_18px_rgba(229,128,29,0.35)] sm:h-9 sm:w-9">
              <Compass className="h-4 w-4 text-white" />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-navy-700 dark:text-navy-100">
                Rahal Travel OS
              </p>
              <p className="hidden text-[11px] text-navy-500 dark:text-navy-300 sm:block">
                {t("منصة رحلات ثنائية اللغة", "Bilingual Travel Platform")}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        {/* Main Content */}
        <div className="mt-5 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Hero Section */}
          <section className="travel-section travel-mesh-bg p-5 sm:p-10">
            <div className="travel-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-body-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              {t("تجربة سفر أكثر أناقة", "Refined Travel Experience")}
            </div>

            <h1 className="travel-title mt-3 text-2xl font-extrabold leading-tight text-navy-900 dark:text-white sm:mt-4 sm:text-5xl">
              {t("رحال", "Rahal")}
            </h1>
            <p className="mt-2 max-w-2xl text-body-md text-navy-600 dark:text-navy-200 sm:mt-3 sm:text-body-lg">
              {t(
                "بوابة سفر رقمية مصممة خصيصًا للرحلات الزيارية، مع واجهة متقنة تدعم العربية والإنجليزية بسلاسة كاملة.",
                "A premium travel operating system for pilgrimage journeys, crafted for seamless Arabic and English experiences."
              )}
            </p>

            {/* Feature highlights */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">
              {highlights.map((h) => (
                <span
                  key={h.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy-200/60 bg-navy-50/60 px-2.5 py-1 text-[11px] font-medium text-navy-600 dark:border-navy-700/50 dark:bg-navy-900/40 dark:text-navy-300"
                >
                  {h.icon}
                  {h.label}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
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

          {/* Entry Points */}
          <section className="grid gap-3">
            {entryPoints.map((entry, i) => (
              <button
                key={entry.title}
                onClick={entry.onClick}
                className="travel-panel group rounded-xl p-3.5 text-start transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.995] sm:rounded-2xl sm:p-4 animate-stagger-fade-up"
                style={{ "--stagger-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${entry.iconBg} shadow-md`}
                  >
                    {entry.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-lg font-bold text-navy-900 dark:text-white">
                        {entry.title}
                      </p>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-navy-300 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5 dark:text-navy-500" />
                    </div>
                    <p className="mt-0.5 text-body-sm text-navy-500 dark:text-navy-300">
                      {entry.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </section>
        </div>

        {/* Footer */}
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
