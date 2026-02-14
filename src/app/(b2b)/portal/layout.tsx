"use client";

import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
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
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { label: "لوحة التحكم", href: "/portal/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "الرحلات", href: "/portal/trips", icon: <Map className="h-5 w-5" /> },
  { label: "الحجوزات", href: "/portal/bookings", icon: <BookOpen className="h-5 w-5" /> },
  { label: "المستندات", href: "/portal/documents", icon: <FileText className="h-5 w-5" /> },
  { label: "الإشعارات", href: "/portal/notifications", icon: <Bell className="h-5 w-5" /> },
  { label: "المحفظة", href: "/portal/wallet", icon: <Wallet className="h-5 w-5" /> },
  { label: "فريق العمل", href: "/portal/staff", icon: <Users className="h-5 w-5" /> },
  { label: "الملف التعريفي", href: "/portal/profile", icon: <Building2 className="h-5 w-5" /> },
  { label: "الإعدادات", href: "/portal/settings", icon: <Settings className="h-5 w-5" /> },
];

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-white text-sm font-bold">
              KT
            </div>
            <span className="text-heading-sm font-bold text-navy-900 dark:text-white">
              بوابة الحملة
            </span>
          </div>
        }
      />
      <main className="flex-1 ms-[260px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
