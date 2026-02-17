"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { MobileTopNav } from "@/components/layout/MobileTopNav";
import { OwnerQuickActions } from "@/components/layout/OwnerQuickActions";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import Link from "next/link";
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
  const showOwnerQuickActions = userData?.role === "campaign_owner";
  const isAdmin = userData?.role === "admin" || userData?.role === "super_admin";

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

  const switchItems: SidebarItem[] = [
    { label: t("المسافرون", "Travelers"), href: "/app/discover", icon: <Compass className="h-5 w-5" /> },
    ...(isAdmin
      ? [{ label: t("الإدارة", "Admin"), href: "/admin/dashboard", icon: <Shield className="h-5 w-5" /> }]
      : []),
  ];

  const mobileNavItems: SidebarItem[] = [
    sidebarItems[0], // dashboard
    sidebarItems[1], // trips
    sidebarItems[2], // bookings
    sidebarItems[5], // wallet
    sidebarItems[8], // settings
    ...switchItems,
  ];

  return (
    <RoleGuard allowedRoles={["campaign_owner", "campaign_staff", "admin", "super_admin"]}>
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-300 bg-gold-500 text-sm font-bold text-white shadow-sm">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("بوابة الحملة", "Campaign Portal")}
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
            {isAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 py-2 text-body-sm text-navy-600 transition-colors hover:bg-surface-light dark:text-navy-300 dark:hover:bg-surface-dark">
                <Shield className="h-4 w-4 text-gold-500" />
                {t("إدارة المشرفين", "Admin Console")}
              </Link>
            )}
          </div>
        }
      />
      <main className="travel-shell-bg flex flex-1 flex-col ms-0 lg:ms-[286px] transition-all duration-300">
        <MobileTopNav items={mobileNavItems} />
        {showOwnerQuickActions && <OwnerQuickActions />}
        <PageTransition className="flex-1" variant="portal">{children}</PageTransition>
      </main>
    </div>
    </RoleGuard>
  );
}
