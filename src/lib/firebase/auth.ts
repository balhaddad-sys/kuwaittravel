import {
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  type ConfirmationResult,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./config";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(containerId: string = "recaptcha-container"): RecaptchaVerifier {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  return recaptchaVerifier;
}

export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const verifier = getRecaptchaVerifier();
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  // Clear session cookie
  await fetch("/api/auth/session", { method: "DELETE" });
}

export async function createSessionCookie(idToken: string): Promise<void> {
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}
