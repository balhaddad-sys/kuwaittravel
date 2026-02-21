"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { SectionBottomNav, type SectionBottomNavItem } from "@/components/layout/SectionBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useDirection } from "@/providers/DirectionProvider";
import Link from "next/link";
import {
  LayoutDashboard, Building2, Users, Wallet, AlertOctagon,
  ScrollText, Settings, Shield, Compass, PlaneTakeoff,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  const sidebarItems: SidebarItem[] = [
    { label: t("لوحة التحكم", "Dashboard"), href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: t("الحملات", "Campaigns"), href: "/admin/campaigns", icon: <Building2 className="h-5 w-5" /> },
    { label: t("المستخدمون", "Users"), href: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { label: t("المالية", "Financials"), href: "/admin/financials", icon: <Wallet className="h-5 w-5" /> },
    { label: t("النزاعات", "Disputes"), href: "/admin/disputes", icon: <AlertOctagon className="h-5 w-5" /> },
    { label: t("سجل العمليات", "Audit Logs"), href: "/admin/audit-logs", icon: <ScrollText className="h-5 w-5" /> },
    { label: t("الإعدادات", "Settings"), href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  /* ── Bottom nav items (mobile) ── */
  const bottomPrimary: SectionBottomNavItem[] = [
    { label: t("الرئيسية", "Home"), href: "/admin/dashboard", icon: <LayoutDashboard className="h-6 w-6" /> },
    { label: t("الحملات", "Campaigns"), href: "/admin/campaigns", icon: <Building2 className="h-6 w-6" /> },
    { label: t("المستخدمون", "Users"), href: "/admin/users", icon: <Users className="h-6 w-6" /> },
    { label: t("المالية", "Finance"), href: "/admin/financials", icon: <Wallet className="h-6 w-6" /> },
  ];

  const bottomOverflow: SectionBottomNavItem[] = [
    { label: t("النزاعات", "Disputes"), href: "/admin/disputes", icon: <AlertOctagon className="h-5 w-5" /> },
    { label: t("سجل العمليات", "Audit Logs"), href: "/admin/audit-logs", icon: <ScrollText className="h-5 w-5" /> },
    { label: t("الإعدادات", "Settings"), href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const bottomSwitch: SectionBottomNavItem[] = [
    { label: t("المسافرون", "Travelers"), href: "/app/discover", icon: <Compass className="h-5 w-5" /> },
    { label: t("بوابة الحملات", "Portal"), href: "/portal/dashboard", icon: <PlaneTakeoff className="h-5 w-5" /> },
  ];

  return (
    <RoleGuard
      allowedRoles={["admin", "super_admin"]}
      unauthenticatedRedirect="/admin-login"
      allowPrivilegedAdminEmail
    >
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 text-sm font-bold text-white shadow-sm">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-slate-900 dark:text-white">
              {t("المشرف العام", "Admin Console")}
            </span>
          </div>
        }
        footer={
          <div className="space-y-1.5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400/60">
              {t("التبديل إلى", "Switch to")}
            </p>
            <Link href="/app/discover" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400/70 dark:hover:bg-[#1E293B] dark:hover:text-slate-200">
              <Compass className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t("المسافرون", "Travelers")}
            </Link>
            <Link href="/portal/dashboard" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400/70 dark:hover:bg-[#1E293B] dark:hover:text-slate-200">
              <PlaneTakeoff className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t("بوابة الحملات", "Campaign Portal")}
            </Link>
          </div>
        }
      />
      <main className="eo-shell-bg flex flex-1 flex-col ms-0 lg:ms-[286px] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 transition-all duration-300">
        <PageTransition className="flex-1" variant="admin">{children}</PageTransition>
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
