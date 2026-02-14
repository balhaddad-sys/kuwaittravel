"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import type { User as FirebaseUser, ConfirmationResult } from "firebase/auth";
import type { User, UserRole } from "@/types";

interface OTPResult {
  isNewUser: boolean;
  role?: UserRole;
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  error: Error | null;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmOTP: (confirmationResult: ConfirmationResult, code: string) => Promise<OTPResult>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const { getDocument } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const data = await getDocument<User>(COLLECTIONS.USERS, uid);
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/config");
      const { createSessionCookie } = await import("@/lib/firebase/auth");
      const firebaseAuth = getFirebaseAuth();

      unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        setFirebaseUser(user);
        if (user) {
          await fetchUserData(user.uid);
          const idToken = await user.getIdToken();
          await createSessionCookie(idToken);
        } else {
          setUserData(null);
        }
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchUserData]);

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    setError(null);
    const { sendOTP } = await import("@/lib/firebase/auth");
    return sendOTP(phoneNumber);
  };

  const confirmOTP = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<OTPResult> => {
    setError(null);
    try {
      const { createSessionCookie } = await import("@/lib/firebase/auth");
      const result = await confirmationResult.confirm(code);
      setFirebaseUser(result.user);
      const idToken = await result.user.getIdToken();
      await createSessionCookie(idToken);

      const { getDocument } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const existingUser = await getDocument<User>(COLLECTIONS.USERS, result.user.uid);

      if (existingUser) {
        setUserData(existingUser);
        return { isNewUser: false, role: existingUser.role };
      }
      return { isNewUser: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Invalid OTP"));
      throw err;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setError(null);
    try {
      const { signInWithGoogle: googleSignIn } = await import("@/lib/firebase/auth");
      const { createSessionCookie } = await import("@/lib/firebase/auth");
      const result = await googleSignIn();
      setFirebaseUser(result.user);
      const idToken = await result.user.getIdToken();
      await createSessionCookie(idToken);
      await fetchUserData(result.user.uid);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Google sign-in failed"));
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    const { signOut: firebaseSignOut } = await import("@/lib/firebase/auth");
    await firebaseSignOut();
    setFirebaseUser(null);
    setUserData(null);
  };

  const refreshUserData = async (): Promise<void> => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        loading,
        error,
        signInWithPhone,
        confirmOTP,
        signInWithGoogle,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
