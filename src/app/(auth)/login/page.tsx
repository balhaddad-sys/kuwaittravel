"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { ROLE_HOME_ROUTES } from "@/lib/utils/roles";
import { Phone } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";
import type { User } from "@/types";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithPhone, signInWithGoogle } = useAuth();
  const { t } = useDirection();

  useEffect(() => {
    router.prefetch("/verify");
    router.prefetch("/onboarding");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (!/^[569]\d{7}$/.test(digits)) {
      setError(t("يرجى إدخال رقم هاتف كويتي صحيح (8 أرقام).", "Please enter a valid Kuwaiti phone number (8 digits)."));
      return;
    }

    setLoading(true);

    try {
      const formatted = `+965${digits}`;
      const confirmationResult = await signInWithPhone(formatted);
      sessionStorage.setItem("confirmationResult", JSON.stringify({ phone: formatted }));
      (window as unknown as Record<string, ConfirmationResult>).__confirmationResult = confirmationResult;
      router.push("/verify");
    } catch {
      setError(t("فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.", "Failed to send verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      const { getFirebaseAuth } = await import("@/lib/firebase/config");
      const { getDocument } = await import("@/lib/firebase/firestore");
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      const currentUser = getFirebaseAuth().currentUser;
      if (currentUser) {
        const existingUser = await getDocument<User>(COLLECTIONS.USERS, currentUser.uid);
        const role = existingUser?.role?.trim() as User["role"] | undefined;
        if (role) {
          router.replace(ROLE_HOME_ROUTES[role]);
          return;
        }
      }
      router.replace("/onboarding");
    } catch {
      setError(t("فشل تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى.", "Google sign-in failed. Please try again."));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div id="recaptcha-container" />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 shadow-[0_4px_14px_rgba(14,165,233,0.35)]">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("مرحباً بك في رحال", "Welcome to Rahal")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {t("سجّل الدخول للوصول إلى رحلاتك", "Sign in to access your trips")}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Google Sign-In */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          size="lg"
          loading={googleLoading}
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="h-5 w-5" />
          {t("المتابعة بحساب Google", "Continue with Google")}
        </Button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">{t("أو عبر رقم الهاتف", "or via phone number")}</span>
          </div>
        </div>

        {/* Phone Sign-In */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("رقم الهاتف الكويتي", "Kuwait Phone Number")}
            placeholder="5XXXXXXX / 6XXXXXXX / 9XXXXXXX"
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftAddon={<span className="text-sm font-semibold text-slate-500">+965</span>}
            error={error}
          />
          <Button type="submit" fullWidth loading={loading} size="lg">
            {t("إرسال رمز التحقق", "Send Verification Code")}
          </Button>
        </form>
      </div>

      {/* Privacy note */}
      <p className="mt-5 text-center text-xs text-slate-400">
        {t(
          "بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.",
          "By continuing, you agree to our Terms of Service and Privacy Policy."
        )}
      </p>
    </>
  );
}
