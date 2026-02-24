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
  const [isRefreshingClaims, setIsRefreshingClaims] = useState(false);
  const [claimsRefreshAttempted, setClaimsRefreshAttempted] = useState(false);
  const allowedRolesKey = allowedRoles.join("|");
  const allowedRoleSet = useMemo(
    () => new Set(allowedRolesKey.split("|").filter(Boolean) as UserRole[]),
    [allowedRolesKey]
  );
  const requiresAdminRole =
    allowedRoleSet.has("admin") || allowedRoleSet.has("super_admin");
  const hasAdminRole =
    userData?.role === "admin" || userData?.role === "super_admin";
  const hasRoleAccess = Boolean(userData && allowedRoleSet.has(userData.role));
  const hasPrivilegedAdminEmail =
    allowPrivilegedAdminEmail &&
    requiresAdminRole &&
    isPrivilegedAdminEmail(firebaseUser?.email);
  const needsPrivilegedBootstrap =
    hasPrivilegedAdminEmail && !!firebaseUser && !hasRoleAccess;
  const pendingPrivilegedBootstrap = needsPrivilegedBootstrap && !bootstrapAttempted;
  const shouldRefreshAdminClaims =
    requiresAdminRole &&
    hasAdminRole &&
    !!firebaseUser &&
    !claimsRefreshAttempted;
  const hasAccess = hasRoleAccess;

  useEffect(() => {
    setBootstrapAttempted(false);
    setIsBootstrappingAdmin(false);
    setClaimsRefreshAttempted(false);
    setIsRefreshingClaims(false);
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
    if (
      loading ||
      isBootstrappingAdmin ||
      pendingPrivilegedBootstrap ||
      !shouldRefreshAdminClaims ||
      !firebaseUser
    ) {
      return;
    }

    let cancelled = false;
    setIsRefreshingClaims(true);

    (async () => {
      try {
        const idToken = await firebaseUser.getIdToken();
        await fetch("/api/admin/sync-claims", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      } catch {
        // Best effort only.
      } finally {
        try {
          await firebaseUser.getIdToken(true);
        } catch {
          // Keep moving even if token refresh fails.
        }

        if (!cancelled) {
          setClaimsRefreshAttempted(true);
          setIsRefreshingClaims(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    firebaseUser,
    isBootstrappingAdmin,
    loading,
    pendingPrivilegedBootstrap,
    shouldRefreshAdminClaims,
  ]);

  useEffect(() => {
    if (loading || isBootstrappingAdmin || pendingPrivilegedBootstrap || isRefreshingClaims) return;

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
    isRefreshingClaims,
  ]);

  if (loading || isBootstrappingAdmin || pendingPrivilegedBootstrap || isRefreshingClaims) {
    // Render empty dark shell to avoid visible spinner/flash — feels like native splash
    return <div className="eo-shell-bg min-h-screen" />;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
