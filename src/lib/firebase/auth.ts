import {
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  type ConfirmationResult,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(containerId: string = "recaptcha-container"): RecaptchaVerifier {
  const auth = getFirebaseAuth();
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  return recaptchaVerifier;
}

export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  const verifier = getRecaptchaVerifier();
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
  document.cookie = "session=; path=/; max-age=0";
  document.cookie = "session_role=; path=/; max-age=0";
}

export function createSessionCookie(idToken: string, role?: string): void {
  const maxAge = 60 * 60 * 24 * 5; // 5 days
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `session=${encodeURIComponent(idToken)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  if (role) {
    document.cookie = `session_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  }
}
