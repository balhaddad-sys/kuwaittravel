"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import {
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronLeft,
  Shield,
  Globe,
  Sparkles,
  BadgeCheck,
  User,
} from "lucide-react";

const menuItems = [
  {
    labelAr: "المستندات والجوازات",
    labelEn: "Documents",
    descAr: "هوية، جواز، تأشيرة",
    descEn: "ID, passport, visa",
    icon: FileText,
    href: "/app/profile/documents",
    iconBg: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-indigo-200",
  },
  {
    labelAr: "طرق الدفع",
    labelEn: "Payment Methods",
    descAr: "بطاقات ومحفظة",
    descEn: "Cards & wallet",
    icon: CreditCard,
    href: "/app/profile/payment-methods",
    iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    labelAr: "الأمان والخصوصية",
    labelEn: "Security",
    descAr: "كلمة مرور والحماية",
    descEn: "Password & protection",
    icon: Shield,
    href: "/app/profile/security",
    iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    labelAr: "الإعدادات",
    labelEn: "Settings",
    descAr: "التفضيلات والإشعارات",
    descEn: "Preferences & notifications",
    icon: Settings,
    href: "/app/profile/settings",
    iconBg: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-indigo-200",
  },
  {
    labelAr: "المساعدة والدعم",
    labelEn: "Help & Support",
    descAr: "الأسئلة الشائعة",
    descEn: "FAQs & contact",
    icon: HelpCircle,
    href: "/app/help",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t, language } = useDirection();
  const { userData, firebaseUser, logout, loading: authLoading } = useAuth();
  const hasAdminRole = userData?.role === "admin" || userData?.role === "super_admin";
  const showAdminShortcut = hasAdminRole || isPrivilegedAdminEmail(firebaseUser?.email);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName =
    language === "ar"
      ? userData?.displayNameAr || userData?.displayName || ""
      : userData?.displayName || userData?.displayNameAr || "";

  /* ─── Guest view ─── */
  if (!firebaseUser && !authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-indigo-900">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 pb-20 pt-10 sm:pb-24 sm:pt-14">
          <div className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <Container className="relative">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.125rem] bg-white/15 ring-2 ring-white/30 sm:h-24 sm:w-24">
                <User className="h-10 w-10 text-white/60" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{t("مرحباً بك", "Welcome")}</h1>
                <p className="mt-1 text-sm text-indigo-100/80">{t("سجّل دخولك للوصول لحسابك", "Sign in to access your account")}</p>
              </div>
            </div>
          </Container>
        </div>
        <div className="-mt-10">
          <Container className="space-y-3 pb-6">
            <Button
              variant="primary"
              fullWidth
              className="h-14 rounded-2xl text-base font-bold shadow-lg"
              leftIcon={<LogIn className="h-5 w-5" />}
              onClick={() => router.push("/login")}
            >
              {t("تسجيل الدخول", "Sign In")}
            </Button>
            {/* Settings still accessible for guests (language, dark mode) */}
            <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:border-[#1A2D48]/60 dark:bg-indigo-800/90">
              <button
                onClick={() => router.push("/app/profile/settings")}
                className="group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-gray-50/80 dark:hover:bg-indigo-700/40 border-b border-gray-100 dark:border-[#1A2D48]/50"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-indigo-200"><Settings className="h-[1.125rem] w-[1.125rem]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">{t("الإعدادات", "Settings")}</p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-indigo-300/45">{t("اللغة والوضع الداكن", "Language & dark mode")}</p>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 rtl:rotate-180 dark:text-indigo-400/50" />
              </button>
              <button
                onClick={() => router.push("/app/help")}
                className="group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-gray-50/80 dark:hover:bg-indigo-700/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><HelpCircle className="h-[1.125rem] w-[1.125rem]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">{t("المساعدة والدعم", "Help & Support")}</p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-indigo-300/45">{t("الأسئلة الشائعة", "FAQs & contact")}</p>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 rtl:rotate-180 dark:text-indigo-400/50" />
              </button>
            </div>
            {/* Language toggle */}
            <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-[#1A2D48]/60 dark:bg-indigo-800/90">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><Globe className="h-[1.125rem] w-[1.125rem]" /></span>
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">{t("اللغة", "Language")}</p>
                </div>
                <LanguageToggle />
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-indigo-900">

      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 pb-20 pt-10 sm:pb-24 sm:pt-14">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -start-12 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="pointer-events-none absolute top-0 start-1/3 h-32 w-64 rounded-full bg-orange-400/10 blur-3xl" />

        <Container className="relative">
          <div className="flex items-center gap-5">
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <div className="rounded-[1.25rem] p-0.5 ring-2 ring-white/30 shadow-xl">
                <Avatar
                  size="xl"
                  className="h-20 w-20 rounded-[1.125rem] sm:h-24 sm:w-24"
                />
              </div>
              <span className="absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full border-[2.5px] border-indigo-600 bg-emerald-400 shadow-md" />
            </div>

            {/* Name + info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {displayName || t("مسافر", "Traveler")}
                </h1>
                {userData?.isVerified && (
                  <BadgeCheck className="h-5 w-5 shrink-0 text-orange-300 drop-shadow" />
                )}
              </div>
              <p className="mt-1 text-sm text-indigo-100/80">
                {userData?.phone || userData?.email || ""}
              </p>
              {userData?.isVerified && (
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                  <BadgeCheck className="h-3 w-3 text-orange-300" />
                  {t("مسافر موثق", "Verified Traveler")}
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Card sheet overlapping hero ─── */}
      <div className="-mt-10">
        <Container className="space-y-3 pb-6">

          {/* ─── Menu Card ─── */}
          <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:border-[#1A2D48]/60 dark:bg-indigo-800/90">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className={`group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-gray-50/80 dark:hover:bg-indigo-700/40 ${
                  i < menuItems.length - 1
                    ? "border-b border-gray-100 dark:border-[#1A2D48]/50"
                    : ""
                }`}
              >
                {/* Icon */}
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <item.icon className="h-[1.125rem] w-[1.125rem]" />
                </span>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {t(item.labelAr, item.labelEn)}
                  </p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-indigo-300/45">
                    {t(item.descAr, item.descEn)}
                  </p>
                </div>

                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-indigo-400/50" />
              </button>
            ))}
          </div>

          {/* ─── Admin Shortcut ─── */}
          {showAdminShortcut && (
            <div className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white shadow-[0_2px_12px_rgba(251,191,36,0.10)] dark:border-orange-700/30 dark:bg-indigo-800/90">
              <button
                onClick={() => router.push(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
                className="group flex w-full items-center gap-4 px-4 py-4 text-start transition-colors hover:bg-orange-50/60 dark:hover:bg-orange-900/10"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-orange-400 shadow-md dark:bg-gray-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {t("وضع الإدارة", "Admin Mode")}
                  </p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-indigo-300/45">
                    {t("إدارة الحملات والمستخدمين", "Manage campaigns and platform users")}
                  </p>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-indigo-400/50" />
              </button>
            </div>
          )}

          {/* ─── Language ─── */}
          <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-[#1A2D48]/60 dark:bg-indigo-800/90">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Globe className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <div>
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {t("اللغة", "Language")}
                  </p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-indigo-300/45">
                    {t("عربي / English", "Arabic / English")}
                  </p>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </div>

          {/* ─── Sign Out ─── */}
          <Button
            variant="ghost"
            fullWidth
            className="h-12 rounded-2xl border border-red-100/80 bg-white text-red-500 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:bg-indigo-800/90 dark:text-red-400 dark:hover:bg-red-900/10"
            leftIcon={<LogOut className="h-[1.125rem] w-[1.125rem]" />}
            onClick={handleLogout}
          >
            {t("تسجيل الخروج", "Sign Out")}
          </Button>

          <div className="h-4" />
        </Container>
      </div>
    </div>
  );
}
