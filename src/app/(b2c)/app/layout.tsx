"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Compass, Map, Bell, User } from "lucide-react";

const navItems = [
  { label: "اكتشف", href: "/app/discover", icon: <Compass className="h-6 w-6" /> },
  { label: "رحلاتي", href: "/app/my-trips", icon: <Map className="h-6 w-6" /> },
  { label: "الإشعارات", href: "/app/notifications", icon: <Bell className="h-6 w-6" /> },
  { label: "حسابي", href: "/app/profile", icon: <User className="h-6 w-6" /> },
];

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["traveler", "campaign_owner", "campaign_staff", "admin", "super_admin"]}>
      <div className="min-h-screen pb-20">
        <PageTransition>{children}</PageTransition>
        <BottomNav items={navItems} />
      </div>
    </RoleGuard>
  );
}
