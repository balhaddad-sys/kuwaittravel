"use client";

import { useState, useEffect } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, updateDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Campaign } from "@/types/campaign";
import type { VerificationStatus } from "@/types/common";
import { Camera, Edit, Save, Globe, Phone, Mail, Shield, Loader2 } from "lucide-react";

const verificationBadge: Record<VerificationStatus, { variant: "success" | "warning" | "error"; labelAr: string; label: string }> = {
  pending: { variant: "warning", labelAr: "قيد المراجعة", label: "Under Review" },
  approved: { variant: "success", labelAr: "معتمد", label: "Verified" },
  rejected: { variant: "error", labelAr: "مرفوض", label: "Rejected" },
  suspended: { variant: "error", labelAr: "معلق", label: "Suspended" },
};

export default function ProfilePage() {
  const { toast } = useToast();
  const { t, language } = useDirection();
  const { userData } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [profile, setProfile] = useState({
    nameAr: "",
    name: "",
    descriptionAr: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    licenseNumber: "",
  });

  // Load campaign data from Firestore
  useEffect(() => {
    if (!userData?.campaignId) return;
    setLoading(true);
    getDocument<Campaign>(COLLECTIONS.CAMPAIGNS, userData.campaignId)
      .then((data) => {
        if (data) {
          setCampaign(data);
          setProfile({
            nameAr: data.nameAr || "",
            name: data.name || "",
            descriptionAr: data.descriptionAr || "",
            description: data.description || "",
            contactPhone: data.contactPhone || "",
            contactEmail: data.contactEmail || "",
            website: data.website || "",
            licenseNumber: data.licenseNumber || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [userData?.campaignId]);

  const handleSave = async () => {
    if (!userData?.campaignId) return;
    setSaving(true);
    try {
      await updateDocument(COLLECTIONS.CAMPAIGNS, userData.campaignId, {
        nameAr: profile.nameAr,
        name: profile.name,
        descriptionAr: profile.descriptionAr,
        description: profile.description,
        contactPhone: profile.contactPhone,
        contactEmail: profile.contactEmail,
        website: profile.website,
      });
      // Update local campaign state with new values
      setCampaign((prev) => prev ? { ...prev, ...profile } : prev);
      setEditing(false);
      toast({ type: "success", title: t("تم حفظ التغييرات بنجاح", "Changes saved successfully") });
    } catch {
      toast({ type: "error", title: t("فشل حفظ التغييرات", "Failed to save changes") });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to last saved values
    if (campaign) {
      setProfile({
        nameAr: campaign.nameAr || "",
        name: campaign.name || "",
        descriptionAr: campaign.descriptionAr || "",
        description: campaign.description || "",
        contactPhone: campaign.contactPhone || "",
        contactEmail: campaign.contactEmail || "",
        website: campaign.website || "",
        licenseNumber: campaign.licenseNumber || "",
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
        <AppBar
          title={t("الملف التعريفي", "Profile")}
          breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الملف التعريفي", "Profile") }]}
        />
        <Container size="md" className="py-3 sm:py-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
      <AppBar
        title={t("الملف التعريفي", "Profile")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الملف التعريفي", "Profile") }]}
        actions={
          editing ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
                {t("إلغاء", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                onClick={handleSave}
                disabled={saving}
              >
                {t("حفظ", "Save")}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />} onClick={() => setEditing(true)}>
              {t("تعديل", "Edit")}
            </Button>
          )
        }
      />
      <Container size="md" className="py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Cover + Avatar */}
        <Card variant="elevated" padding="none">
          <div className="eo-cover-pattern relative h-32 sm:h-48 rounded-t-[var(--radius-card)] bg-gradient-to-l from-[#0369A1] via-[#082F49] to-[#2E1065]">
            {editing && (
              <button className="absolute top-4 end-4 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-body-sm text-white hover:bg-black/60 transition-colors">
                <Camera className="h-4 w-4" /> {t("تغيير الغلاف", "Change Cover")}
              </button>
            )}
          </div>
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="-mt-10 sm:-mt-12 flex items-end gap-3 sm:gap-4">
              <div className="relative">
                <Avatar
                  size="xl"
                  ring
                  className="border-4 border-white dark:border-surface-dark-card h-20 w-20 sm:h-24 sm:w-24"
                  src={campaign?.logoUrl}
                />
                {editing && (
                  <button className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-md sm:text-heading-lg font-bold text-slate-900 dark:text-white truncate">
                    {profile.nameAr || t("اسم الحملة", "Campaign Name")}
                  </h2>
                  {campaign?.verificationStatus && (
                    <Badge
                      variant={verificationBadge[campaign.verificationStatus].variant}
                      size="sm"
                      dot
                    >
                      {language === "ar"
                        ? verificationBadge[campaign.verificationStatus].labelAr
                        : verificationBadge[campaign.verificationStatus].label}
                    </Badge>
                  )}
                </div>
                <p className="text-body-sm sm:text-body-md text-slate-500 truncate">{profile.name || "Campaign Name"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white">{t("معلومات الحملة", "Campaign Info")}</h3>
          {editing ? (
            <div className="space-y-4">
              <Input
                label={t("اسم الحملة بالعربي", "Campaign Name (Arabic)")}
                value={profile.nameAr}
                onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })}
              />
              <Input
                label={t("اسم الحملة بالإنجليزي", "Campaign Name (English)")}
                value={profile.name}
                dir="ltr"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Textarea
                label={t("الوصف بالعربي", "Description (Arabic)")}
                value={profile.descriptionAr}
                onChange={(e) => setProfile({ ...profile, descriptionAr: e.target.value })}
              />
              <Textarea
                label={t("الوصف بالإنجليزي", "Description (English)")}
                value={profile.description}
                dir="ltr"
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              />
              <Input
                label={t("رقم التواصل", "Contact Number")}
                value={profile.contactPhone}
                dir="ltr"
                onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
              />
              <Input
                label={t("البريد الإلكتروني", "Email")}
                value={profile.contactEmail}
                dir="ltr"
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
              />
              <Input
                label={t("الموقع الإلكتروني", "Website")}
                value={profile.website}
                dir="ltr"
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-body-md sm:text-body-lg text-slate-700 dark:text-slate-100">
                {profile.descriptionAr || t("لم يتم إضافة وصف بعد", "No description added yet")}
              </p>
              {profile.description && (
                <p className="text-body-sm text-slate-500 dark:text-slate-300/60" dir="ltr">
                  {profile.description}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-slate-600 dark:text-slate-300/60">
                  <span className="eo-icon-circle eo-icon-circle-sm"><Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" /></span>
                  <span className="truncate" dir="ltr">{profile.contactPhone || "---"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-slate-600 dark:text-slate-300/60">
                  <span className="eo-icon-circle eo-icon-circle-sm"><Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" /></span>
                  <span className="truncate" dir="ltr">{profile.contactEmail || "---"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-slate-600 dark:text-slate-300/60">
                  <span className="eo-icon-circle eo-icon-circle-sm"><Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" /></span>
                  <span className="truncate" dir="ltr">{profile.website || "---"}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* License */}
        <Card variant="outlined" padding="lg" className="border-violet-300/70 dark:border-violet-800/45">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-violet-500" />
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white">{t("رقم الترخيص", "License Number")}</h3>
          </div>
          <p className="text-body-md sm:text-body-lg font-mono text-slate-600 dark:text-slate-300/60">
            {profile.licenseNumber || "---"}
          </p>
          {campaign?.commercialRegNumber && (
            <div className="mt-3 pt-3 border-t border-violet-200/50 dark:border-violet-800/30">
              <p className="text-xs text-slate-500 dark:text-slate-300/60 mb-0.5">{t("السجل التجاري", "Commercial Registration")}</p>
              <p className="text-body-sm font-mono text-slate-600 dark:text-slate-300/60">{campaign.commercialRegNumber}</p>
            </div>
          )}
        </Card>

        {/* Social Media */}
        {campaign?.socialMedia && (campaign.socialMedia.instagram || campaign.socialMedia.twitter || campaign.socialMedia.whatsapp) && (
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white mb-3">
              {t("وسائل التواصل", "Social Media")}
            </h3>
            <div className="space-y-2">
              {campaign.socialMedia.instagram && (
                <div className="flex items-center gap-2 text-body-sm text-slate-600 dark:text-slate-300/60">
                  <span className="font-medium text-slate-500">Instagram</span>
                  <span className="truncate" dir="ltr">{campaign.socialMedia.instagram}</span>
                </div>
              )}
              {campaign.socialMedia.twitter && (
                <div className="flex items-center gap-2 text-body-sm text-slate-600 dark:text-slate-300/60">
                  <span className="font-medium text-slate-500">Twitter</span>
                  <span className="truncate" dir="ltr">{campaign.socialMedia.twitter}</span>
                </div>
              )}
              {campaign.socialMedia.whatsapp && (
                <div className="flex items-center gap-2 text-body-sm text-slate-600 dark:text-slate-300/60">
                  <span className="font-medium text-slate-500">WhatsApp</span>
                  <span className="truncate" dir="ltr">{campaign.socialMedia.whatsapp}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Campaign Stats */}
        {campaign?.stats && (
          <Card variant="elevated" padding="lg">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-slate-900 dark:text-white mb-3">
              {t("إحصائيات الحملة", "Campaign Stats")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-[#383838] dark:bg-[#262626]/50">
                <p className="text-heading-md font-bold text-slate-900 dark:text-white">{campaign.stats.totalTrips}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300/60">{t("إجمالي الرحلات", "Total Trips")}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-[#383838] dark:bg-[#262626]/50">
                <p className="text-heading-md font-bold text-slate-900 dark:text-white">{campaign.stats.totalBookings}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300/60">{t("إجمالي الحجوزات", "Total Bookings")}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-[#383838] dark:bg-[#262626]/50">
                <p className="text-heading-md font-bold text-violet-600 dark:text-violet-400">{campaign.stats.averageRating > 0 ? campaign.stats.averageRating.toFixed(1) : "---"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300/60">{t("التقييم", "Rating")} ({campaign.stats.totalReviews})</p>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
