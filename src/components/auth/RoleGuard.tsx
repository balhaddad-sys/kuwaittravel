"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME_ROUTES, isPrivilegedAdminEmail } from "@/lib/utils/roles";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  unauthenticatedRedirect?: string;
  allowPrivilegedAdminEmail?: boolean;
}

export function RoleGuard({
  allowedRoles,
  children,
  unauthenticatedRedirect = "/login",
  allowPrivilegedAdminEmail = false,
}: RoleGuardProps) {
  const { userData, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const allowedRolesKey = allowedRoles.join("|");
  const allowedRoleSet = useMemo(
    () => new Set(allowedRolesKey.split("|").filter(Boolean) as UserRole[]),
    [allowedRolesKey]
  );
  const hasPrivilegedAdminEmail =
    allowPrivilegedAdminEmail &&
    (allowedRoleSet.has("admin") || allowedRoleSet.has("super_admin")) &&
    isPrivilegedAdminEmail(firebaseUser?.email);
  const hasAccess = hasPrivilegedAdminEmail || Boolean(userData && allowedRoleSet.has(userData.role));

  useEffect(() => {
    if (loading) return;

    if (!userData && !hasPrivilegedAdminEmail) {
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (userData && !allowedRoleSet.has(userData.role) && !hasPrivilegedAdminEmail) {
      router.replace(ROLE_HOME_ROUTES[userData.role]);
    }
  }, [userData, loading, allowedRoleSet, router, unauthenticatedRedirect, hasPrivilegedAdminEmail]);

  if (loading) {
    return (
      <div className="travel-shell-bg flex min-h-screen items-center justify-center">
        <div className="travel-panel rounded-2xl p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-700 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
