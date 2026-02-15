"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { ROLE_HOME_ROUTES } from "@/lib/utils/roles";
import { ShieldCheck } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { confirmOTP } = useAuth();
  const { t } = useDirection();

  useEffect(() => {
    const stored = sessionStorage.getItem("confirmationResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPhone(parsed.phone);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const confirmationResult = (window as unknown as Record<string, ConfirmationResult>).__confirmationResult;
      if (!confirmationResult) {
        router.push("/login");
        return;
      }

      const { isNewUser, role } = await confirmOTP(confirmationResult, code);
      sessionStorage.removeItem("confirmationResult");

      if (isNewUser || !role) {
        router.push("/onboarding");
      } else {
        router.push(ROLE_HOME_ROUTES[role]);
      }
    } catch {
      setError(t("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.", "Invalid verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500">
          <ShieldCheck className="h-7 w-7 text-navy-900" />
        </div>
        <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white">
          {t("التحقق من الرقم", "Verify Number")}
        </h1>
        <p className="mt-2 text-body-md text-navy-500">
          {t(`أدخل الرمز المرسل إلى ${phone}`, `Enter the code sent to ${phone}`)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("رمز التحقق", "Verification Code")}
          placeholder="000000"
          type="text"
          dir="ltr"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          error={error}
          className="text-center text-2xl tracking-widest"
        />
        <Button type="submit" fullWidth loading={loading} size="lg" disabled={code.length !== 6}>
          {t("تأكيد", "Confirm")}
        </Button>
      </form>
    </Card>
  );
}
