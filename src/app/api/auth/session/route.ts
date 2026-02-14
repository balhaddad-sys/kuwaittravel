import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_ROLE_COOKIE = "session_role";
const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await getAdminAuth().verifyIdToken(idToken);

    // Create a proper Firebase session cookie
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });

    const cookieStore = await cookies();

    // Set the verified session cookie (httpOnly — not readable by JS)
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    // Fetch user role from Firestore and set a readable role cookie for middleware
    const userDoc = await getAdminDb()
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    const role = userDoc.exists ? userDoc.data()?.role : null;

    if (role) {
      cookieStore.set(SESSION_ROLE_COOKIE, role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
      });
    }

    return NextResponse.json({ success: true, uid: decodedToken.uid });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(SESSION_ROLE_COOKIE);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
