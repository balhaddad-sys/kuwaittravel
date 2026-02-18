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
  ChevronLeft,
  Shield,
  Globe,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const menuItems = [
  {
    labelAr: "المستندات والجوازات",
    labelEn: "Documents",
    descAr: "هوية، جواز، تأشيرة",
    descEn: "ID, passport, visa",
    icon: FileText,
    href: "/app/profile/documents",
    iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  },
  {
    labelAr: "طرق الدفع",
    labelEn: "Payment Methods",
    descAr: "بطاقات ومحفظة",
    descEn: "Cards & wallet",
    icon: CreditCard,
    href: "/app/profile/payment-methods",
    iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    labelAr: "الأمان والخصوصية",
    labelEn: "Security",
    descAr: "كلمة مرور والحماية",
    descEn: "Password & protection",
    icon: Shield,
    href: "/app/profile/security",
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    labelAr: "الإعدادات",
    labelEn: "Settings",
    descAr: "التفضيلات والإشعارات",
    descEn: "Preferences & notifications",
    icon: Settings,
    href: "/app/profile/settings",
    iconBg: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
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
  const { userData, firebaseUser, logout } = useAuth();
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

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-900">

      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 pb-20 pt-10 sm:pb-24 sm:pt-14">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -start-12 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="pointer-events-none absolute top-0 start-1/3 h-32 w-64 rounded-full bg-amber-400/10 blur-3xl" />

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
              <span className="absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full border-[2.5px] border-blue-600 bg-emerald-400 shadow-md" />
            </div>

            {/* Name + info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {displayName || t("مسافر", "Traveler")}
                </h1>
                {userData?.isVerified && (
                  <BadgeCheck className="h-5 w-5 shrink-0 text-amber-300 drop-shadow" />
                )}
              </div>
              <p className="mt-1 text-sm text-blue-100/80">
                {userData?.phone || userData?.email || ""}
              </p>
              {userData?.isVerified && (
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                  <BadgeCheck className="h-3 w-3 text-amber-300" />
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
          <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:border-slate-700/60 dark:bg-slate-800/90">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className={`group flex w-full items-center gap-4 px-4 py-3.5 text-start transition-colors hover:bg-gray-50/80 dark:hover:bg-slate-700/40 ${
                  i < menuItems.length - 1
                    ? "border-b border-gray-100 dark:border-slate-700/50"
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
                  <p className="text-[0.75rem] text-gray-400 dark:text-slate-500">
                    {t(item.descAr, item.descEn)}
                  </p>
                </div>

                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-slate-600" />
              </button>
            ))}
          </div>

          {/* ─── Admin Shortcut ─── */}
          {showAdminShortcut && (
            <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-[0_2px_12px_rgba(251,191,36,0.10)] dark:border-amber-700/30 dark:bg-slate-800/90">
              <button
                onClick={() => router.push(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
                className="group flex w-full items-center gap-4 px-4 py-4 text-start transition-colors hover:bg-amber-50/60 dark:hover:bg-amber-900/10"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-amber-400 shadow-md dark:bg-slate-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {t("وضع الإدارة", "Admin Mode")}
                  </p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-slate-500">
                    {t("إدارة الحملات والمستخدمين", "Manage campaigns and platform users")}
                  </p>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-slate-600" />
              </button>
            </div>
          )}

          {/* ─── Language ─── */}
          <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-slate-700/60 dark:bg-slate-800/90">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Globe className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <div>
                  <p className="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {t("اللغة", "Language")}
                  </p>
                  <p className="text-[0.75rem] text-gray-400 dark:text-slate-500">
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
            className="h-12 rounded-2xl border border-red-100/80 bg-white text-red-500 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:bg-slate-800/90 dark:text-red-400 dark:hover:bg-red-900/10"
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
