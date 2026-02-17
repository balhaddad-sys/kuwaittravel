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
import { useDirection } from "@/providers/DirectionProvider";
import { createDocument, getDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Campaign, TripType } from "@/types";

export default function CreateTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser, userData } = useAuth();
  const { t } = useDirection();
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
    console.log("[CreateTrip] Starting submission...", {
      hasUser: !!firebaseUser,
      hasUserData: !!userData,
      campaignId: userData?.campaignId,
      role: userData?.role,
      basics,
      pricing,
    });

    if (!firebaseUser || !userData) {
      toast({
        type: "error",
        title: t("يرجى تسجيل الدخول أولاً", "Please log in first"),
      });
      router.push("/login");
      return;
    }

    if (!userData.campaignId) {
      toast({
        type: "error",
        title: t("لا يمكن إنشاء الرحلة", "Cannot create trip"),
        description: t("حسابك غير مرتبط بحملة حالياً.", "Your account is not linked to a campaign currently."),
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
        title: t("تحقق من بيانات الرحلة", "Verify trip details"),
        description: t("الرجاء إدخال تواريخ صحيحة وسعر/سعة أكبر من صفر.", "Please enter valid dates and a price/capacity greater than zero."),
      });
      return;
    }

    if (returnDate < departureDate) {
      toast({
        type: "error",
        title: t("تاريخ العودة غير صحيح", "Invalid return date"),
        description: t("تاريخ العودة يجب أن يكون بعد تاريخ المغادرة.", "Return date must be after the departure date."),
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
        title: t("تم إنشاء الرحلة بنجاح", "Trip created successfully"),
        description: `${t("رقم الرحلة", "Trip ID")}: ${tripId}`,
      });
      router.push("/portal/trips");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Trip creation error:", error);
      toast({
        type: "error",
        title: t("حدث خطأ أثناء إنشاء الرحلة", "An error occurred while creating the trip"),
        description: message.includes("permission")
          ? t("ليس لديك صلاحية لإنشاء رحلات. تحقق من ارتباط حسابك بالحملة.", "You do not have permission to create trips. Check your account's campaign association.")
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: t("المعلومات الأساسية", "Basic Information"),
      content: (
        <div className="space-y-4">
          <Input
            label={t("عنوان الرحلة بالعربي", "Trip title in Arabic")}
            placeholder={t("رحلة كربلاء المقدسة - أربعين", "Karbala Holy Trip - Arbaeen")}
            value={basics.titleAr}
            onChange={(e) => setBasics({ ...basics, titleAr: e.target.value })}
          />
          <Input
            label={t("عنوان الرحلة بالإنجليزي", "Trip title in English")}
            placeholder="Karbala Holy Trip - Arbaeen"
            dir="ltr"
            value={basics.title}
            onChange={(e) => setBasics({ ...basics, title: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t("نوع الرحلة", "Trip type")}
              options={TRIP_TYPES.map((tt) => ({ value: tt.id, label: tt.nameAr }))}
              placeholder={t("اختر نوع الرحلة", "Select trip type")}
              value={basics.type}
              onChange={(e) => setBasics({ ...basics, type: e.target.value })}
            />
            <Select
              label={t("الوجهة", "Destination")}
              options={DESTINATIONS.map((d) => ({ value: d.id, label: `${d.nameAr} - ${d.country}` }))}
              placeholder={t("اختر الوجهة", "Select destination")}
              value={basics.destination}
              onChange={(e) => setBasics({ ...basics, destination: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker
              label={t("تاريخ المغادرة", "Departure date")}
              value={basics.departureDate}
              onChange={(e) => setBasics({ ...basics, departureDate: e.target.value })}
            />
            <DatePicker
              label={t("تاريخ العودة", "Return date")}
              value={basics.returnDate}
              onChange={(e) => setBasics({ ...basics, returnDate: e.target.value })}
            />
            <DatePicker
              label={t("آخر موعد للتسجيل", "Registration deadline")}
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
      label: t("السعة والتسعير", "Capacity & Pricing"),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("السعر الأساسي (د.ك)", "Base Price (KWD)")}
              placeholder="285.000"
              type="number"
              dir="ltr"
              value={pricing.basePriceKWD}
              onChange={(e) => setPricing({ ...pricing, basePriceKWD: e.target.value })}
            />
            <Input
              label={t("السعة الإجمالية", "Total Capacity")}
              placeholder="45"
              type="number"
              dir="ltr"
              value={pricing.totalCapacity}
              onChange={(e) => setPricing({ ...pricing, totalCapacity: e.target.value })}
            />
          </div>

          <h3 className="text-heading-sm font-semibold text-navy-900 dark:text-white mt-6">
            {t("الغرف المتاحة", "Available Rooms")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROOM_TYPES.filter((r) => r.id !== "single").map((room) => (
              <Card key={room.id} variant="outlined" padding="md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-md font-medium text-navy-700 dark:text-navy-200">{room.nameAr}</span>
                  <Badge variant="default" size="sm">{room.capacity} {t("أشخاص", "persons")}</Badge>
                </div>
                <Input
                  placeholder={t("عدد الغرف", "Number of rooms")}
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
      label: t("الوصف والتفاصيل", "Description & Details"),
      content: (
        <div className="space-y-4">
          <Textarea
            label={t("وصف الرحلة بالعربي", "Trip description (Arabic)")}
            placeholder={t("تفاصيل الرحلة والبرنامج والخدمات المقدمة...", "Trip details, itinerary, and services provided...")}
            value={description.descriptionAr}
            onChange={(e) => setDescription({ ...description, descriptionAr: e.target.value })}
          />
          <Textarea
            label={t("يشمل", "Includes")}
            placeholder={t("تذكرة طيران، إقامة فندقية، وجبات...", "Airfare, hotel accommodation, meals...")}
            value={description.includes}
            onChange={(e) => setDescription({ ...description, includes: e.target.value })}
            hint={t("كل بند في سطر منفصل", "Each item on a separate line")}
          />
          <Textarea
            label={t("لا يشمل", "Excludes")}
            placeholder={t("المصاريف الشخصية، التأشيرة...", "Personal expenses, visa...")}
            value={description.excludes}
            onChange={(e) => setDescription({ ...description, excludes: e.target.value })}
            hint={t("كل بند في سطر منفصل", "Each item on a separate line")}
          />
          <FileUpload
            label={t("صور الرحلة", "Trip Photos")}
            accept="image/*"
            multiple
            maxSize={5}
            onFilesChange={setImages}
            hint={t("أضف صور جذابة للرحلة (الحد الأقصى 5 ميغابايت لكل صورة)", "Add attractive trip photos (max 5MB per image)")}
          />
        </div>
      ),
    },
    {
      label: t("المراجعة والنشر", "Review & Publish"),
      content: (
        <div className="space-y-4">
          <h3 className="text-heading-sm font-bold text-navy-900 dark:text-white">
            {t("مراجعة بيانات الرحلة", "Review Trip Details")}
          </h3>
          <Card variant="filled" padding="md" className="space-y-3">
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("العنوان", "Title")}</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">{basics.titleAr || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("النوع", "Type")}</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">
                {TRIP_TYPES.find((tp) => tp.id === basics.type)?.nameAr || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("الوجهة", "Destination")}</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">
                {DESTINATIONS.find((d) => d.id === basics.destination)?.nameAr || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("السعر", "Price")}</span>
              <span className="text-body-md font-bold text-navy-900 dark:text-white">{pricing.basePriceKWD ? `${pricing.basePriceKWD} ${t("د.ك", "KWD")}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("السعة", "Capacity")}</span>
              <span className="text-body-md font-medium text-navy-900 dark:text-white">{pricing.totalCapacity || "—"} {t("مسافر", "travelers")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-md text-navy-500">{t("تاريخ المغادرة", "Departure Date")}</span>
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
        title={t("إنشاء رحلة جديدة", "Create New Trip")}
        breadcrumbs={[
          { label: t("بوابة الحملة", "Campaign Portal"), href: "/portal/dashboard" },
          { label: t("الرحلات", "Trips"), href: "/portal/trips" },
          { label: t("إنشاء رحلة", "Create Trip") },
        ]}
      />

      <Container size="md" className="travel-orbit-bg py-6">
        <Card variant="elevated" padding="lg">
          <MultiStepForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel={t("نشر الرحلة", "Publish Trip")}
            loading={loading}
          />
        </Card>
      </Container>
    </>
  );
}
