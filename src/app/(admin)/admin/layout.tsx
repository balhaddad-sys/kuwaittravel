"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  LayoutDashboard, Building2, Users, Wallet, AlertOctagon,
  ScrollText, Settings, Shield,
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { label: "لوحة التحكم", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "الحملات", href: "/admin/campaigns", icon: <Building2 className="h-5 w-5" />, badge: 3 },
  { label: "المستخدمون", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
  { label: "المالية", href: "/admin/financials", icon: <Wallet className="h-5 w-5" /> },
  { label: "النزاعات", href: "/admin/disputes", icon: <AlertOctagon className="h-5 w-5" />, badge: 2 },
  { label: "سجل العمليات", href: "/admin/audit-logs", icon: <ScrollText className="h-5 w-5" /> },
  { label: "الإعدادات", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-navy-900 text-sm font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              المشرف العام
            </span>
          </div>
        }
      />
      <main className="flex-1 ms-[260px] transition-all duration-300">
        {children}
      </main>
    </div>
    </RoleGuard>
  );
}
