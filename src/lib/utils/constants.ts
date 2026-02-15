export const APP_NAME = "Rahal";
export const APP_NAME_AR = "رحال";
export const DEFAULT_LOCALE = "ar";

export const DESTINATIONS = [
  { id: "najaf", nameAr: "النجف", nameEn: "Najaf", country: "Iraq" },
  { id: "karbala", nameAr: "كربلاء", nameEn: "Karbala", country: "Iraq" },
  { id: "mashhad", nameAr: "مشهد", nameEn: "Mashhad", country: "Iran" },
  { id: "mecca", nameAr: "مكة", nameEn: "Mecca", country: "Saudi Arabia" },
  { id: "medina", nameAr: "المدينة", nameEn: "Medina", country: "Saudi Arabia" },
  { id: "damascus", nameAr: "دمشق", nameEn: "Damascus", country: "Syria" },
  { id: "kufa", nameAr: "الكوفة", nameEn: "Kufa", country: "Iraq" },
  { id: "samarra", nameAr: "سامراء", nameEn: "Samarra", country: "Iraq" },
  { id: "kadhimiya", nameAr: "الكاظمية", nameEn: "Kadhimiya", country: "Iraq" },
] as const;

export const TRIP_TYPES = [
  { id: "hajj", nameAr: "حج", nameEn: "Hajj" },
  { id: "umrah", nameAr: "عمرة", nameEn: "Umrah" },
  { id: "ziyarat", nameAr: "زيارة", nameEn: "Ziyarat" },
  { id: "combined", nameAr: "مجمعة", nameEn: "Combined" },
] as const;

export const ROOM_TYPES = [
  { id: "single", nameAr: "غرفة فردية", nameEn: "Single", capacity: 1 },
  { id: "double", nameAr: "غرفة مزدوجة", nameEn: "Double", capacity: 2 },
  { id: "triple", nameAr: "غرفة ثلاثية", nameEn: "Triple", capacity: 3 },
  { id: "quad", nameAr: "غرفة رباعية", nameEn: "Quad", capacity: 4 },
] as const;

export const PAYMENT_METHODS = [
  { id: "knet", nameAr: "كي نت", nameEn: "KNET" },
  { id: "visa", nameAr: "فيزا", nameEn: "Visa" },
  { id: "mastercard", nameAr: "ماستركارد", nameEn: "Mastercard" },
  { id: "cash", nameAr: "نقدي", nameEn: "Cash" },
  { id: "bank_transfer", nameAr: "تحويل بنكي", nameEn: "Bank Transfer" },
] as const;

export const BOOKING_STATUSES = {
  pending_payment: { nameAr: "بانتظار الدفع", nameEn: "Pending Payment", color: "warning" },
  confirmed: { nameAr: "مؤكد", nameEn: "Confirmed", color: "info" },
  partially_paid: { nameAr: "مدفوع جزئياً", nameEn: "Partially Paid", color: "warning" },
  fully_paid: { nameAr: "مدفوع بالكامل", nameEn: "Fully Paid", color: "success" },
  checked_in: { nameAr: "تم التسجيل", nameEn: "Checked In", color: "success" },
  in_transit: { nameAr: "في الطريق", nameEn: "In Transit", color: "info" },
  completed: { nameAr: "مكتمل", nameEn: "Completed", color: "success" },
  cancelled: { nameAr: "ملغي", nameEn: "Cancelled", color: "error" },
  refunded: { nameAr: "مسترجع", nameEn: "Refunded", color: "error" },
} as const;

export const PLATFORM_COMMISSION_RATE = 0.02; // 2%
