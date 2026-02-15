"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { MobileTopNav } from "@/components/layout/MobileTopNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useDirection } from "@/providers/DirectionProvider";
import {
  LayoutDashboard, Building2, Users, Wallet, AlertOctagon,
  ScrollText, Settings, Shield,
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

  return (
    <RoleGuard
      allowedRoles={["admin", "super_admin"]}
      unauthenticatedRedirect="/admin-login"
    >
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-navy-900 text-sm font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("المشرف العام", "Admin Console")}
            </span>
          </div>
        }
      />
      <main className="travel-shell-bg flex-1 ms-0 lg:ms-[260px] transition-all duration-300">
        <MobileTopNav items={sidebarItems} />
        <PageTransition variant="admin">{children}</PageTransition>
      </main>
    </div>
    </RoleGuard>
  );
}
