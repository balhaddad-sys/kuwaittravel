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

/** Trim role to guard against Firestore whitespace (e.g. "super_admin " → "super_admin") */
function normalizeUserData(data: User | null): User | null {
  if (data?.role) {
    data.role = data.role.trim() as UserRole;
  }
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = useCallback(async (uid: string): Promise<User | null> => {
    try {
      const { getDocument } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const data = normalizeUserData(await getDocument<User>(COLLECTIONS.USERS, uid));
      setUserData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
      return null;
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

    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeUser: (() => void) | undefined;

    (async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/config");
      const { onDocumentChange } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const firebaseAuth = getFirebaseAuth();

      unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
        setFirebaseUser(user);

        // Clean up previous user listener
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = undefined;
        }

        if (user) {
          // Listen for real-time changes to the user document
          unsubscribeUser = onDocumentChange<User>(
            COLLECTIONS.USERS,
            user.uid,
            (data) => {
              setUserData(normalizeUserData(data));
              setLoading(false);
            }
          );
        } else {
          setUserData(null);
          setLoading(false);
        }
      });
    })();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

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
      const result = await confirmationResult.confirm(code);
      setFirebaseUser(result.user);

      const { getDocument } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const existingUser = normalizeUserData(await getDocument<User>(COLLECTIONS.USERS, result.user.uid));

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
      const result = await googleSignIn();
      setFirebaseUser(result.user);
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
