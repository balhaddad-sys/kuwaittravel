"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, Map, Bell, User } from "lucide-react";

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();

  const navItems = [
    { label: t("اكتشف", "Discover"), href: "/app/discover", icon: <Compass className="h-6 w-6" /> },
    { label: t("رحلاتي", "My Trips"), href: "/app/my-trips", icon: <Map className="h-6 w-6" /> },
    { label: t("الإشعارات", "Alerts"), href: "/app/notifications", icon: <Bell className="h-6 w-6" /> },
    { label: t("حسابي", "Profile"), href: "/app/profile", icon: <User className="h-6 w-6" /> },
  ];

  return (
    <RoleGuard allowedRoles={["traveler", "campaign_owner", "campaign_staff", "admin", "super_admin"]}>
      <div className="min-h-screen pb-20">
        <PageTransition>{children}</PageTransition>
        <BottomNav items={navItems} />
      </div>
    </RoleGuard>
  );
}
