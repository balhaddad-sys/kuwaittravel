"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TripCard } from "@/components/shared/TripCard";
import { CampaignCard } from "@/components/shared/CampaignCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { Star, ArrowLeft, Flame } from "lucide-react";

const featuredTrips = [
  { id: "1", title: "رحلة كربلاء المقدسة - أربعين", destination: "كربلاء", departureDate: "2026-03-15", returnDate: "2026-03-20", price: 285, capacity: 45, booked: 38, status: "active" as const, campaignName: "حملة النور" },
  { id: "2", title: "رحلة مشهد المقدسة", destination: "مشهد", departureDate: "2026-04-01", returnDate: "2026-04-05", price: 450, capacity: 30, booked: 12, status: "active" as const, campaignName: "حملة الهدى" },
  { id: "3", title: "عمرة رجب", destination: "مكة", departureDate: "2026-05-10", returnDate: "2026-05-17", price: 650, capacity: 50, booked: 35, status: "active" as const, campaignName: "حملة السلام" },
];

const topCampaigns = [
  { id: "1", name: "حملة النور", description: "خدمة المسافرين منذ 2015 - رحلات زيارية متميزة", rating: 4.8, totalTrips: 45, verified: true },
  { id: "2", name: "حملة الهدى", description: "رحلات مشهد وكربلاء بأسعار مناسبة", rating: 4.6, totalTrips: 32, verified: true },
];

const destinations = [
  { id: "karbala", nameAr: "كربلاء", emoji: "🕌", count: 12 },
  { id: "najaf", nameAr: "النجف", emoji: "🕌", count: 8 },
  { id: "mashhad", nameAr: "مشهد", emoji: "🕌", count: 6 },
  { id: "mecca", nameAr: "مكة", emoji: "🕋", count: 15 },
  { id: "medina", nameAr: "المدينة", emoji: "🕌", count: 10 },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [, setSearchQuery] = useState("");

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-bl from-navy-700 via-navy-800 to-navy-900 px-4 pt-12 pb-8">
        <Container>
          <h1 className="text-display-md font-bold text-white mb-2">
            سفر الكويت
          </h1>
          <p className="text-body-lg text-navy-200 mb-6">
            اكتشف واحجز رحلاتك الزيارية بكل سهولة
          </p>
          <SearchInput
            placeholder="ابحث عن رحلة أو حملة..."
            onSearch={setSearchQuery}
            className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50"
          />
        </Container>
      </div>

      <Container className="py-6 space-y-8">
        {/* Destinations */}
        <section>
          <h2 className="text-heading-md font-bold text-navy-900 dark:text-white mb-4">
            الوجهات
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-xl)] bg-white dark:bg-surface-dark-card shadow-card px-5 py-4 min-w-[100px] hover:shadow-card-hover transition-all"
              >
                <span className="text-2xl">{dest.emoji}</span>
                <span className="text-body-sm font-medium text-navy-700 dark:text-navy-200 whitespace-nowrap">{dest.nameAr}</span>
                <span className="text-[11px] text-navy-400">{dest.count} رحلة</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Trips */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                رحلات مميزة
              </h2>
            </div>
            <button className="text-body-sm font-medium text-navy-500 hover:text-navy-700 flex items-center gap-1">
              عرض الكل <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                onClick={() => router.push(`/app/campaigns/1/trips/${trip.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Top Campaigns */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-500" />
              <h2 className="text-heading-md font-bold text-navy-900 dark:text-white">
                حملات موثوقة
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                {...campaign}
                onClick={() => router.push(`/app/campaigns/${campaign.id}`)}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
