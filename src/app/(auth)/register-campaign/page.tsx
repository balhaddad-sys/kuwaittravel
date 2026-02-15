"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { createDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { Building2 } from "lucide-react";

export default function RegisterCampaignPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    licenseNumber: "",
    contactPhone: "",
    description: "",
    descriptionAr: "",
  });
  const router = useRouter();
  const { firebaseUser, refreshUserData } = useAuth();
  const { t } = useDirection();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setError(t("يجب تسجيل الدخول أولاً.", "You must sign in first."));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const normalizedPhone = form.contactPhone.startsWith("+")
        ? form.contactPhone
        : `+965${form.contactPhone}`;

      // Create campaign
      const campaignId = await createDocument(COLLECTIONS.CAMPAIGNS, {
        ownerId: firebaseUser.uid,
        name: form.name,
        nameAr: form.nameAr,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        description: form.description,
        descriptionAr: form.descriptionAr,
        licenseNumber: form.licenseNumber,
        licenseImageUrl: "",
        contactPhone: normalizedPhone,
        galleryUrls: [],
        socialMedia: {},
        verificationStatus: "pending" as const,
        acceptsOnlinePayment: false,
        paymentMethods: [],
        stats: {
          totalTrips: 0,
          activeTrips: 0,
          totalBookings: 0,
          averageRating: 0,
          totalReviews: 0,
        },
        isActive: true,
      });

      // Create user profile
      await createDocument(
        COLLECTIONS.USERS,
        {
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber || "",
          displayName: form.name,
          displayNameAr: form.nameAr,
          role: "campaign_owner" as const,
          campaignId,
          preferredLanguage: "ar" as const,
          notificationTokens: [],
          isVerified: false,
          isActive: true,
        },
        firebaseUser.uid
      );

      await refreshUserData();
      router.push("/portal/dashboard");
    } catch {
      setError(
        t(
          "تعذر إكمال تسجيل الحملة حالياً. يرجى المحاولة مرة أخرى.",
          "Unable to complete campaign registration right now. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500">
          <Building2 className="h-7 w-7 text-navy-900" />
        </div>
        <h1 className="text-heading-lg font-bold text-navy-900 dark:text-white">
          {t("تسجيل حملة جديدة", "Register New Campaign")}
        </h1>
        <p className="mt-2 text-body-md text-navy-500">
          {t("أدخل بيانات حملتك للبدء", "Provide campaign details to get started")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("اسم الحملة بالعربي", "Campaign Name (Arabic)")}
          placeholder={t("حملة النور", "Al Noor Campaign")}
          value={form.nameAr}
          onChange={(e) => updateField("nameAr", e.target.value)}
          required
        />
        <Input
          label={t("اسم الحملة بالإنجليزي", "Campaign Name (English)")}
          placeholder="Al Noor Campaign"
          dir="ltr"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <Input
          label={t("رقم الترخيص", "License Number")}
          placeholder={t("رقم ترخيص وزارة الأوقاف", "Official license number")}
          value={form.licenseNumber}
          onChange={(e) => updateField("licenseNumber", e.target.value)}
          required
        />
        <Input
          label={t("رقم التواصل", "Contact Number")}
          placeholder={t("9XXXXXXX", "5XXXXXXX")}
          type="tel"
          dir="ltr"
          value={form.contactPhone}
          onChange={(e) => updateField("contactPhone", e.target.value)}
          required
        />
        <Textarea
          label={t("وصف الحملة", "Campaign Description")}
          placeholder={t("نبذة عن الحملة وخدماتها...", "Short description of the campaign and services...")}
          value={form.descriptionAr}
          onChange={(e) => updateField("descriptionAr", e.target.value)}
        />
        {error && <p className="text-center text-body-sm text-error">{error}</p>}
        <Button type="submit" fullWidth loading={loading} size="lg">
          {t("تسجيل الحملة", "Register Campaign")}
        </Button>
      </form>
    </Card>
  );
}
