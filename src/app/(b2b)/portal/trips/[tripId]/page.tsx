"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusChip } from "@/components/ui/StatusChip";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/data-display/StatCard";
import { PassengerRow } from "@/components/data-display/PassengerRow";
import { SearchInput } from "@/components/forms/SearchInput";
import {
  Users, Calendar, MapPin, Wallet, FileText, Bell, QrCode,
  Download, Send, Filter, MoreVertical, Copy, Trash2, Edit,
} from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

const mockTrip = {
  id: "1",
  title: "رحلة كربلاء المقدسة - أربعين",
  destination: "كربلاء",
  departureDate: "2026-03-15",
  returnDate: "2026-03-20",
  status: "active" as const,
  capacity: 45,
  booked: 38,
  price: 285,
  revenue: 10830,
};

type MockPassenger = {
  id: string;
  name: string;
  phone: string;
  passportStatus: "uploaded" | "missing" | "expired";
  paymentStatus: "paid" | "unpaid" | "partial";
  visaStatus: "approved" | "pending" | "rejected" | "not_required";
};

const mockPassengers: MockPassenger[] = [
  { id: "1", name: "أحمد محمد العلي", phone: "+965 9900 1234", passportStatus: "uploaded", paymentStatus: "paid", visaStatus: "approved" },
  { id: "2", name: "فاطمة حسين الصالح", phone: "+965 9900 5678", passportStatus: "uploaded", paymentStatus: "paid", visaStatus: "pending" },
  { id: "3", name: "علي عبدالله الحسيني", phone: "+965 6600 9012", passportStatus: "missing", paymentStatus: "unpaid", visaStatus: "pending" },
  { id: "4", name: "زينب محمد الموسوي", phone: "+965 5500 3456", passportStatus: "uploaded", paymentStatus: "partial", visaStatus: "approved" },
  { id: "5", name: "حسن كاظم الشمري", phone: "+965 9700 7890", passportStatus: "expired", paymentStatus: "paid", visaStatus: "rejected" },
];

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"passengers" | "itinerary" | "documents" | "announcements">("passengers");
  const [searchQuery, setSearchQuery] = useState("");
  const [passengerFilter, setPassengerFilter] = useState("all");

  const filteredPassengers = mockPassengers.filter((p) => {
    const matchesSearch = p.name.includes(searchQuery);
    if (passengerFilter === "problems") {
      return matchesSearch && (p.passportStatus !== "uploaded" || p.paymentStatus !== "paid" || p.visaStatus === "rejected");
    }
    return matchesSearch;
  });

  const tabs = [
    { id: "passengers", label: "المسافرون", icon: <Users className="h-4 w-4" />, count: mockTrip.booked },
    { id: "itinerary", label: "البرنامج", icon: <Calendar className="h-4 w-4" /> },
    { id: "documents", label: "المستندات", icon: <FileText className="h-4 w-4" /> },
    { id: "announcements", label: "الإعلانات", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <>
      <AppBar
        title={mockTrip.title}
        breadcrumbs={[
          { label: "بوابة الحملة", href: "/portal/dashboard" },
          { label: "الرحلات", href: "/portal/trips" },
          { label: mockTrip.title },
        ]}
        actions={
          <div className="flex gap-2">
            <DropdownMenu
              trigger={
                <Button variant="outline" size="sm" leftIcon={<MoreVertical className="h-4 w-4" />}>
                  المزيد
                </Button>
              }
              items={[
                { label: "تعديل الرحلة", icon: <Edit className="h-4 w-4" />, onClick: () => {} },
                { label: "نسخ الرحلة", icon: <Copy className="h-4 w-4" />, onClick: () => {} },
                { label: "إلغاء الرحلة", icon: <Trash2 className="h-4 w-4" />, onClick: () => {}, danger: true },
              ]}
            />
          </div>
        }
      />

      <Container className="py-6 space-y-6">
        {/* Trip Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="المسافرون" value={`${mockTrip.booked}/${mockTrip.capacity}`} icon={<Users className="h-5 w-5" />} />
          <StatCard title="الإيرادات" value={`${mockTrip.revenue.toLocaleString()} د.ك`} icon={<Wallet className="h-5 w-5" />} />
          <StatCard title="الوجهة" value={mockTrip.destination} icon={<MapPin className="h-5 w-5" />} />
          <StatCard title="المغادرة" value={mockTrip.departureDate} icon={<Calendar className="h-5 w-5" />} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-surface-border dark:border-surface-dark-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-body-md font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-navy-700 text-navy-700 dark:text-white"
                  : "border-transparent text-navy-400 hover:text-navy-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant={activeTab === tab.id ? "gold" : "default"} size="sm">{tab.count}</Badge>
              )}
            </button>
          ))}
        </div>

        {/* Passengers Tab */}
        {activeTab === "passengers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput placeholder="ابحث بالاسم..." onSearch={setSearchQuery} className="flex-1" />
              <div className="flex gap-2">
                <Button
                  variant={passengerFilter === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPassengerFilter("all")}
                >
                  الكل
                </Button>
                <Button
                  variant={passengerFilter === "problems" ? "danger" : "outline"}
                  size="sm"
                  onClick={() => setPassengerFilter("problems")}
                >
                  يحتاج إجراء
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                  تصدير الكشف
                </Button>
                <Button variant="outline" size="sm" leftIcon={<QrCode className="h-4 w-4" />}>
                  تسجيل حضور
                </Button>
              </div>
            </div>

            <Card variant="outlined" padding="sm">
              <div className="divide-y divide-surface-border dark:divide-surface-dark-border">
                {filteredPassengers.map((passenger) => (
                  <PassengerRow key={passenger.id} {...passenger} onAction={() => {}} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <Card variant="outlined" padding="lg">
            <div className="space-y-6">
              {[
                { day: 1, date: "15 مارس", items: [
                  { time: "06:00", title: "التجمع في المطار", type: "transport" },
                  { time: "08:00", title: "إقلاع الطائرة - الخطوط الكويتية", type: "flight" },
                  { time: "10:00", title: "الوصول إلى النجف", type: "flight" },
                  { time: "12:00", title: "تسجيل الدخول في الفندق", type: "hotel" },
                  { time: "16:00", title: "زيارة مرقد الإمام علي (ع)", type: "religious" },
                ]},
                { day: 2, date: "16 مارس", items: [
                  { time: "07:00", title: "إفطار في الفندق", type: "meal" },
                  { time: "09:00", title: "الانتقال إلى كربلاء", type: "transport" },
                  { time: "11:00", title: "زيارة مرقد الإمام الحسين (ع)", type: "religious" },
                  { time: "14:00", title: "غداء", type: "meal" },
                  { time: "16:00", title: "زيارة مرقد العباس (ع)", type: "religious" },
                ]},
              ].map((day) => (
                <div key={day.day}>
                  <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3">
                    اليوم {day.day} — {day.date}
                  </h3>
                  <div className="space-y-2 ps-4 border-s-2 border-navy-200 dark:border-navy-700">
                    {day.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <span className="text-body-sm font-mono text-navy-400 w-12 shrink-0" dir="ltr">{item.time}</span>
                        <div className="h-2.5 w-2.5 rounded-full bg-navy-400 -ms-[21px] shrink-0" />
                        <span className="text-body-md text-navy-700 dark:text-navy-200">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "كشف الركاب (PDF)", icon: FileText, desc: "كشف رسمي لنقطة الحدود" },
              { label: "كشف الركاب (Excel)", icon: FileText, desc: "جدول بيانات قابل للتعديل" },
              { label: "نسخ الجوازات (ZIP)", icon: Download, desc: "جميع صور الجوازات مسماة" },
              { label: "قائمة الغرف", icon: FileText, desc: "توزيع المسافرين على الغرف" },
            ].map((doc, i) => (
              <Card key={i} variant="outlined" padding="md" hoverable onClick={() => {}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-navy-100 dark:bg-navy-800">
                    <doc.icon className="h-5 w-5 text-navy-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">{doc.label}</p>
                    <p className="text-body-sm text-navy-500">{doc.desc}</p>
                  </div>
                  <Download className="h-5 w-5 text-navy-400" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            <Card variant="outlined" padding="lg">
              <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4">
                إرسال إعلان جديد
              </h3>
              <div className="space-y-3">
                <Input placeholder="عنوان الإعلان..." />
                <textarea
                  placeholder="نص الرسالة..."
                  className="w-full rounded-[var(--radius-input)] border border-surface-border bg-white px-4 py-2.5 text-body-md min-h-[100px] resize-y focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none dark:border-surface-dark-border dark:bg-surface-dark-card"
                />
                <div className="flex items-center justify-between">
                  <select className="rounded-[var(--radius-input)] border border-surface-border bg-white px-3 py-2 text-body-sm dark:border-surface-dark-border dark:bg-surface-dark-card">
                    <option value="all">جميع المسافرين</option>
                    <option value="bus_a">الحافلة أ</option>
                    <option value="bus_b">الحافلة ب</option>
                    <option value="unpaid">غير المدفوع</option>
                  </select>
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
