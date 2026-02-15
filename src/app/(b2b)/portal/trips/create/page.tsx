"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { DatePicker } from "@/components/forms/DatePicker";
import { FileUpload } from "@/components/forms/FileUpload";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/feedback/ToastProvider";
import { DESTINATIONS, TRIP_TYPES, ROOM_TYPES } from "@/lib/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { createDocument, getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Campaign, TripType } from "@/types";

export default function CreateTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  // Form state
  const [basics, setBasics] = useState({
    titleAr: "",
    title: "",
    type: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    registrationDeadline: "",
  });

  const [pricing, setPricing] = useState({
    basePriceKWD: "",
    totalCapacity: "",
    doubleRooms: "",
    tripleRooms: "",
    quadRooms: "",
    depositRequired: false,
    depositAmount: "",
  });

  const [description, setDescription] = useState({
    descriptionAr: "",
    description: "",
    includes: "",
    excludes: "",
  });

  const toDate = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const handleComplete = async () => {
    if (!firebaseUser || !userData) {
      toast({
        type: "error",
        title: "يرجى تسجيل الدخول أولاً",
      });
      router.push("/login");
      return;
    }

    if (!userData.campaignId) {
      toast({
        type: "error",
        title: "لا يمكن إنشاء الرحلة",
        description: "حسابك غير مرتبط بحملة حالياً.",
      });
      return;
    }

    const departureDate = toDate(basics.departureDate);
    const returnDate = toDate(basics.returnDate || basics.departureDate);
    const registrationDeadline = toDate(
      basics.registrationDeadline || basics.departureDate
    );
    const basePriceKWD = Number(pricing.basePriceKWD);
    const totalCapacity = Number(pricing.totalCapacity);

    if (
      !departureDate ||
      !returnDate ||
      !registrationDeadline ||
      !Number.isFinite(basePriceKWD) ||
      basePriceKWD <= 0 ||
      !Number.isFinite(totalCapacity) ||
      totalCapacity <= 0
    ) {
      toast({
        type: "error",
        title: "تحقق من بيانات الرحلة",
        description: "الرجاء إدخال تواريخ صحيحة وسعر/سعة أكبر من صفر.",
      });
      return;
    }

    if (returnDate < departureDate) {
      toast({
        type: "error",
        title: "تاريخ العودة غير صحيح",
        description: "تاريخ العودة يجب أن يكون بعد تاريخ المغادرة.",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedDestination = DESTINATIONS.find(
        (destination) => destination.id === basics.destination
      );

      const campaign = await getDocument<Campaign>(
        COLLECTIONS.CAMPAIGNS,
        userData.campaignId
      );

      const tripType = TRIP_TYPES.some((type) => type.id === basics.type)
        ? (basics.type as TripType)
        : "ziyarat";

      const tripId = await createDocument(COLLECTIONS.TRIPS, {
        campaignId: userData.campaignId,
        campaignName:
          campaign?.nameAr ||
          campaign?.name ||
          userData.displayNameAr ||
          userData.displayName,
        title: basics.title || basics.titleAr,
        titleAr: basics.titleAr,
        description: description.description || description.descriptionAr,
        descriptionAr: description.descriptionAr,
        type: tripType,
        coverImageUrl: "",
        galleryUrls: [],
        departureDate: Timestamp.fromDate(departureDate),
        returnDate: Timestamp.fromDate(returnDate),
        registrationDeadline: Timestamp.fromDate(registrationDeadline),
        departureCity: "الكويت",
        destinations: [
          {
            city: selectedDestination?.nameAr || "غير محدد",
            country: selectedDestination?.country || "غير محدد",
            arrivalDate: Timestamp.fromDate(departureDate),
            departureDate: Timestamp.fromDate(returnDate),
          },
        ],
        totalCapacity,
        bookedCount: 0,
        remainingCapacity: totalCapacity,
        basePriceKWD,
        currency: "KWD" as const,
        status: "registration_open" as const,
        isTemplate: false,
        tags: [
          basics.destination,
          tripType,
          selectedDestination?.nameEn || "",
        ].filter((tag) => Boolean(tag)),
        featured: false,
        adminApproved: false,
        roomInventory: {
          double: Number(pricing.doubleRooms) || 0,
          triple: Number(pricing.tripleRooms) || 0,
          quad: Number(pricing.quadRooms) || 0,
        },
        includes: description.includes
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        excludes: description.excludes
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        draftAssets: images.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      });

      toast({
        type: "success",
        title: "تم إنشاء الرحلة بنجاح",
        description: `رقم الرحلة: ${tripId}`,
      });
      router.push("/portal/trips");
    } catch {
      toast({ type: "error", title: "حدث خطأ أثناء إنشاء الرحلة" });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "المعلومات الأساسية",
      content: (
        <div className="space-y-4">
          <Input
            label="عنوان الرحلة بالعربي"
            placeholder="رحلة كربلاء المقدسة - أربعين"
            value={basics.titleAr}
            onChange={(e) => setBasics({ ...basics, titleAr: e.target.value })}
          />
          <Input
            label="عنوان الرحلة بالإنجليزي"
            placeholder="Karbala Holy Trip - Arbaeen"
            dir="ltr"
            value={basics.title}
            onChange={(e) => setBasics({ ...basics, title: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="نوع الرحلة"
              options={TRIP_TYPES.map((t) => ({ value: t.id, label: t.nameAr }))}
              placeholder="اختر نوع الرحلة"
              value={basics.type}
              onChange={(e) => setBasics({ ...basics, type: e.target.value })}
            />
            <Select
              label="الوجهة"
              options={DESTINATIONS.map((d) => ({ value: d.id, label: `${d.nameAr} - ${d.country}` }))}
              placeholder="اختر الوجهة"
              value={basics.destination}
              onChange={(e) => setBasics({ ...basics, destination: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker
              label="تاريخ المغادرة"
              value={basics.departureDate}
              onChange={(e) => setBasics({ ...basics, departureDate: e.target.value })}
            />
            <DatePicker
              label="تاريخ العودة"
              value={basics.returnDate}
              onChange={(e) => setBasics({ ...basics, returnDate: e.target.value })}
            />
            <DatePicker
              label="آخر موعد للتسجيل"
              value={basics.registrationDeadline}
              onChange={(e) => setBasics({ ...basics, registrationDeadline: e.target.value })}
            />
          </div>
        </div>
      ),
      isValid: Boolean(
        basics.titleAr &&
          basics.type &&
          basics.destination &&
          basics.departureDate &&
          basics.returnDate &&
          basics.registrationDeadline
      ),
    },
    {
      label: "السعة والتسعير",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="السعر الأساسي (د.ك)"
              placeholder="285.000"
              type="number"
              dir="ltr"
              value={pricing.basePriceKWD}
              onChange={(e) => setPricing({ ...pricing, basePriceKWD: e.target.value })}
            />
            <Input
              label="السعة الإجمالية"
              placeholder="45"
              type="number"
              dir="ltr"
              value={pricing.totalCapacity}
              onChange={(e) => setPricing({ ...pricing, totalCapacity: e.target.value })}
            />
          </div>

          <h3 className="text-heading-sm font-semibold text-navy-900 dark:text-white mt-6">
            الغرف المتاحة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROOM_TYPES.filter((r) => r.id !== "single").map((room) => (
              <Card key={room.id} variant="outlined" padding="md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-md font-medium text-navy-700 dark:text-navy-200">{room.nameAr}</span>
                  <Badge variant="default" size="sm">{room.capacity} أشخاص</Badge>
                </div>
                <Input
                  placeholder="عدد الغرف"
                  type="number"
                  dir="ltr"
                  value={
                    room.id === "double" ? pricing.doubleRooms :
                    room.id === "triple" ? pricing.tripleRooms :
                    pricing.quadRooms
                  }
                  onChange={(e) => setPricing({
                    ...pricing,
                    [room.id === "double" ? "doubleRooms" : room.id === "triple" ? "tripleRooms" : "quadRooms"]: e.target.value,
                  })}
                />
              </Card>
            ))}
          </div>
        </div>
      ),
      isValid: Boolean(pricing.basePriceKWD && pricing.totalCapacity),
    },
    {
      label: "الوصف والتفاصيل",
      content: (
        <div className="space-y-4">
          <Textarea
            label="وصف الرحلة بالعربي"
            placeholder="تفاصيل الرحلة والبرنامج والخدمات المقدمة..."
            value={description.descriptionAr}
            onChange={(e) => setDescription({ ...description, descriptionAr: e.target.value })}
          />
          <Textarea
            label="يشمل"
            placeholder="تذكرة طيران، إقامة فندقية، وجبات..."
            value={description.includes}
            onChange={(e) => setDescription({ ...description, includes: e.target.value })}
            hint="كل بند في سطر منفصل"
          />
          <Textarea
            label="لا يشمل"
            placeholder="المصاريف الشخصية، التأشيرة..."
            value={description.excludes}
            onChange={(e) => setDescription({ ...description, excludes: e.target.value })}
            hint="كل بند في سطر منفصل"
          />
          <FileUpload
            label="صور الرحلة"
            accept="image/*"
            multiple
            maxSize={5}
            onFilesChange={setImages}
            hint="أضف صور جذابة للرحلة (الحد الأقصى 5 ميغابايت لكل صورة)"
          />
        </div>
      ),
    },
    {
      label: "المراجعة والنشر",
      content: (
        <div className="space-y-4">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">
            مراجعة بيانات الرحلة
          </h3>
          <Card variant="filled" padding="md" className="space-y-3">
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">العنوان</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">{basics.titleAr || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">النوع</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">
                {TRIP_TYPES.find((t) => t.id === basics.type)?.nameAr || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">الوجهة</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">
                {DESTINATIONS.find((d) => d.id === basics.destination)?.nameAr || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">السعر</span>
              <span className="text-body-md font-bold text-navy-900 dark:text-white">{pricing.basePriceKWD ? `${pricing.basePriceKWD} د.ك` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">السعة</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">{pricing.totalCapacity || "—"} مسافر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">تاريخ المغادرة</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">{basics.departureDate || "—"}</span>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <>
      <AppBar
        title="إنشاء رحلة جديدة"
        breadcrumbs={[
          { label: "بوابة الحملة", href: "/portal/dashboard" },
          { label: "الرحلات", href: "/portal/trips" },
          { label: "إنشاء رحلة" },
        ]}
      />

      <Container size="md" className="py-6">
        <Card variant="elevated" padding="lg">
          <MultiStepForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="نشر الرحلة"
            loading={loading}
          />
        </Card>
      </Container>
    </>
  );
}
