"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/Card";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";

interface FAQItem { qAr: string; qEn: string; aAr: string; aEn: string }

const faqs: FAQItem[] = [
  { qAr: "كيف يمكنني حجز رحلة؟", qEn: "How do I book a trip?", aAr: "تصفح الرحلات المتاحة في صفحة الاستكشاف، اختر الرحلة المناسبة، حدد عدد المسافرين والباقة، ثم أكمل عملية الحجز.", aEn: "Browse available trips on the Discover page, select a trip, choose the number of travelers and package, then complete the booking." },
  { qAr: "ما هي طرق الدفع المتاحة؟", qEn: "What payment methods are available?", aAr: "نقبل الدفع عبر كي نت (KNET)، فيزا، ماستركارد، والتحويل البنكي. يمكنك الدفع على أقساط حسب جدول الدفع.", aEn: "We accept KNET, Visa, Mastercard, and bank transfers. You can pay in installments per the payment schedule." },
  { qAr: "هل يمكنني إلغاء الحجز؟", qEn: "Can I cancel a booking?", aAr: "نعم، يمكنك إلغاء الحجز وفقاً لسياسة الإلغاء الخاصة بالحملة. راجع شروط الإلغاء قبل الحجز.", aEn: "Yes, according to the campaign's cancellation policy. Review terms before booking." },
  { qAr: "كيف أتواصل مع الحملة؟", qEn: "How do I contact a campaign?", aAr: "يمكنك التواصل مع الحملة من صفحة تفاصيلها عبر رقم الهاتف أو البريد الإلكتروني.", aEn: "Contact the campaign from its detail page via phone or email." },
  { qAr: "ما هي المستندات المطلوبة؟", qEn: "What documents are required?", aAr: "عادة تحتاج جواز سفر ساري وتأشيرة حسب الوجهة. بعض الرحلات تتطلب شهادة تطعيم.", aEn: "Usually a valid passport and visa (destination-dependent). Some trips require vaccination certificates." },
  { qAr: "هل يمكنني الحجز لشخص آخر؟", qEn: "Can I book for someone else?", aAr: "نعم، يمكنك إضافة مسافرين آخرين عند الحجز وإدخال بياناتهم ومستنداتهم.", aEn: "Yes, you can add other travelers during booking and enter their details." },
];

export default function HelpPage() {
  const { t } = useDirection();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      <AppBar
        title={t("المساعدة والدعم", "Help & Support")}
        breadcrumbs={[{ label: t("الملف الشخصي", "Profile"), href: "/app/profile" }, { label: t("المساعدة", "Help") }]}
      />
      <Container size="md" className="py-4 sm:py-6 space-y-4">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-orange-500" />
            <h2 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white">{t("الأسئلة الشائعة", "FAQ")}</h2>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-surface-border/60 last:border-0 dark:border-surface-dark-border/60">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between gap-3 py-3.5 text-start">
                  <span className="text-body-sm sm:text-body-md font-semibold text-gray-900 dark:text-white">{t(faq.qAr, faq.qEn)}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform", openIdx === i && "rotate-180")} />
                </button>
                {openIdx === i && <p className="pb-3.5 text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t(faq.aAr, faq.aEn)}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h2 className="text-body-lg sm:text-heading-sm font-bold text-gray-900 dark:text-white mb-4">{t("تواصل معنا", "Contact Us")}</h2>
          <div className="space-y-3">
            {[
              { icon: Phone, labelAr: "هاتف الدعم", labelEn: "Support Phone", value: "+965 2222 0000" },
              { icon: Mail, labelAr: "البريد الإلكتروني", labelEn: "Email", value: "support@rahal.kw" },
              { icon: MessageCircle, labelAr: "واتساب", labelEn: "WhatsApp", value: "+965 9999 0000" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-body-sm text-gray-700 dark:text-gray-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"><c.icon className="h-4 w-4 text-gray-500" /></span>
                <div>
                  <p className="font-medium">{t(c.labelAr, c.labelEn)}</p>
                  <p className="text-gray-500" dir="ltr">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </div>
  );
}
