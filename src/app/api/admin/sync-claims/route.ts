import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { createRateLimiter } from "@/lib/utils/rate-limit";

const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });

function normalizeRole(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isAdminRole(role: string): role is "admin" | "super_admin" {
  return role === "admin" || role === "super_admin";
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limiter.isLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
  }

  try {
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const decoded = await adminAuth.verifyIdToken(tokenMatch[1]);
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(decoded.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User profile not found" }, { status: 403 });
    }

    const userRole = normalizeRole(userSnap.data()?.role);
    if (!isAdminRole(userRole)) {
      return NextResponse.json({ error: "User is not admin" }, { status: 403 });
    }

    const userRecord = await adminAuth.getUser(decoded.uid);
    const existingClaims = userRecord.customClaims || {};

    await adminAuth.setCustomUserClaims(decoded.uid, {
      ...existingClaims,
      admin: true,
      platformRole: userRole,
    });

    return NextResponse.json({ success: true, role: userRole });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Admin claim sync failed:", error);
    return NextResponse.json({ error: "Failed to sync admin claims" }, { status: 500 });
  }
}
