"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { ROLE_HOME_ROUTES } from "@/lib/utils/roles";
import { getPendingOTP, clearPendingOTP } from "@/lib/otp-store";
import { ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { confirmOTP } = useAuth();
  const { t } = useDirection();

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("otp_phone");
    if (storedPhone) {
      setPhone(storedPhone);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const confirmationResult = getPendingOTP();
      if (!confirmationResult) {
        // OTP session lost (e.g. page refresh) — send user back to re-request
        router.push("/login");
        return;
      }

      const { isNewUser, role } = await confirmOTP(confirmationResult, code);
      clearPendingOTP();
      sessionStorage.removeItem("otp_phone");

      if (isNewUser || !role) {
        router.push("/onboarding");
      } else {
        router.push(ROLE_HOME_ROUTES[role]);
      }
    } catch {
      setError(t(
        "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.",
        "Invalid verification code. Please try again."
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-heading-lg font-bold text-stone-900 dark:text-white">
          {t("التحقق من الرقم", "Verify Number")}
        </h1>
        <p className="mt-2 text-body-md text-stone-500">
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
