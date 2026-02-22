import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const hasExplicitCreds =
    process.env.FB_ADMIN_PROJECT_ID &&
    process.env.FB_ADMIN_CLIENT_EMAIL &&
    process.env.FB_ADMIN_PRIVATE_KEY;

  // Local dev: use explicit service account credentials
  if (hasExplicitCreds) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FB_ADMIN_PROJECT_ID,
        clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FB_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }

  // Production (Cloud Functions / Cloud Run): use default credentials
  return initializeApp();
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
