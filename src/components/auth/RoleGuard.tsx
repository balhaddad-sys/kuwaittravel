"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME_ROUTES } from "@/lib/utils/roles";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  unauthenticatedRedirect?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  unauthenticatedRedirect = "/login",
}: RoleGuardProps) {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const allowedRolesKey = allowedRoles.join("|");
  const allowedRoleSet = useMemo(
    () => new Set(allowedRolesKey.split("|").filter(Boolean) as UserRole[]),
    [allowedRolesKey]
  );
  const hasAccess = Boolean(userData && allowedRoleSet.has(userData.role));

  useEffect(() => {
    if (loading) return;

    if (!userData) {
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (!allowedRoleSet.has(userData.role)) {
      router.replace(ROLE_HOME_ROUTES[userData.role]);
    }
  }, [userData, loading, allowedRoleSet, router, unauthenticatedRedirect]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
