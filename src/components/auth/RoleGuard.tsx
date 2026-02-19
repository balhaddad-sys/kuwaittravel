"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
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
  const { userData, firebaseUser, loading, refreshUserData } = useAuth();
  const router = useRouter();
  const [isBootstrappingAdmin, setIsBootstrappingAdmin] = useState(false);
  const [bootstrapAttempted, setBootstrapAttempted] = useState(false);
  const allowedRolesKey = allowedRoles.join("|");
  const allowedRoleSet = useMemo(
    () => new Set(allowedRolesKey.split("|").filter(Boolean) as UserRole[]),
    [allowedRolesKey]
  );
  const hasRoleAccess = Boolean(userData && allowedRoleSet.has(userData.role));
  const hasPrivilegedAdminEmail =
    allowPrivilegedAdminEmail &&
    (allowedRoleSet.has("admin") || allowedRoleSet.has("super_admin")) &&
    isPrivilegedAdminEmail(firebaseUser?.email);
  const needsPrivilegedBootstrap =
    hasPrivilegedAdminEmail && !!firebaseUser && !hasRoleAccess;
  const pendingPrivilegedBootstrap = needsPrivilegedBootstrap && !bootstrapAttempted;
  const hasAccess = hasRoleAccess;

  useEffect(() => {
    setBootstrapAttempted(false);
    setIsBootstrappingAdmin(false);
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (loading || !pendingPrivilegedBootstrap || !firebaseUser) return;

    let cancelled = false;
    setIsBootstrappingAdmin(true);

    (async () => {
      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await fetch("/api/admin/promote-privileged", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          await firebaseUser.getIdToken(true);
          await refreshUserData();
        }
      } catch {
        // Swallow and continue to regular role redirect flow.
      } finally {
        if (!cancelled) {
          setBootstrapAttempted(true);
          setIsBootstrappingAdmin(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, loading, pendingPrivilegedBootstrap, refreshUserData]);

  useEffect(() => {
    if (loading || isBootstrappingAdmin || pendingPrivilegedBootstrap) return;

    if (!userData) {
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (!allowedRoleSet.has(userData.role)) {
      router.replace(ROLE_HOME_ROUTES[userData.role]);
    }
  }, [
    userData,
    loading,
    allowedRoleSet,
    router,
    unauthenticatedRedirect,
    isBootstrappingAdmin,
    pendingPrivilegedBootstrap,
  ]);

  if (loading || isBootstrappingAdmin || pendingPrivilegedBootstrap) {
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
