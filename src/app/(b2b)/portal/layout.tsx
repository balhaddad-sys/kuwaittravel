"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { MobileTopNav } from "@/components/layout/MobileTopNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useDirection } from "@/providers/DirectionProvider";
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
} from "lucide-react";

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

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

  return (
    <RoleGuard allowedRoles={["campaign_owner", "campaign_staff"]}>
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 text-white text-sm font-bold shadow-md">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              {t("بوابة الحملة", "Campaign Portal")}
            </span>
          </div>
        }
      />
      <main className="flex-1 ms-0 lg:ms-[260px] transition-all duration-300">
        <MobileTopNav items={sidebarItems} />
        <PageTransition variant="portal">{children}</PageTransition>
      </main>
    </div>
    </RoleGuard>
  );
}
