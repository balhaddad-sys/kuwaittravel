"use client";

import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { formatPhone } from "@/lib/utils/format";
import { ShieldCheck, Phone, Mail, KeyRound, Fingerprint } from "lucide-react";

export default function SecurityPage() {
  const { t } = useDirection();
  const { firebaseUser, userData } = useAuth();
  const phone = firebaseUser?.phoneNumber || userData?.phone || "";
  const email = firebaseUser?.email || userData?.email || "";
  const providers = firebaseUser?.providerData?.map((p) => p.providerId) || [];
  const hasGoogle = providers.includes("google.com");
  const hasPhone = providers.includes("phone");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <AppBar
        title={t("الأمان والخصوصية", "Security & Privacy")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("الأمان", "Security") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-4">
        <Card variant="elevated" padding="lg">
          <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-violet-500" />
            {t("طرق تسجيل الدخول", "Sign-in Methods")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-surface-border/70 p-3 dark:border-surface-dark-border/70">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/50"><Phone className="h-4 w-4 text-slate-500" /></span>
                <div>
                  <p className="text-body-sm font-medium text-slate-900 dark:text-white">{t("رقم الهاتف", "Phone Number")}</p>
                  {phone ? <p className="text-xs text-slate-500" dir="ltr">{formatPhone(phone)}</p> : <p className="text-xs text-slate-400">{t("غير مرتبط", "Not linked")}</p>}
                </div>
              </div>
              {hasPhone && <Badge variant="success" size="sm">{t("مفعّل", "Active")}</Badge>}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-surface-border/70 p-3 dark:border-surface-dark-border/70">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/50"><Mail className="h-4 w-4 text-slate-500" /></span>
                <div>
                  <p className="text-body-sm font-medium text-slate-900 dark:text-white">{hasGoogle ? "Google" : t("البريد الإلكتروني", "Email")}</p>
                  {email ? <p className="text-xs text-slate-500" dir="ltr">{email}</p> : <p className="text-xs text-slate-400">{t("غير مرتبط", "Not linked")}</p>}
                </div>
              </div>
              {hasGoogle && <Badge variant="success" size="sm">{t("مفعّل", "Active")}</Badge>}
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-500" />
            {t("حالة الحساب", "Account Status")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-body-sm text-slate-600 dark:text-slate-400">{t("التحقق", "Verification")}</span><Badge variant={userData?.isVerified ? "success" : "warning"} size="sm">{userData?.isVerified ? t("موثق", "Verified") : t("غير موثق", "Unverified")}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-body-sm text-slate-600 dark:text-slate-400">{t("نوع الحساب", "Type")}</span><Badge variant="info" size="sm">{userData?.role === "campaign_owner" ? t("صاحب حملة", "Owner") : t("مسافر", "Traveler")}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-body-sm text-slate-600 dark:text-slate-400">{t("الحالة", "Status")}</span><Badge variant="success" size="sm">{t("نشط", "Active")}</Badge></div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-body-sm sm:text-body-md font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-violet-500" />
            {t("الخصوصية", "Privacy")}
          </h3>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("بياناتك محمية ومشفرة وفقاً لأعلى المعايير الأمنية. لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك.", "Your data is protected and encrypted. We do not share your information with third parties without your consent.")}
          </p>
        </Card>
      </Container>
    </div>
  );
}
