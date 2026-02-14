"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { Phone } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formatted = phone.startsWith("+965") ? phone : `+965${phone}`;
      const confirmationResult = await signInWithPhone(formatted);
      sessionStorage.setItem("confirmationResult", JSON.stringify({ phone: formatted }));
      (window as unknown as Record<string, ConfirmationResult>).__confirmationResult = confirmationResult;
      router.push("/verify");
    } catch {
      setError("فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/onboarding");
    } catch {
      setError("فشل تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div id="recaptcha-container" />
      <Card variant="elevated" padding="lg">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-700">
            <Phone className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white">
            مرحباً بك
          </h1>
          <p className="mt-2 text-body-md text-navy-500">
            سجّل الدخول للمتابعة
          </p>
        </div>

        {/* Google Sign-In */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          size="lg"
          loading={googleLoading}
          onClick={handleGoogleSignIn}
          className="mb-4"
        >
          <GoogleIcon className="h-5 w-5 me-2" />
          الدخول بحساب Google
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy-200 dark:border-navy-600" />
          </div>
          <div className="relative flex justify-center text-body-sm">
            <span className="bg-white dark:bg-navy-800 px-3 text-navy-400">أو</span>
          </div>
        </div>

        {/* Phone Sign-In */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="رقم الهاتف"
            placeholder="9XXXXXXX"
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftAddon={<span className="text-body-sm font-medium">+965</span>}
            error={error}
          />
          <Button type="submit" fullWidth loading={loading} size="lg">
            إرسال رمز التحقق
          </Button>
        </form>
      </Card>
    </>
  );
}
