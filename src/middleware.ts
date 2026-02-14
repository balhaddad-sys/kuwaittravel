import { NextRequest, NextResponse } from "next/server";

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/portal": ["campaign_owner", "campaign_staff"],
  "/app": [
    "traveler",
    "campaign_owner",
    "campaign_staff",
    "admin",
    "super_admin",
  ],
  "/admin": ["admin", "super_admin"],
};

const ROLE_HOME: Record<string, string> = {
  traveler: "/app/discover",
  campaign_owner: "/portal/dashboard",
  campaign_staff: "/portal/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get("session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Read role from cookie (set by POST /api/auth/session)
  const role = request.cookies.get("session_role")?.value || "traveler";

  // Enforce route permissions
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      const home = ROLE_HOME[role] || "/login";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/app/:path*", "/admin/:path*"],
};
