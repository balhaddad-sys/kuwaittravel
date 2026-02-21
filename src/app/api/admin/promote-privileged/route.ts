import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { createRateLimiter } from "@/lib/utils/rate-limit";

const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });

function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

function getAllowedAdminEmails(): string[] {
  const source =
    process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return source
    .split(",")
    .map((value) => normalize(value))
    .filter(Boolean);
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

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return NextResponse.json({ error: "Admin email allowlist is empty" }, { status: 403 });
  }

  try {
    const adminAuth = getAdminAuth();
    const db = getAdminDb();
    const decoded = await adminAuth.verifyIdToken(tokenMatch[1]);
    const callerEmail = normalize(decoded.email);

    if (!callerEmail || !allowedEmails.includes(callerEmail)) {
      return NextResponse.json({ error: "Email is not allowed for admin bootstrap" }, { status: 403 });
    }

    const userRecord = await adminAuth.getUser(decoded.uid);
    const userRef = db.collection(COLLECTIONS.USERS).doc(decoded.uid);
    const userSnap = await userRef.get();
    const existing = userSnap.exists ? userSnap.data() || {} : {};
    const role = existing.role === "super_admin" ? "super_admin" : "admin";

    const profile = {
      uid: decoded.uid,
      email: userRecord.email || existing.email || "",
      phone: userRecord.phoneNumber || existing.phone || "",
      displayName:
        existing.displayName ||
        userRecord.displayName ||
        existing.displayNameAr ||
        "Admin User",
      displayNameAr:
        existing.displayNameAr ||
        userRecord.displayName ||
        existing.displayName ||
        "مشرف",
      role,
      preferredLanguage: existing.preferredLanguage || "ar",
      notificationTokens: Array.isArray(existing.notificationTokens)
        ? existing.notificationTokens
        : [],
      isVerified: typeof existing.isVerified === "boolean" ? existing.isVerified : true,
      isActive: typeof existing.isActive === "boolean" ? existing.isActive : true,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!userSnap.exists) {
      await userRef.set(
        {
          ...profile,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await userRef.set(profile, { merge: true });
    }

    const existingClaims = userRecord.customClaims || {};
    await adminAuth.setCustomUserClaims(decoded.uid, {
      ...existingClaims,
      admin: true,
      platformRole: role,
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Privileged admin promotion failed:", error);
    return NextResponse.json(
      { error: "Failed to promote privileged admin" },
      { status: 500 }
    );
  }
}

