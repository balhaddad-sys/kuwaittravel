"use client";

import { useState, useEffect } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, updateDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Campaign } from "@/types/campaign";
import { Save, Loader2, Landmark } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useDirection();
  const { userData } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Bank details state
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // Notification toggles (local state only)
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifDocuments, setNotifDocuments] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  useEffect(() => {
    if (!userData?.campaignId) {
      setLoading(false);
      return;
    }

    async function fetchCampaign() {
      try {
        const campaign = await getDocument<Campaign>(
          COLLECTIONS.CAMPAIGNS,
          userData!.campaignId!
        );
        if (campaign?.bankDetails) {
          setBankName(campaign.bankDetails.bankName || "");
          setIban(campaign.bankDetails.iban || "");
          setAccountHolder(campaign.bankDetails.accountHolder || "");
        }
      } catch (err) {
        console.error("Settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaign();
  }, [userData?.campaignId]);

  const handleSaveBankDetails = async () => {
    if (!userData?.campaignId) return;

    if (!bankName.trim() || !iban.trim() || !accountHolder.trim()) {
      toast({
        type: "warning",
        title: t(
          "يرجى ملء جميع حقول البيانات البنكية",
          "Please fill in all bank detail fields"
        ),
      });
      return;
    }

    setSaving(true);
    try {
      await updateDocument(COLLECTIONS.CAMPAIGNS, userData.campaignId, {
        bankDetails: {
          bankName: bankName.trim(),
          iban: iban.trim(),
          accountHolder: accountHolder.trim(),
        },
      });

      toast({
        type: "success",
        title: t("تم حفظ البيانات البنكية", "Bank details saved"),
      });
    } catch (err) {
      console.error("Save bank details error:", err);
      toast({
        type: "error",
        title: t("فشل حفظ البيانات البنكية", "Failed to save bank details"),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!userData?.campaignId) {
    return (
      <>
        <AppBar
          title={t("الإعدادات", "Settings")}
          breadcrumbs={[
            { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
            { label: t("الإعدادات", "Settings") },
          ]}
        />
        <Container size="md" className="sacred-pattern py-3 sm:py-6">
          <AlertBanner
            type="warning"
            title={t("لا توجد حملة مرتبطة", "No campaign linked")}
            description={t(
              "حسابك غير مرتبط بأي حملة. يرجى التواصل مع الدعم.",
              "Your account is not linked to any campaign. Please contact support."
            )}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar
        title={t("الإعدادات", "Settings")}
        breadcrumbs={[
          { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
          { label: t("الإعدادات", "Settings") },
        ]}
      />
      <Container size="md" className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
          </div>
        ) : (
          <>
            {/* Bank Details */}
            <Card variant="elevated" padding="lg" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                  <Landmark className="h-4 w-4" />
                </span>
                <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">
                  {t("البيانات البنكية", "Bank Details")}
                </h3>
              </div>
              <p className="text-body-sm text-stone-500 dark:text-stone-400">
                {t(
                  "تُستخدم لتحويل الأرباح إلى حسابك البنكي.",
                  "Used for transferring earnings to your bank account."
                )}
              </p>
              <Input
                label={t("اسم البنك", "Bank Name")}
                placeholder={t(
                  "بنك الكويت الوطني",
                  "National Bank of Kuwait"
                )}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <Input
                label={t("رقم الآيبان", "IBAN Number")}
                placeholder="KW00XXXX..."
                dir="ltr"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
              <Input
                label={t("اسم صاحب الحساب", "Account Holder Name")}
                placeholder={t(
                  "الاسم كما يظهر في الحساب",
                  "Name as it appears on the account"
                )}
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
              <Button
                variant="primary"
                leftIcon={
                  saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
                disabled={saving}
                onClick={handleSaveBankDetails}
              >
                {saving
                  ? t("جاري الحفظ...", "Saving...")
                  : t("حفظ", "Save")}
              </Button>
            </Card>

            {/* Notification Settings */}
            <Card variant="elevated" padding="lg" className="space-y-4">
              <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">
                {t("إعدادات الإشعارات", "Notification Settings")}
              </h3>
              <p className="text-body-sm text-stone-500 dark:text-stone-400">
                {t(
                  "تحكم في أنواع الإشعارات التي تريد استقبالها.",
                  "Control which types of notifications you want to receive."
                )}
              </p>
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span className="text-body-sm sm:text-body-md text-stone-700 dark:text-stone-200">
                    {t(
                      "إشعارات الحجوزات الجديدة",
                      "New booking notifications"
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifBookings}
                    onChange={(e) => setNotifBookings(e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-stone-400 text-stone-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span className="text-body-sm sm:text-body-md text-stone-700 dark:text-stone-200">
                    {t("إشعارات المدفوعات", "Payment notifications")}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifPayments}
                    onChange={(e) => setNotifPayments(e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-stone-400 text-stone-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span className="text-body-sm sm:text-body-md text-stone-700 dark:text-stone-200">
                    {t(
                      "تنبيهات المستندات الناقصة",
                      "Missing document alerts"
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifDocuments}
                    onChange={(e) => setNotifDocuments(e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-stone-400 text-stone-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span className="text-body-sm sm:text-body-md text-stone-700 dark:text-stone-200">
                    {t("تقارير أسبوعية", "Weekly reports")}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifWeekly}
                    onChange={(e) => setNotifWeekly(e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-stone-400 text-stone-700"
                  />
                </label>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                {t(
                  "إعدادات الإشعارات محفوظة محلياً. سيتم تفعيل الحفظ السحابي قريباً.",
                  "Notification settings are saved locally. Cloud sync will be available soon."
                )}
              </p>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
