import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/verify", "/onboarding", "/register-campaign", "/"];

export function middleware(request: NextRequest) {
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

  // Session exists — allow through (full role verification happens in layouts)
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/app/:path*", "/admin/:path*"],
};
