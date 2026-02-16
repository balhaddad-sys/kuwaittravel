"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/hooks/useAuth";
import { isPrivilegedAdminEmail } from "@/lib/utils/roles";
import { useDirection } from "@/providers/DirectionProvider";
import { Compass, Map, Bell, User, Shield } from "lucide-react";

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  const { t } = useDirection();
  const { userData, firebaseUser } = useAuth();
  const hasAdminRole = userData?.role === "admin" || userData?.role === "super_admin";
  const showAdminShortcut = hasAdminRole || isPrivilegedAdminEmail(firebaseUser?.email);

  const navItems = [
    { label: t("اكتشف", "Discover"), href: "/app/discover", icon: <Compass className="h-6 w-6" /> },
    { label: t("رحلاتي", "My Trips"), href: "/app/my-trips", icon: <Map className="h-6 w-6" /> },
    { label: t("الإشعارات", "Alerts"), href: "/app/notifications", icon: <Bell className="h-6 w-6" />, notification: true },
    { label: t("حسابي", "Profile"), href: "/app/profile", icon: <User className="h-6 w-6" /> },
    ...(showAdminShortcut
      ? [{ label: t("الإدارة", "Admin"), href: hasAdminRole ? "/admin/dashboard" : "/admin-login", icon: <Shield className="h-6 w-6" /> }]
      : []),
  ];

  return (
    <RoleGuard allowedRoles={["traveler", "campaign_owner", "campaign_staff", "admin", "super_admin"]}>
      <div className="travel-shell-bg min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        <PageTransition variant="app">{children}</PageTransition>
        <BottomNav items={navItems} />
      </div>
    </RoleGuard>
  );
}
