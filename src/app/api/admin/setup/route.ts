import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const setupEnabled = process.env.ADMIN_SETUP_ENABLED === "true";
  const setupKey = process.env.ADMIN_SETUP_KEY;

  // This endpoint should never be available in production consumer deployments.
  if (!setupEnabled || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!setupKey) {
    return NextResponse.json(
      { error: "ADMIN_SETUP_KEY is not configured" },
      { status: 500 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  let body: { key?: string; uid?: string };
  try {
    body = (await request.json()) as { key?: string; uid?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
  const { key, uid } = body;

  if (!key || key !== setupKey) {
    return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
  }

  if (!uid) {
    return NextResponse.json(
      { error: "uid is required" },
      { status: 400 }
    );
  }

  const db = getAdminDb();
  const userRef = db.collection(COLLECTIONS.USERS).doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  await userRef.update({
    role: "admin",
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({
    success: true,
    message: `User ${uid} has been promoted to admin`,
  });
}
