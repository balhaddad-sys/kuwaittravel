"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { MobileTopNav } from "@/components/layout/MobileTopNav";
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

  const switchItems: SidebarItem[] = [
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-300 bg-gold-500 text-sm font-bold text-white shadow-sm">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("المشرف العام", "Admin Console")}
            </span>
          </div>
        }
        footer={
          <div className="space-y-1.5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-navy-400 dark:text-navy-500">
              {t("التبديل إلى", "Switch to")}
            </p>
            <Link href="/app/discover" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-navy-600 transition-colors hover:bg-surface-light dark:text-navy-300 dark:hover:bg-surface-dark">
              <Compass className="h-4 w-4 text-gold-500" />
              {t("المسافرون", "Travelers")}
            </Link>
            <Link href="/portal/dashboard" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-navy-600 transition-colors hover:bg-surface-light dark:text-navy-300 dark:hover:bg-surface-dark">
              <PlaneTakeoff className="h-4 w-4 text-gold-500" />
              {t("بوابة الحملات", "Campaign Portal")}
            </Link>
          </div>
        }
      />
      <main className="travel-shell-bg flex-1 ms-0 lg:ms-[286px] transition-all duration-300">
        <MobileTopNav items={[...sidebarItems, ...switchItems]} />
        <PageTransition variant="admin">{children}</PageTransition>
      </main>
    </div>
    </RoleGuard>
  );
}
