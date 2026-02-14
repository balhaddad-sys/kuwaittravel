"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { Phone } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithPhone } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formatted = phone.startsWith("+965") ? phone : `+965${phone}`;
      const confirmationResult = await signInWithPhone(formatted);
      // Store confirmation result in sessionStorage for verify page
      sessionStorage.setItem("confirmationResult", JSON.stringify({ phone: formatted }));
      // We need to pass this through — store as window property for simplicity
      (window as unknown as Record<string, ConfirmationResult>).__confirmationResult = confirmationResult;
      router.push("/verify");
    } catch {
      setError("فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
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
            أدخل رقم هاتفك للمتابعة
          </p>
        </div>

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
