"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/data-display/StatCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Users, Calendar, MapPin, Wallet, FileText, Bell,
  Download, Send,
} from "lucide-react";

export default function TripDetailPage() {
  const [activeTab, setActiveTab] = useState<"passengers" | "itinerary" | "documents" | "announcements">("passengers");

  const tabs = [
    { id: "passengers", label: "المسافرون", icon: <Users className="h-4 w-4" /> },
    { id: "itinerary", label: "البرنامج", icon: <Calendar className="h-4 w-4" /> },
    { id: "documents", label: "المستندات", icon: <FileText className="h-4 w-4" /> },
    { id: "announcements", label: "الإعلانات", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <>
      <AppBar
        title="تفاصيل الرحلة"
        breadcrumbs={[
          { label: "بوابة الحملة", href: "/portal/dashboard" },
          { label: "الرحلات", href: "/portal/trips" },
          { label: "تفاصيل الرحلة" },
        ]}
      />

      <Container className="travel-orbit-bg py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="المسافرون" value="0/0" icon={<Users className="h-5 w-5" />} />
          <StatCard title="الإيرادات" value="0 د.ك" icon={<Wallet className="h-5 w-5" />} />
          <StatCard title="الوجهة" value="—" icon={<MapPin className="h-5 w-5" />} />
          <StatCard title="المغادرة" value="—" icon={<Calendar className="h-5 w-5" />} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-surface-border dark:border-surface-dark-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex shrink-0 items-center gap-2 px-3 sm:px-4 py-3 text-body-sm sm:text-body-md font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-navy-700 text-navy-700 dark:text-white"
                  : "border-transparent text-navy-400 hover:text-navy-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "passengers" && (
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput placeholder="ابحث بالاسم..." onSearch={() => {}} className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                  تصدير الكشف
                </Button>
              </div>
            </div>
            <EmptyState
              icon={<Users className="h-16 w-16" />}
              title="لا يوجد مسافرون"
              description="سيظهر هنا المسافرون المسجلون في هذه الرحلة"
            />
          </Card>
        )}

        {activeTab === "itinerary" && (
          <Card variant="elevated" padding="lg">
            <EmptyState
              icon={<Calendar className="h-16 w-16" />}
              title="لم يتم إضافة برنامج"
              description="أضف برنامج الرحلة اليومي لمشاركته مع المسافرين"
            />
          </Card>
        )}

        {activeTab === "documents" && (
          <Card variant="elevated" padding="lg">
            <EmptyState
              icon={<FileText className="h-16 w-16" />}
              title="لا توجد مستندات"
              description="ستتوفر المستندات والكشوفات عند تسجيل المسافرين"
            />
          </Card>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-4">
            <Card variant="elevated" padding="lg">
              <h3 className="text-body-lg sm:text-heading-sm font-bold text-navy-900 dark:text-white mb-4">
                إرسال إعلان جديد
              </h3>
              <div className="space-y-3">
                <Input placeholder="عنوان الإعلان..." />
                <Textarea placeholder="نص الرسالة..." />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" leftIcon={<Send className="h-4 w-4" />}>
                    إرسال
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}
