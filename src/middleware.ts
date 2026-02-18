import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight session gate.
 *
 * The AuthProvider sets `__rahal_session=1` when Firebase confirms a logged-in
 * user and removes it on logout.  This cookie is NOT cryptographically signed —
 * the real authorization barrier is Firebase Security Rules.  The middleware
 * exists to:
 *   1. Prevent a blank-page flash on protected routes for logged-out users.
 *   2. Return a proper redirect (not a client-side replace) so search engines
 *      and crawlers never index protected pages.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("__rahal_session")?.value;

  // /app/* and /portal/* — require any authenticated user
  if (pathname.startsWith("/app/") || pathname.startsWith("/portal/")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // /admin/* — require any authenticated user (RoleGuard enforces admin role client-side)
  if (pathname.startsWith("/admin/")) {
    if (!session) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all app/portal/admin routes; skip static files and API routes
  matcher: ["/app/:path*", "/portal/:path*", "/admin/:path*"],
};
