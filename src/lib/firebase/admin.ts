import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function cleanPrivateKey(raw: string): string {
  // Strip surrounding quotes if the env loader left them
  let key = raw.replace(/^["']|["']$/g, "");
  // Convert literal \n to actual newlines
  key = key.replace(/\\n/g, "\n");
  return key;
}

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Support both current and legacy env naming for deployment compatibility.
  const projectId =
    process.env.FB_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail =
    process.env.FB_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey =
    process.env.FB_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: cleanPrivateKey(privateKey),
        }),
      });
    } catch (e) {
      console.error("Firebase Admin explicit creds failed, falling back to default:", e);
    }
  }

  // Fallback: default credentials (Cloud Run service account)
  return initializeApp();
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
