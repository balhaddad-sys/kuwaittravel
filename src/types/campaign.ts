import type { Timestamp, VerificationStatus, PaymentMethod } from "./common";

export interface Campaign {
  id: string;
  ownerId: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  logoUrl?: string;
  coverImageUrl?: string;
  galleryUrls: string[];
  licenseNumber: string;
  licenseImageUrl: string;
  commercialRegNumber?: string;
  contactPhone: string;
  contactEmail?: string;
  website?: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  verificationStatus: VerificationStatus;
  verifiedAt?: Timestamp;
  verifiedBy?: string;
  rejectionReason?: string;
  acceptsOnlinePayment: boolean;
  paymentMethods: PaymentMethod[];
  bankDetails?: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
  stats: {
    totalTrips: number;
    activeTrips: number;
    totalBookings: number;
    averageRating: number;
    totalReviews: number;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CampaignStaff {
  userId: string;
  role: "manager" | "operator" | "viewer";
  permissions: string[];
  addedBy: string;
  addedAt: Timestamp;
}
