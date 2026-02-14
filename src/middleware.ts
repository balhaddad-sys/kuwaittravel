import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const PUBLIC_ROUTES = [
  "/login",
  "/verify",
  "/onboarding",
  "/register-campaign",
  "/",
];

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

// Firebase session cookies are signed with Google's service account keys
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys"
  )
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes and static assets
  if (
    PUBLIC_ROUTES.some((route) => pathname === route) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check session cookie
  const session = request.cookies.get("session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the session cookie JWT
  try {
    await jwtVerify(session, JWKS, {
      issuer: `https://session.firebase.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    // Read role from the session_role cookie (set by POST /api/auth/session)
    const role = request.cookies.get("session_role")?.value || "traveler";

    // Enforce route permissions
    for (const [prefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
        const home = ROLE_HOME[role] || "/login";
        return NextResponse.redirect(new URL(home, request.url));
      }
    }

    return NextResponse.next();
  } catch {
    // Invalid or expired session — clear cookies and redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("session");
    response.cookies.delete("session_role");
    return response;
  }
}

export const config = {
  matcher: ["/portal/:path*", "/app/:path*", "/admin/:path*"],
};
