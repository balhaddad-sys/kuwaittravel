"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { FileUpload } from "@/components/forms/FileUpload";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { useAuth } from "@/hooks/useAuth";
import { useDirection } from "@/providers/DirectionProvider";
import { useToast } from "@/components/feedback/ToastProvider";
import { createDocument, updateDocument, getDocument } from "@/lib/firebase/firestore";
import { uploadFile, generateStoragePath } from "@/lib/firebase/storage";
import type { User } from "@/types/user";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { ShieldCheck, Building2, FileText, Phone, ClipboardCheck } from "lucide-react";

interface FormData {
  nameAr: string;
  name: string;
  descriptionAr: string;
  description: string;
  licenseNumber: string;
  commercialRegNumber: string;
  licenseFile: File | null;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  whatsapp: string;
}

const initialForm: FormData = {
  nameAr: "",
  name: "",
  descriptionAr: "",
  description: "",
  licenseNumber: "",
  commercialRegNumber: "",
  licenseFile: null,
  phone: "",
  email: "",
  website: "",
  instagram: "",
  whatsapp: "",
};

export default function RegisterCampaignPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { firebaseUser, refreshUserData } = useAuth();
  const { t } = useDirection();
  const { toast } = useToast();

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = async () => {
    if (!firebaseUser) {
      toast({ type: "error", title: t("يجب تسجيل الدخول أولاً", "You must sign in first") });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Upload license image (skip if no file)
      let licenseImageUrl = "";
      if (form.licenseFile) {
        try {
          const path = generateStoragePath("licenses", firebaseUser.uid, form.licenseFile.name);
          licenseImageUrl = await uploadFile(path, form.licenseFile);
        } catch (uploadErr) {
          if (process.env.NODE_ENV !== "production") console.warn("License upload failed, continuing without image:", uploadErr);
        }
      }

      const normalizedPhone = form.phone.startsWith("+")
        ? form.phone
        : `+965${form.phone}`;

      // Step 2: Create campaign document
      const campaignId = await createDocument(COLLECTIONS.CAMPAIGNS, {
        ownerId: firebaseUser.uid,
        name: form.name,
        nameAr: form.nameAr,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        description: form.description,
        descriptionAr: form.descriptionAr,
        licenseNumber: form.licenseNumber,
        commercialRegNumber: form.commercialRegNumber || null,
        licenseImageUrl,
        contactPhone: normalizedPhone,
        contactEmail: form.email || null,
        website: form.website || null,
        galleryUrls: [],
        socialMedia: {
          instagram: form.instagram || null,
          whatsapp: form.whatsapp || null,
        },
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

      // Step 3: Create or update user document
      const existingUser = await getDocument<User>(COLLECTIONS.USERS, firebaseUser.uid);
      if (existingUser) {
        // User already exists — just link the campaign
        await updateDocument(COLLECTIONS.USERS, firebaseUser.uid, {
          campaignId,
          role: "campaign_owner",
          displayName: form.name,
          displayNameAr: form.nameAr,
        });
      } else {
        // New user — create full profile
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
      }

      await refreshUserData();
      toast({
        type: "success",
        title: t("تم تسجيل الحملة بنجاح", "Campaign registered successfully"),
        description: t("سيقوم فريقنا بمراجعة طلبك", "Our team will review your application"),
      });
      router.push("/portal/dashboard");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Campaign registration failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        type: "error",
        title: t("تعذر إكمال التسجيل", "Registration failed"),
        description: msg,
        duration: 8000,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: t("بيانات المنظمة", "Organization"),
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Building2 className="h-4 w-4" />
            <span className="text-body-sm font-medium">{t("بيانات المنظمة الأساسية", "Basic organization details")}</span>
          </div>
          <Input
            label={t("اسم الحملة بالعربي", "Campaign Name (Arabic)")}
            placeholder={t("حملة النور", "Al Noor Campaign")}
            value={form.nameAr}
            onChange={(e) => update("nameAr", e.target.value)}
            required
          />
          <Input
            label={t("اسم الحملة بالإنجليزي", "Campaign Name (English)")}
            placeholder="Al Noor Campaign"
            dir="ltr"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <Textarea
            label={t("وصف الحملة بالعربي", "Description (Arabic)")}
            placeholder={t("نبذة عن الحملة وخدماتها...", "Brief description of your campaign...")}
            value={form.descriptionAr}
            onChange={(e) => update("descriptionAr", e.target.value)}
          />
          <Textarea
            label={t("وصف الحملة بالإنجليزي", "Description (English)")}
            placeholder="Brief description of your campaign and services..."
            dir="ltr"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      ),
      isValid: form.nameAr.trim().length > 0 && form.name.trim().length > 0,
    },
    {
      label: t("الوثائق الرسمية", "Legal Documents"),
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <FileText className="h-4 w-4" />
            <span className="text-body-sm font-medium">{t("وثائق الترخيص والتسجيل", "License & registration documents")}</span>
          </div>
          <Input
            label={t("رقم ترخيص وزارة الأوقاف", "Waqf Ministry License Number")}
            placeholder={t("أدخل رقم الترخيص", "Enter license number")}
            value={form.licenseNumber}
            onChange={(e) => update("licenseNumber", e.target.value)}
            required
          />
          <Input
            label={t("رقم السجل التجاري (اختياري)", "Commercial Registration (Optional)")}
            placeholder={t("أدخل رقم السجل التجاري", "Enter commercial registration number")}
            value={form.commercialRegNumber}
            onChange={(e) => update("commercialRegNumber", e.target.value)}
          />
          {form.licenseFile && (
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-success-light p-2.5 text-body-sm text-green-800">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{t("ملف مرفق:", "File attached:")} {form.licenseFile.name}</span>
              <button type="button" onClick={() => update("licenseFile", null)} className="shrink-0 text-green-600 hover:text-error transition-colors">
                {t("تغيير", "Change")}
              </button>
            </div>
          )}
          {!form.licenseFile && (
            <FileUpload
              label={t("صورة الترخيص", "License Image")}
              accept="image/*,.pdf"
              maxSize={5}
              onFilesChange={(files) => update("licenseFile", files[0] || null)}
              hint={t("صورة أو ملف PDF — الحد الأقصى 5 ميغابايت", "Image or PDF — max 5MB")}
            />
          )}
        </div>
      ),
      isValid: form.licenseNumber.trim().length > 0 && form.licenseFile !== null,
    },
    {
      label: t("التواصل", "Contact"),
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Phone className="h-4 w-4" />
            <span className="text-body-sm font-medium">{t("بيانات التواصل والحسابات", "Contact info & social media")}</span>
          </div>
          <PhoneInput
            label={t("رقم الهاتف", "Phone Number")}
            placeholder="9XXXXXXX"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
          />
          <Input
            label={t("البريد الإلكتروني (اختياري)", "Email (Optional)")}
            type="email"
            dir="ltr"
            placeholder="info@campaign.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Input
            label={t("الموقع الإلكتروني (اختياري)", "Website (Optional)")}
            dir="ltr"
            placeholder="https://campaign.com"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("انستجرام (اختياري)", "Instagram (Optional)")}
              dir="ltr"
              placeholder="@campaign"
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
            />
            <Input
              label={t("واتساب (اختياري)", "WhatsApp (Optional)")}
              dir="ltr"
              placeholder="+965XXXXXXXX"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
            />
          </div>
        </div>
      ),
      isValid: form.phone.trim().length >= 8,
    },
    {
      label: t("المراجعة", "Review"),
      content: (
        <div className="space-y-3 sm:space-y-5">
          <div className="flex items-center gap-2 mb-1 text-slate-500">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-body-sm font-medium">{t("راجع البيانات قبل الإرسال", "Review your details before submitting")}</span>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
            <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-sky-500 shrink-0" />
              {t("بيانات المنظمة", "Organization")}
            </h3>
            <dl className="space-y-2 text-body-sm">
              <div>
                <dt className="text-slate-500 text-xs">{t("الاسم بالعربي", "Name (AR)")}</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{form.nameAr || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs">{t("الاسم بالإنجليزي", "Name (EN)")}</dt>
                <dd className="font-medium text-slate-900 dark:text-white" dir="ltr">{form.name || "—"}</dd>
              </div>
              {form.descriptionAr && (
                <div>
                  <dt className="text-slate-500 text-xs mb-0.5">{t("الوصف", "Description")}</dt>
                  <dd className="text-slate-700 dark:text-sky-300/60">{form.descriptionAr}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
            <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-500 shrink-0" />
              {t("الوثائق الرسمية", "Legal Documents")}
            </h3>
            <dl className="space-y-2 text-body-sm">
              <div>
                <dt className="text-slate-500 text-xs">{t("رقم الترخيص", "License No.")}</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{form.licenseNumber || "—"}</dd>
              </div>
              {form.commercialRegNumber && (
                <div>
                  <dt className="text-slate-500 text-xs">{t("السجل التجاري", "Comm. Reg.")}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{form.commercialRegNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500 text-xs">{t("صورة الترخيص", "License File")}</dt>
                <dd className="font-medium text-slate-900 dark:text-white truncate">{form.licenseFile?.name || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
            <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-sky-500 shrink-0" />
              {t("بيانات التواصل", "Contact Info")}
            </h3>
            <dl className="space-y-2 text-body-sm">
              <div>
                <dt className="text-slate-500 text-xs">{t("الهاتف", "Phone")}</dt>
                <dd className="font-medium text-slate-900 dark:text-white" dir="ltr">+965 {form.phone}</dd>
              </div>
              {form.email && (
                <div>
                  <dt className="text-slate-500 text-xs">{t("البريد", "Email")}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white truncate" dir="ltr">{form.email}</dd>
                </div>
              )}
              {form.website && (
                <div>
                  <dt className="text-slate-500 text-xs">{t("الموقع", "Website")}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white truncate" dir="ltr">{form.website}</dd>
                </div>
              )}
              {(form.instagram || form.whatsapp) && (
                <div>
                  <dt className="text-slate-500 text-xs">{t("التواصل الاجتماعي", "Social")}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white truncate" dir="ltr">
                    {[form.instagram, form.whatsapp].filter(Boolean).join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <p className="text-body-sm text-slate-400 text-center">
            {t(
              "بالضغط على إرسال، أنت توافق على شروط وأحكام المنصة",
              "By submitting, you agree to the platform terms and conditions"
            )}
          </p>
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <Card variant="elevated" padding="md">
      <div className="text-center mb-4 sm:mb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg">
          <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        </div>
        <h1 className="text-heading-md sm:text-heading-lg font-bold text-slate-900 dark:text-white">
          {t("تسجيل حملة جديدة", "Register New Campaign")}
        </h1>
        <p className="mt-1.5 text-body-sm sm:text-body-md text-slate-500">
          {t(
            "أكمل البيانات التالية لتقديم طلب تسجيل حملتك في المنصة",
            "Complete the following steps to submit your campaign application"
          )}
        </p>
      </div>

      <MultiStepForm
        steps={steps}
        onComplete={handleComplete}
        completeLabel={t("إرسال الطلب", "Submit Application")}
        nextLabel={t("التالي", "Next")}
        prevLabel={t("السابق", "Back")}
        loading={loading}
      />
    </Card>
  );
}
