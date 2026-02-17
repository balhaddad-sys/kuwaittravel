"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/feedback/ToastProvider";
import { useDirection } from "@/providers/DirectionProvider";
import { Camera, Edit, Save, Globe, Phone, Mail } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const { t } = useDirection();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    nameAr: "",
    name: "",
    descriptionAr: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    licenseNumber: "",
  });

  const handleSave = () => {
    setEditing(false);
    toast({ type: "success", title: t("تم حفظ التغييرات بنجاح", "Changes saved successfully") });
  };

  return (
    <>
      <AppBar
        title={t("الملف التعريفي", "Profile")}
        breadcrumbs={[{ label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" }, { label: t("الملف التعريفي", "Profile") }]}
        actions={
          editing ? (
            <Button variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
              {t("حفظ", "Save")}
            </Button>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />} onClick={() => setEditing(true)}>
              {t("تعديل", "Edit")}
            </Button>
          )
        }
      />
      <Container size="md" className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Cover + Avatar */}
        <Card variant="elevated" padding="none">
          <div className="travel-cover-pattern relative h-32 sm:h-48 rounded-t-[var(--radius-card)] bg-gradient-to-l from-stone-700 via-stone-800 to-stone-900">
            {editing && (
              <button className="absolute top-4 end-4 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-body-sm text-white hover:bg-black/60 transition-colors">
                <Camera className="h-4 w-4" /> {t("تغيير الغلاف", "Change Cover")}
              </button>
            )}
          </div>
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="-mt-10 sm:-mt-12 flex items-end gap-3 sm:gap-4">
              <div className="relative">
                <Avatar size="xl" ring className="border-4 border-white dark:border-surface-dark-card h-20 w-20 sm:h-24 sm:w-24" />
                {editing && (
                  <button className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-stone-700 text-white hover:bg-stone-600">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <h2 className="text-heading-md sm:text-heading-lg font-bold text-stone-900 dark:text-white truncate">
                  {profile.nameAr || t("اسم الحملة", "Campaign Name")}
                </h2>
                <p className="text-body-sm sm:text-body-md text-stone-500 truncate">{profile.name || "Campaign Name"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white">{t("معلومات الحملة", "Campaign Info")}</h3>
          {editing ? (
            <div className="space-y-4">
              <Input label={t("اسم الحملة بالعربي", "Campaign Name (Arabic)")} value={profile.nameAr} onChange={(e) => setProfile({...profile, nameAr: e.target.value})} />
              <Input label={t("اسم الحملة بالإنجليزي", "Campaign Name (English)")} value={profile.name} dir="ltr" onChange={(e) => setProfile({...profile, name: e.target.value})} />
              <Textarea label={t("الوصف", "Description")} value={profile.descriptionAr} onChange={(e) => setProfile({...profile, descriptionAr: e.target.value})} />
              <Input label={t("رقم التواصل", "Contact Number")} value={profile.contactPhone} dir="ltr" onChange={(e) => setProfile({...profile, contactPhone: e.target.value})} />
              <Input label={t("البريد الإلكتروني", "Email")} value={profile.contactEmail} dir="ltr" onChange={(e) => setProfile({...profile, contactEmail: e.target.value})} />
              <Input label={t("الموقع الإلكتروني", "Website")} value={profile.website} dir="ltr" onChange={(e) => setProfile({...profile, website: e.target.value})} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-body-md sm:text-body-lg text-stone-700 dark:text-stone-200">
                {profile.descriptionAr || t("لم يتم إضافة وصف بعد", "No description added yet")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-stone-600 dark:text-stone-400">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Phone className="h-3.5 w-3.5 text-stone-500 shrink-0" /></span>
                  <span className="truncate">{profile.contactPhone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-stone-600 dark:text-stone-400">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Mail className="h-3.5 w-3.5 text-stone-500 shrink-0" /></span>
                  <span className="truncate">{profile.contactEmail || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-stone-600 dark:text-stone-400">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Globe className="h-3.5 w-3.5 text-stone-500 shrink-0" /></span>
                  <span className="truncate">{profile.website || "—"}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* License */}
        <Card variant="outlined" padding="lg" className="border-amber-300/70 dark:border-amber-800/45">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-2">{t("رقم الترخيص", "License Number")}</h3>
          <p className="text-body-md sm:text-body-lg font-mono text-stone-600 dark:text-stone-400">{profile.licenseNumber || "—"}</p>
        </Card>
      </Container>
    </>
  );
}
