"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FAB } from "@/components/ui/FAB";
import { TripCard } from "@/components/shared/TripCard";
import {
  Users,
  Map,
  Wallet,
  AlertTriangle,
  Plus,
  ArrowLeft,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockStats = {
  activeTrips: 3,
  totalPassengers: 127,
  revenue: 38250,
  pendingActions: 8,
};

const mockAlerts = [
  { id: "1", type: "error" as const, message: "5 مسافرين لم يرفعوا جوازاتهم - رحلة كربلاء", trip: "رحلة كربلاء المقدسة" },
  { id: "2", type: "warning" as const, message: "3 مدفوعات معلقة تستحق خلال يومين", trip: "رحلة مشهد" },
  { id: "3", type: "info" as const, message: "رحلة النجف الأشرف اكتملت بنجاح", trip: "رحلة النجف" },
];

const mockTrips = [
  { id: "1", title: "رحلة كربلاء المقدسة - أربعين", destination: "كربلاء", departureDate: "2026-03-15", returnDate: "2026-03-20", price: 285, capacity: 45, booked: 38, status: "active" as const },
  { id: "2", title: "رحلة مشهد المقدسة", destination: "مشهد", departureDate: "2026-04-01", returnDate: "2026-04-05", price: 450, capacity: 30, booked: 12, status: "active" as const },
  { id: "3", title: "عمرة رجب", destination: "مكة", departureDate: "2026-05-10", returnDate: "2026-05-17", price: 650, capacity: 50, booked: 50, status: "completed" as const },
];

export default function DashboardPage() {
  const router = useRouter();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <>
      <AppBar
        title="لوحة التحكم"
        breadcrumbs={[{ label: "بوابة الحملة" }, { label: "لوحة التحكم" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/portal/trips/create")}>
            رحلة جديدة
          </Button>
        }
      />

      <Container className="py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="الرحلات النشطة"
            value={mockStats.activeTrips}
            icon={<Map className="h-6 w-6" />}
            change={{ value: 12, label: "عن الشهر الماضي" }}
          />
          <StatCard
            title="إجمالي المسافرين"
            value={mockStats.totalPassengers}
            icon={<Users className="h-6 w-6" />}
            change={{ value: 8, label: "عن الشهر الماضي" }}
          />
          <StatCard
            title="الإيرادات (د.ك)"
            value={mockStats.revenue.toLocaleString("ar-KW")}
            icon={<Wallet className="h-6 w-6" />}
            change={{ value: 23, label: "عن الشهر الماضي" }}
          />
          <StatCard
            title="إجراءات معلقة"
            value={mockStats.pendingActions}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
        </div>

        {/* Alerts */}
        {mockAlerts.length > 0 && (
          <Card variant="outlined" padding="md">
            <h2 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              تنبيهات تتطلب انتباهك
            </h2>
            <div className="space-y-2">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors cursor-pointer"
                >
                  <Badge
                    variant={alert.type}
                    size="sm"
                  >
                    {alert.type === "error" ? "عاجل" : alert.type === "warning" ? "تنبيه" : "معلومة"}
                  </Badge>
                  <span className="text-body-md text-navy-700 dark:text-navy-200 flex-1">
                    {alert.message}
                  </span>
                  <ArrowLeft className="h-4 w-4 text-navy-400 rtl:rotate-180" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Active Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
              الرحلات النشطة
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/portal/trips")}>
              عرض الكل
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTrips.map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.title}
                destination={trip.destination}
                departureDate={trip.departureDate}
                returnDate={trip.returnDate}
                price={trip.price}
                capacity={trip.capacity}
                booked={trip.booked}
                status={trip.status}
                onClick={() => router.push(`/portal/trips/${trip.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="outlined" padding="lg">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-navy-500" />
              آخر الحجوزات
            </h3>
            <div className="space-y-3">
              {[
                { name: "أحمد محمد", trip: "كربلاء المقدسة", amount: "285 د.ك", status: "confirmed" },
                { name: "فاطمة علي", trip: "مشهد المقدسة", amount: "450 د.ك", status: "pending" },
                { name: "حسين الصالح", trip: "كربلاء المقدسة", amount: "285 د.ك", status: "confirmed" },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-dark-border last:border-0">
                  <div>
                    <p className="text-body-md font-medium text-navy-900 dark:text-white">{booking.name}</p>
                    <p className="text-body-sm text-navy-500">{booking.trip}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-body-md font-semibold text-navy-900 dark:text-white">{booking.amount}</p>
                    <Badge variant={booking.status === "confirmed" ? "success" : "warning"} size="sm">
                      {booking.status === "confirmed" ? "مؤكد" : "معلق"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="outlined" padding="lg">
            <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-navy-500" />
              ملخص الأداء
            </h3>
            <div className="space-y-4">
              {[
                { label: "معدل الحجز", value: "78%", color: "bg-success" },
                { label: "رضا المسافرين", value: "92%", color: "bg-info" },
                { label: "اكتمال المستندات", value: "65%", color: "bg-warning" },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between text-body-sm mb-1">
                    <span className="text-navy-600 dark:text-navy-300">{metric.label}</span>
                    <span className="font-semibold text-navy-900 dark:text-white">{metric.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-muted dark:bg-surface-dark-border overflow-hidden">
                    <div className={`h-full rounded-full ${metric.color}`} style={{ width: metric.value }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>

      {/* FAB */}
      <FAB
        icon={<Plus className="h-6 w-6" />}
        onClick={() => router.push("/portal/trips/create")}
      />
    </>
  );
}
