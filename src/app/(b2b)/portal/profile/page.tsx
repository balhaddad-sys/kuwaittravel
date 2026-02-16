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
import { Camera, Edit, Save, Globe, Phone, Mail } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
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
    toast({ type: "success", title: "تم حفظ التغييرات بنجاح" });
  };

  return (
    <>
      <AppBar
        title="الملف التعريفي"
        breadcrumbs={[{ label: "بوابة الحملة", href: "/portal/dashboard" }, { label: "الملف التعريفي" }]}
        actions={
          editing ? (
            <Button variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
              حفظ
            </Button>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />} onClick={() => setEditing(true)}>
              تعديل
            </Button>
          )
        }
      />
      <Container size="md" className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Cover + Avatar */}
        <Card variant="elevated" padding="none">
          <div className="travel-cover-pattern relative h-32 sm:h-48 rounded-t-[var(--radius-card)] bg-gradient-to-l from-navy-700 via-navy-800 to-navy-900">
            {editing && (
              <button className="absolute top-4 end-4 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-body-sm text-white hover:bg-black/60 transition-colors">
                <Camera className="h-4 w-4" /> تغيير الغلاف
              </button>
            )}
          </div>
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="-mt-10 sm:-mt-12 flex items-end gap-3 sm:gap-4">
              <div className="relative">
                <Avatar size="xl" ring className="border-4 border-white dark:border-surface-dark-card h-20 w-20 sm:h-24 sm:w-24" />
                {editing && (
                  <button className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white hover:bg-navy-600">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <h2 className="text-heading-md sm:text-heading-lg font-bold text-navy-900 dark:text-white truncate">
                  {profile.nameAr || "اسم الحملة"}
                </h2>
                <p className="text-body-sm sm:text-body-md text-navy-500 truncate">{profile.name || "Campaign Name"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white">معلومات الحملة</h3>
          {editing ? (
            <div className="space-y-4">
              <Input label="اسم الحملة بالعربي" value={profile.nameAr} onChange={(e) => setProfile({...profile, nameAr: e.target.value})} />
              <Input label="اسم الحملة بالإنجليزي" value={profile.name} dir="ltr" onChange={(e) => setProfile({...profile, name: e.target.value})} />
              <Textarea label="الوصف" value={profile.descriptionAr} onChange={(e) => setProfile({...profile, descriptionAr: e.target.value})} />
              <Input label="رقم التواصل" value={profile.contactPhone} dir="ltr" onChange={(e) => setProfile({...profile, contactPhone: e.target.value})} />
              <Input label="البريد الإلكتروني" value={profile.contactEmail} dir="ltr" onChange={(e) => setProfile({...profile, contactEmail: e.target.value})} />
              <Input label="الموقع الإلكتروني" value={profile.website} dir="ltr" onChange={(e) => setProfile({...profile, website: e.target.value})} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-body-md sm:text-body-lg text-navy-700 dark:text-navy-200">
                {profile.descriptionAr || "لم يتم إضافة وصف بعد"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-navy-600 dark:text-navy-300">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Phone className="h-3.5 w-3.5 text-navy-500 shrink-0" /></span>
                  <span className="truncate">{profile.contactPhone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-navy-600 dark:text-navy-300">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Mail className="h-3.5 w-3.5 text-navy-500 shrink-0" /></span>
                  <span className="truncate">{profile.contactEmail || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm sm:text-body-md text-navy-600 dark:text-navy-300">
                  <span className="travel-icon-circle travel-icon-circle-sm"><Globe className="h-3.5 w-3.5 text-navy-500 shrink-0" /></span>
                  <span className="truncate">{profile.website || "—"}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* License */}
        <Card variant="outlined" padding="lg" className="border-gold-300/70 dark:border-gold-800/45">
          <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-2">رقم الترخيص</h3>
          <p className="text-body-md sm:text-body-lg font-mono text-navy-600 dark:text-navy-300">{profile.licenseNumber || "—"}</p>
        </Card>
      </Container>
    </>
  );
}
