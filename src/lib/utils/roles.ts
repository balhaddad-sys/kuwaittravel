import type { UserRole } from "@/types";

export const ROLE_LABELS: Record<UserRole, { ar: string; en: string }> = {
  traveler: { ar: "مسافر", en: "Traveler" },
  campaign_owner: { ar: "مدير حملة", en: "Campaign Owner" },
  campaign_staff: { ar: "موظف حملة", en: "Campaign Staff" },
  admin: { ar: "مشرف", en: "Admin" },
  super_admin: { ar: "مشرف عام", en: "Super Admin" },
};

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  traveler: "/app/discover",
  campaign_owner: "/portal/dashboard",
  campaign_staff: "/portal/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
};

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/portal": ["campaign_owner", "campaign_staff"],
  "/app": ["traveler", "campaign_owner", "campaign_staff", "admin", "super_admin"],
  "/admin": ["admin", "super_admin"],
};

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  for (const [prefix, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      return roles.includes(role);
    }
  }
  return true;
}
