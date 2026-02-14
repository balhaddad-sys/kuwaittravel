"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/feedback/ToastProvider";
import { Camera, Edit, Save, Globe, Phone, Mail } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    nameAr: "حملة النور",
    name: "Al Noor Campaign",
    descriptionAr: "حملة النور للزيارات الدينية - خدمة المسافرين منذ 2015",
    contactPhone: "+965 9900 1234",
    contactEmail: "info@alnoor.kw",
    website: "www.alnoor.kw",
    licenseNumber: "AWQ-2024-1234",
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
      <Container size="md" className="py-6 space-y-6">
        {/* Cover + Avatar */}
        <Card variant="elevated" padding="none">
          <div className="relative h-48 bg-gradient-to-l from-navy-700 to-navy-900 rounded-t-[var(--radius-card)]">
            {editing && (
              <button className="absolute top-4 end-4 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-body-sm text-white hover:bg-black/60 transition-colors">
                <Camera className="h-4 w-4" /> تغيير الغلاف
              </button>
            )}
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <div className="relative">
                <Avatar size="xl" className="border-4 border-white dark:border-surface-dark-card h-24 w-24" />
                {editing && (
                  <button className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white hover:bg-navy-600">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-lg font-bold text-navy-900 dark:text-white">{profile.nameAr}</h2>
                  <Badge variant="gold" size="sm">قيد التحقق</Badge>
                </div>
                <p className="text-body-md text-navy-500">{profile.name}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">معلومات الحملة</h3>
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
              <p className="text-body-lg text-navy-700 dark:text-navy-200">{profile.descriptionAr}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                  <Phone className="h-4 w-4 text-navy-400" /> {profile.contactPhone}
                </div>
                <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                  <Mail className="h-4 w-4 text-navy-400" /> {profile.contactEmail}
                </div>
                <div className="flex items-center gap-2 text-body-md text-navy-600 dark:text-navy-300">
                  <Globe className="h-4 w-4 text-navy-400" /> {profile.website}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* License */}
        <Card variant="outlined" padding="lg">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-2">رقم الترخيص</h3>
          <p className="text-body-lg font-mono text-navy-600 dark:text-navy-300">{profile.licenseNumber}</p>
        </Card>
      </Container>
    </>
  );
}
