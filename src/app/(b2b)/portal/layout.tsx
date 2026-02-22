"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { SectionBottomNav, type SectionBottomNavItem } from "@/components/layout/SectionBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/hooks/useAuth";
import { useRoutePrefetch } from "@/hooks/useRoutePrefetch";
import { useDirection } from "@/providers/DirectionProvider";
import Link from "next/link";
import { useMemo } from "react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  FileText,
  Bell,
  Wallet,
  Users,
  Settings,
  Building2,
  PlaneTakeoff,
  Compass,
  Shield,
} from "lucide-react";

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();
  const { userData } = useAuth();
  const isAdmin = userData?.role === "admin" || userData?.role === "super_admin";
  const prefetchedRoutes = useMemo(
    () => [
      "/portal/dashboard",
      "/portal/trips",
      "/portal/bookings",
      "/portal/documents",
      "/portal/notifications",
      "/portal/wallet",
      "/portal/staff",
      "/portal/profile",
      "/portal/settings",
      "/app/discover",
      ...(isAdmin ? ["/admin/dashboard"] : []),
    ],
    [isAdmin]
  );
  useRoutePrefetch(prefetchedRoutes);

  const sidebarItems: SidebarItem[] = [
    { label: t("لوحة التحكم", "Dashboard"), href: "/portal/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: t("الرحلات", "Trips"), href: "/portal/trips", icon: <Map className="h-5 w-5" /> },
    { label: t("الحجوزات", "Bookings"), href: "/portal/bookings", icon: <BookOpen className="h-5 w-5" /> },
    { label: t("المستندات", "Documents"), href: "/portal/documents", icon: <FileText className="h-5 w-5" /> },
    { label: t("الإشعارات", "Alerts"), href: "/portal/notifications", icon: <Bell className="h-5 w-5" /> },
    { label: t("المحفظة", "Wallet"), href: "/portal/wallet", icon: <Wallet className="h-5 w-5" /> },
    { label: t("فريق العمل", "Team"), href: "/portal/staff", icon: <Users className="h-5 w-5" /> },
    { label: t("الملف التعريفي", "Profile"), href: "/portal/profile", icon: <Building2 className="h-5 w-5" /> },
    { label: t("الإعدادات", "Settings"), href: "/portal/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  /* ── Bottom nav items (mobile) ── */
  const bottomPrimary: SectionBottomNavItem[] = [
    { label: t("الرئيسية", "Home"), href: "/portal/dashboard", icon: <LayoutDashboard className="h-6 w-6" /> },
    { label: t("الرحلات", "Trips"), href: "/portal/trips", icon: <Map className="h-6 w-6" /> },
    { label: t("الحجوزات", "Bookings"), href: "/portal/bookings", icon: <BookOpen className="h-6 w-6" /> },
    { label: t("المحفظة", "Wallet"), href: "/portal/wallet", icon: <Wallet className="h-6 w-6" /> },
  ];

  const bottomOverflow: SectionBottomNavItem[] = [
    { label: t("المستندات", "Documents"), href: "/portal/documents", icon: <FileText className="h-5 w-5" /> },
    { label: t("الإشعارات", "Alerts"), href: "/portal/notifications", icon: <Bell className="h-5 w-5" /> },
    { label: t("فريق العمل", "Team"), href: "/portal/staff", icon: <Users className="h-5 w-5" /> },
    { label: t("الملف التعريفي", "Profile"), href: "/portal/profile", icon: <Building2 className="h-5 w-5" /> },
    { label: t("الإعدادات", "Settings"), href: "/portal/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const bottomSwitch: SectionBottomNavItem[] = [
    { label: t("المسافرون", "Travelers"), href: "/app/discover", icon: <Compass className="h-5 w-5" /> },
    ...(isAdmin
      ? [{ label: t("الإدارة", "Admin"), href: "/admin/dashboard", icon: <Shield className="h-5 w-5" /> }]
      : []),
  ];

  return (
    <RoleGuard allowedRoles={["campaign_owner", "campaign_staff", "admin", "super_admin"]}>
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/30 bg-gradient-to-br from-sky-500 to-violet-500 text-sm font-bold text-white shadow-sm">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-slate-900 dark:text-white">
              {t("بوابة الحملة", "Campaign Portal")}
            </span>
          </div>
        }
        footer={
          <div className="space-y-1.5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400/45">
              {t("التبديل إلى", "Switch to")}
            </p>
            <Link href="/app/discover" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300/60 dark:hover:bg-[#1E293B]/60 dark:hover:text-slate-200">
              <Compass className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t("المسافرون", "Travelers")}
            </Link>
            {isAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300/60 dark:hover:bg-[#1E293B]/60 dark:hover:text-slate-200">
                <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                {t("إدارة المشرفين", "Admin Console")}
              </Link>
            )}
          </div>
        }
      />
      <main className="eo-shell-bg flex flex-1 flex-col ms-0 lg:ms-[286px] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 transition-all duration-300">
        <PageTransition className="flex-1" variant="portal">{children}</PageTransition>
      </main>
      <SectionBottomNav
        primaryItems={bottomPrimary}
        overflowItems={bottomOverflow}
        switchItems={bottomSwitch}
        moreLabel={t("المزيد", "More")}
        switchLabel={t("التبديل إلى", "Switch to")}
      />
    </div>
    </RoleGuard>
  );
}
