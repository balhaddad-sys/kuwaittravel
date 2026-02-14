"use client";

import { useRouter } from "next/navigation";
import { Plane, Building2, Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-navy-700 via-navy-800 to-navy-900 p-6">
      <div className="text-center mb-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-500 shadow-fab">
          <Plane className="h-10 w-10 text-navy-900" />
        </div>
        <h1 className="text-display-lg font-bold text-white mb-3">
          سفر الكويت
        </h1>
        <p className="text-body-lg text-navy-200 max-w-md mx-auto">
          منصة حجز الرحلات الزيارية الأولى في الكويت — احجز رحلات الحج والعمرة والزيارات بكل سهولة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <button
          onClick={() => router.push("/app/discover")}
          className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center transition-all hover:bg-white/15 hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500">
            <Plane className="h-6 w-6 text-navy-900" />
          </div>
          <div>
            <p className="text-body-lg font-semibold text-white">المسافرون</p>
            <p className="text-body-sm text-navy-300 mt-1">تصفح واحجز رحلاتك</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/portal/dashboard")}
          className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center transition-all hover:bg-white/15 hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-body-lg font-semibold text-white">الحملات</p>
            <p className="text-body-sm text-navy-300 mt-1">بوابة إدارة الحملة</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center transition-all hover:bg-white/15 hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-body-lg font-semibold text-white">المشرفون</p>
            <p className="text-body-sm text-navy-300 mt-1">لوحة التحكم الرئيسية</p>
          </div>
        </button>
      </div>

      <div className="mt-12">
        <button
          onClick={() => router.push("/login")}
          className="rounded-[var(--radius-btn)] bg-gold-500 px-8 py-3 text-body-lg font-semibold text-navy-900 transition-all hover:bg-gold-400 active:scale-95"
        >
          تسجيل الدخول
        </button>
      </div>

      <p className="mt-8 text-body-sm text-navy-400">
        Kuwait Travel Platform v0.1.0
      </p>
    </div>
  );
}
