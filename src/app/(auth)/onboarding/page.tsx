"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
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
  const { t } = useDirection();

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
          displayName: name.replace(/<[^>]*>/g, "").trim(),
          displayNameAr: nameAr.replace(/<[^>]*>/g, "").trim(),
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
      if (process.env.NODE_ENV !== "production") console.error("Onboarding error:", err);
      setError(t("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.", "Something went wrong while creating your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (step === "role") {
    return (
      <Card variant="elevated" padding="lg" className="sacred-pattern overflow-hidden">
        <div className="mb-6 rounded-[var(--radius-lg)] border border-orange-200/70 bg-orange-50/75 px-4 py-3 dark:border-orange-800/45 dark:bg-orange-900/20">
          <div className="flex items-center justify-between text-body-sm font-medium text-orange-700 dark:text-orange-300">
            <span>{t("الخطوة 1 من 2", "Step 1 of 2")}</span>
            <span>{t("اختيار الدور", "Select Role")}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100/80 dark:bg-orange-900/50">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-heading-lg font-bold text-gray-900 dark:text-white">
            {t("أهلاً وسهلاً", "Welcome")}
          </h1>
          <p className="mt-2 text-body-md text-gray-500">
            {t("كيف تريد استخدام المنصة؟", "How would you like to use the platform?")}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelect("traveler")}
            className="sacred-panel animate-stagger-in flex w-full items-center gap-4 rounded-[var(--radius-card)] p-4 text-start transition-all hover:border-gray-300 hover:bg-gray-50/40 dark:hover:border-indigo-600/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <UserCircle className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-body-lg font-semibold text-gray-900 dark:text-white">{t("مسافر", "Traveler")}</p>
              <p className="text-body-sm text-gray-500 dark:text-indigo-300/60">{t("ابحث واحجز رحلاتك الزيارية", "Find and book pilgrimage trips")}</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("campaign_owner")}
            className="sacred-panel animate-stagger-in stagger-delay-2 flex w-full items-center gap-4 rounded-[var(--radius-card)] p-4 text-start transition-all hover:border-orange-300/80 hover:bg-orange-50/50 dark:hover:border-orange-700/60 dark:hover:bg-orange-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Building2 className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-body-lg font-semibold text-gray-900 dark:text-white">{t("مدير حملة", "Campaign Owner")}</p>
              <p className="text-body-sm text-gray-500 dark:text-indigo-300/60">{t("أدر حملتك وأنشئ رحلات جديدة", "Manage your campaign and launch new trips")}</p>
            </div>
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" className="sacred-pattern overflow-hidden">
      <div className="mb-6 rounded-[var(--radius-lg)] border border-orange-200/70 bg-orange-50/75 px-4 py-3 dark:border-orange-800/45 dark:bg-orange-900/20">
        <div className="flex items-center justify-between text-body-sm font-medium text-orange-700 dark:text-orange-300">
          <span>{t("الخطوة 2 من 2", "Step 2 of 2")}</span>
          <span>{t("بيانات الملف", "Profile Info")}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100/80 dark:bg-orange-900/50">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-heading-lg font-bold text-gray-900 dark:text-white">
          {t("أكمل ملفك الشخصي", "Complete Your Profile")}
        </h1>
        <p className="mt-2 text-body-md text-gray-500">
          {t("أدخل اسمك للمتابعة", "Enter your name to continue")}
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <Input
          label={t("الاسم بالعربي", "Arabic Name")}
          placeholder={t("الاسم الكامل", "Full Arabic Name")}
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          required
        />
        <Input
          label={t("الاسم بالإنجليزي", "English Name")}
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
          {t("إنشاء الحساب", "Create Account")}
        </Button>
      </form>
    </Card>
  );
}
