"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { ROLE_HOME_ROUTES } from "@/lib/utils/roles";
import { UserCircle, Building2 } from "lucide-react";

type SafeRole = "traveler" | "campaign_owner";

export default function OnboardingPage() {
  const [step, setStep] = useState<"role" | "profile">("role");
  const [role, setRole] = useState<SafeRole | null>(null);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { firebaseUser, userData, refreshUserData } = useAuth();

  // Redirect already-onboarded users to their home
  useEffect(() => {
    if (userData?.role) {
      router.replace(ROLE_HOME_ROUTES[userData.role]);
    }
  }, [userData, router]);

  // Pre-populate name from Google account
  useEffect(() => {
    if (firebaseUser?.displayName && !name) {
      setName(firebaseUser.displayName);
    }
  }, [firebaseUser?.displayName, name]);

  const handleRoleSelect = (selectedRole: SafeRole) => {
    setRole(selectedRole);
    if (selectedRole === "campaign_owner") {
      router.push("/register-campaign");
      return;
    }
    setStep("profile");
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !role) return;
    setError("");
    setLoading(true);

    try {
      await createDocument(
        COLLECTIONS.USERS,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          displayName: name,
          displayNameAr: nameAr,
          photoURL: firebaseUser.photoURL || "",
          role,
          preferredLanguage: "ar" as const,
          notificationTokens: [],
          isVerified: false,
          isActive: true,
        },
        firebaseUser.uid
      );

      await refreshUserData();
      router.push(ROLE_HOME_ROUTES[role]);
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "role") {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white">
            أهلاً وسهلاً
          </h1>
          <p className="mt-2 text-body-md text-navy-500">
            كيف تريد استخدام المنصة؟
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelect("traveler")}
            className="flex w-full items-center gap-4 rounded-[var(--radius-card)] border-2 border-surface-border p-4 text-start transition-all hover:border-navy-700 hover:bg-navy-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100">
              <UserCircle className="h-6 w-6 text-navy-700" />
            </div>
            <div>
              <p className="text-body-lg font-semibold text-navy-900">مسافر</p>
              <p className="text-body-sm text-navy-500">ابحث واحجز رحلاتك الزيارية</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("campaign_owner")}
            className="flex w-full items-center gap-4 rounded-[var(--radius-card)] border-2 border-surface-border p-4 text-start transition-all hover:border-gold-500 hover:bg-gold-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100">
              <Building2 className="h-6 w-6 text-gold-700" />
            </div>
            <div>
              <p className="text-body-lg font-semibold text-navy-900">مدير حملة</p>
              <p className="text-body-sm text-navy-500">أدر حملتك وأنشئ رحلات جديدة</p>
            </div>
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-8">
        <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white">
          أكمل ملفك الشخصي
        </h1>
        <p className="mt-2 text-body-md text-navy-500">
          أدخل اسمك للمتابعة
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <Input
          label="الاسم بالعربي"
          placeholder="الاسم الكامل"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          required
        />
        <Input
          label="الاسم بالإنجليزي"
          placeholder="Full Name"
          dir="ltr"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {error && (
          <p className="text-body-sm text-red-500 text-center">{error}</p>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg">
          إنشاء الحساب
        </Button>
      </form>
    </Card>
  );
}
