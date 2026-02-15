"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (loading) return;

    if (!userData) {
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (!allowedRoles.includes(userData.role)) {
      router.replace(ROLE_HOME_ROUTES[userData.role]);
    }
  }, [userData, loading, allowedRoles, router, unauthenticatedRedirect]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!userData || !allowedRoles.includes(userData.role)) {
    return null;
  }

  return <>{children}</>;
}
