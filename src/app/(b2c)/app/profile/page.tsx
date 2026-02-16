"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import {
  FileText, CreditCard, Settings, HelpCircle, LogOut, ChevronLeft,
  Shield, Globe, Sparkles,
} from "lucide-react";

const menuItems = [
  { labelAr: "المستندات والجوازات", labelEn: "Documents", icon: FileText, href: "/app/profile/documents" },
  { labelAr: "طرق الدفع", labelEn: "Payment Methods", icon: CreditCard, href: "/app/profile/payment-methods" },
  { labelAr: "الأمان والخصوصية", labelEn: "Security", icon: Shield, href: "/app/profile/security" },
  { labelAr: "الإعدادات", labelEn: "Settings", icon: Settings, href: "/app/profile/settings" },
  { labelAr: "المساعدة والدعم", labelEn: "Help & Support", icon: HelpCircle, href: "/app/help" },
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

  return (
    <div className="travel-orbit-bg min-h-screen bg-surface-muted/45 dark:bg-surface-dark">
      {/* Profile Header */}
      <div className="bg-gradient-to-bl from-navy-700 to-navy-900 px-4 pb-6 pt-8 sm:pb-8 sm:pt-12">
        <Container>
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar size="xl" className="border-4 border-white/20" />
            <div className="min-w-0">
              <h1 className="truncate text-heading-md font-bold text-white sm:text-heading-lg">
                {language === "ar"
                  ? (userData?.displayNameAr || userData?.displayName || "")
                  : (userData?.displayName || userData?.displayNameAr || "")}
              </h1>
              <p className="text-body-md text-navy-200">
                {userData?.phone || userData?.email || ""}
              </p>
              {userData?.isVerified && (
                <Badge variant="gold" size="sm" className="mt-1">
                  {t("مسافر موثق", "Verified Traveler")} ✓
                </Badge>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="space-y-4 py-6">
        {/* Menu */}
        <Card variant="elevated" padding="sm" className="overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3.5 text-start transition-colors hover:bg-surface-muted dark:hover:bg-surface-dark-card"
            >
              <item.icon className="h-5 w-5 text-navy-500 shrink-0" />
              <span className="flex-1 text-body-md text-navy-700 dark:text-navy-200">
                {t(item.labelAr, item.labelEn)}
              </span>
              <ChevronLeft className="h-4 w-4 text-gold-500/85 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
          ))}
        </Card>

        {showAdminShortcut && (
          <Card variant="outlined" padding="md" className="border-gold-300/65 shadow-[0_0_0_1px_rgba(249,158,56,0.12)] dark:border-gold-800/45 dark:shadow-[0_0_0_1px_rgba(249,158,56,0.08)]">
            <button
              onClick={() => router.push(hasAdminRole ? "/admin/dashboard" : "/admin-login")}
              className="flex w-full items-center gap-3 rounded-[var(--radius-md)] text-start"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300 shadow-md">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-body-md font-semibold text-navy-900 dark:text-white">
                  {t("وضع الإدارة", "Admin Mode")}
                </span>
                <span className="block text-body-sm text-navy-500 dark:text-navy-300">
                  {t("إدارة الحملات والمستخدمين", "Manage campaigns and platform users")}
                </span>
              </span>
              <ChevronLeft className="h-4 w-4 text-navy-400 rtl:rotate-180" />
            </button>
          </Card>
        )}

        {/* Language */}
        <Card variant="outlined" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-navy-500" />
              <span className="text-body-md text-navy-700 dark:text-navy-200">
                {t("اللغة", "Language")}
              </span>
            </div>
            <LanguageToggle />
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="ghost"
          fullWidth
          className="border border-error/25 bg-[linear-gradient(110deg,rgba(255,255,255,0.5),rgba(251,225,225,0.66),rgba(255,255,255,0.5))] text-error hover:bg-error-light dark:border-error/35 dark:bg-[linear-gradient(110deg,rgba(213,83,83,0.12),rgba(213,83,83,0.22),rgba(213,83,83,0.12))]"
          leftIcon={<LogOut className="h-5 w-5" />}
          onClick={handleLogout}
        >
          {t("تسجيل الخروج", "Sign Out")}
        </Button>
      </Container>
    </div>
  );
}
