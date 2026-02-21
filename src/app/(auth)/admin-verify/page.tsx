"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { ShieldCheck } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";
import type { User } from "@/types";

const ADMIN_CONFIRMATION_KEY = "adminConfirmationResult";
const ADMIN_CONFIRMATION_GLOBAL = "__adminConfirmationResult";

function isAdminRole(role: User["role"] | string | undefined): boolean {
  const trimmed = role?.trim();
  return trimmed === "admin" || trimmed === "super_admin";
}

export default function AdminVerifyPage() {
  const router = useRouter();
  const { confirmOTP, logout } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useDirection();

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_CONFIRMATION_KEY);
    if (!stored) {
      router.replace("/admin-login");
      return;
    }

    const parsed = JSON.parse(stored) as { phone?: string };
    setPhone(parsed.phone || "");
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const confirmationResult = (window as unknown as Record<
        string,
        ConfirmationResult
      >)[ADMIN_CONFIRMATION_GLOBAL];

      if (!confirmationResult) {
        router.replace("/admin-login");
        return;
      }

      const { role } = await confirmOTP(confirmationResult, code);
      sessionStorage.removeItem(ADMIN_CONFIRMATION_KEY);

      if (isAdminRole(role)) {
        router.push("/admin/dashboard");
        return;
      }

      await logout();
      router.replace("/admin-login?error=unauthorized");
    } catch {
      setError(t("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.", "Invalid verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-600">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          {t("تحقق دخول المشرف", "Admin Verification")}
        </h1>
        <p className="mt-2 text-body-md text-slate-500">
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
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          error={error}
          className="text-center text-2xl tracking-widest"
        />
        <Button
          type="submit"
          fullWidth
          loading={loading}
          size="lg"
          disabled={code.length !== 6}
        >
          {t("تأكيد دخول المشرف", "Confirm Admin Login")}
        </Button>
      </form>
    </Card>
  );
}
