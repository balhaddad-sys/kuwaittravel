"use client";

import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { parseTimestamp, formatDate } from "@/lib/utils/format";
import { FileText, CheckCircle2, AlertCircle, Upload } from "lucide-react";

export default function DocumentsPage() {
  const { t, language } = useDirection();
  const { userData } = useAuth();

  const passportNumber = userData?.passportNumber || "";
  const passportExpiry = parseTimestamp(userData?.passportExpiry);
  const civilId = userData?.civilId || "";
  const locale = language === "ar" ? "ar-KW" : "en-US";

  const docs = [
    {
      titleAr: "جواز السفر", titleEn: "Passport",
      hasData: !!passportNumber,
      details: passportNumber ? `${passportNumber}${passportExpiry ? ` — ${t("صالح حتى", "Valid until")} ${formatDate(passportExpiry, locale)}` : ""}` : null,
    },
    {
      titleAr: "البطاقة المدنية", titleEn: "Civil ID",
      hasData: !!civilId,
      details: civilId || null,
    },
    {
      titleAr: "صورة شخصية", titleEn: "Personal Photo",
      hasData: !!userData?.avatarUrl,
      details: userData?.avatarUrl ? t("تم الرفع", "Uploaded") : null,
    },
  ];

  return (
    <div className="min-h-screen">
      <AppBar
        title={t("المستندات والجوازات", "Documents & Passports")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("المستندات", "Documents") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-3">
        {docs.map((doc, i) => (
          <Card key={i} variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                <h3 className="text-body-md sm:text-heading-sm font-bold text-slate-900 dark:text-white">{t(doc.titleAr, doc.titleEn)}</h3>
              </div>
              <Badge variant={doc.hasData ? "success" : "warning"} size="sm">
                {doc.hasData ? <><CheckCircle2 className="h-3 w-3 me-1" />{t("متوفر", "Available")}</> : <><AlertCircle className="h-3 w-3 me-1" />{t("مطلوب", "Required")}</>}
              </Badge>
            </div>
            {doc.hasData && doc.details ? (
              <div className="rounded-lg bg-surface-muted p-3 dark:bg-surface-dark-card/50">
                <p className="text-body-sm font-medium text-slate-900 dark:text-white">{doc.details}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-surface-border p-4 text-slate-400 dark:border-surface-dark-border">
                <Upload className="h-5 w-5" />
                <p className="text-body-sm">{t("أضف هذا المستند من صفحة الحجز أو التعديل", "Add this document from the booking or edit page")}</p>
              </div>
            )}
          </Card>
        ))}

        <Card variant="outlined" padding="lg" className="border-[#EBEBEB] dark:border-[#383838]/60">
          <p className="text-body-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t(
              "يتم تشفير جميع المستندات وتخزينها بشكل آمن. يمكنك تحديث مستنداتك عند إنشاء حجز جديد أو من خلال التواصل مع الحملة.",
              "All documents are encrypted and securely stored. You can update your documents when creating a new booking or by contacting the campaign."
            )}
          </p>
        </Card>
      </Container>
    </div>
  );
}
