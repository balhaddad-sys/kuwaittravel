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
    iconBg: "bg-slate-100 text-slate-600 dark:bg-neutral-700/50 dark:text-neutral-200",
  },
  {
    labelAr: "طرق الدفع",
    labelEn: "Payment Methods",
    descAr: "بطاقات ومحفظة",
    descEn: "Cards & wallet",
    icon: CreditCard,
    href: "/app/profile/payment-methods",
    iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    labelAr: "الأمان والخصوصية",
    labelEn: "Security",
    descAr: "كلمة مرور والحماية",
    descEn: "Password & protection",
    icon: Shield,
    href: "/app/profile/security",
    iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  },
  {
    labelAr: "الإعدادات",
    labelEn: "Settings",
    descAr: "التفضيلات والإشعارات",
    descEn: "Preferences & notifications",
    icon: Settings,
    href: "/app/profile/settings",
    iconBg: "bg-slate-100 text-slate-600 dark:bg-neutral-700/50 dark:text-neutral-200",
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
      <div className="min-h-screen">
        {/* Clean header */}
        <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#EBEBEB] dark:border-[#383838] px-4 pt-10 pb-6">
          <Container>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-700/50">
                <User className="h-8 w-8 text-slate-400 dark:text-neutral-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#222222] dark:text-white">{t("مرحباً بك", "Welcome")}</h1>
                <p className="mt-0.5 text-sm text-[#717171] dark:text-neutral-400">{t("سجّل دخولك للوصول لحسابك", "Sign in to access your account")}</p>
              </div>
            </div>
          </Container>
        </div>

        <Container className="space-y-3 py-5">
          <Button
            variant="primary"
            fullWidth
            className="h-12 rounded-xl text-base font-bold"
            leftIcon={<LogIn className="h-5 w-5" />}
            onClick={() => router.push("/login")}
          >
            {t("تسجيل الدخول", "Sign In")}
          </Button>
          {/* Settings still accessible for guests */}
          <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white dark:border-[#383838]/60 dark:bg-[#262626]/90">
            <button
              onClick={() => router.push("/app/profile/settings")}
              className="group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-neutral-700/40 border-b border-[#EBEBEB] dark:border-[#383838]/50"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-neutral-700/50 dark:text-neutral-200"><Settings className="h-[1.125rem] w-[1.125rem]" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">{t("الإعدادات", "Settings")}</p>
                <p className="text-[0.75rem] text-[#717171] dark:text-neutral-400">{t("اللغة والوضع الداكن", "Language & dark mode")}</p>
              </div>
              <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180 dark:text-neutral-500" />
            </button>
            <button
              onClick={() => router.push("/app/help")}
              className="group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-neutral-700/40"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><HelpCircle className="h-[1.125rem] w-[1.125rem]" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">{t("المساعدة والدعم", "Help & Support")}</p>
                <p className="text-[0.75rem] text-[#717171] dark:text-neutral-400">{t("الأسئلة الشائعة", "FAQs & contact")}</p>
              </div>
              <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180 dark:text-neutral-500" />
            </button>
          </div>
          {/* Language toggle */}
          <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white px-4 py-3.5 dark:border-[#383838]/60 dark:bg-[#262626]/90">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"><Globe className="h-[1.125rem] w-[1.125rem]" /></span>
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">{t("اللغة", "Language")}</p>
              </div>
              <LanguageToggle />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* ─── Clean Header ─── */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#EBEBEB] dark:border-[#383838] px-4 pt-10 pb-6">
        <Container>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar
                size="xl"
                className="h-16 w-16 rounded-2xl"
              />
            </div>

            {/* Name + info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold text-[#222222] dark:text-white">
                  {displayName || t("مسافر", "Traveler")}
                </h1>
                {userData?.isVerified && (
                  <BadgeCheck className="h-5 w-5 shrink-0 text-sky-500" />
                )}
              </div>
              <p className="mt-0.5 text-sm text-[#717171] dark:text-neutral-400">
                {userData?.phone || userData?.email || ""}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Content ─── */}
      <Container className="space-y-3 py-5">

        {/* ─── Menu Card ─── */}
        <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white dark:border-[#383838]/60 dark:bg-[#262626]/90">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className={`group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-neutral-700/40 ${
                i < menuItems.length - 1
                  ? "border-b border-[#EBEBEB] dark:border-[#383838]/50"
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
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">
                  {t(item.labelAr, item.labelEn)}
                </p>
                <p className="text-[0.75rem] text-[#717171] dark:text-neutral-400">
                  {t(item.descAr, item.descEn)}
                </p>
              </div>

              <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180 dark:text-neutral-500" />
            </button>
          ))}
        </div>

        {/* ─── Admin Shortcut ─── */}
        {showAdminShortcut && (
          <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white dark:border-[#383838]/60 dark:bg-[#262626]/90">
            <button
              onClick={() => router.push(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
              className="group flex w-full items-center gap-4 px-4 py-4 text-start transition-colors hover:bg-slate-50 dark:hover:bg-neutral-700/40"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-neutral-700/50 dark:text-neutral-200">
                <Sparkles className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">
                  {t("وضع الإدارة", "Admin Mode")}
                </p>
                <p className="text-[0.75rem] text-[#717171] dark:text-neutral-400">
                  {t("إدارة الحملات والمستخدمين", "Manage campaigns and platform users")}
                </p>
              </div>
              <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180 dark:text-neutral-500" />
            </button>
          </div>
        )}

        {/* ─── Language ─── */}
        <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white px-4 py-3.5 dark:border-[#383838]/60 dark:bg-[#262626]/90">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                <Globe className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <div>
                <p className="text-[0.9375rem] font-semibold text-[#222222] dark:text-white">
                  {t("اللغة", "Language")}
                </p>
                <p className="text-[0.75rem] text-[#717171] dark:text-neutral-400">
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
          className="h-12 rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/20"
          leftIcon={<LogOut className="h-[1.125rem] w-[1.125rem]" />}
          onClick={handleLogout}
        >
          {t("تسجيل الخروج", "Sign Out")}
        </Button>

        <div className="h-4" />
      </Container>
    </div>
  );
}
