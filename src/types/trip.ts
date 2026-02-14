import type { Timestamp, TripType, TripStatus, ItineraryBlockType } from "./common";

export interface Trip {
  id: string;
  campaignId: string;
  campaignName: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: TripType;
  coverImageUrl?: string;
  galleryUrls: string[];
  departureDate: Timestamp;
  returnDate: Timestamp;
  registrationDeadline: Timestamp;
  departureCity: string;
  destinations: {
    city: string;
    country: string;
    arrivalDate: Timestamp;
    departureDate: Timestamp;
  }[];
  totalCapacity: number;
  bookedCount: number;
  remainingCapacity: number;
  basePriceKWD: number;
  currency: "KWD";
  status: TripStatus;
  isTemplate: boolean;
  templateSourceId?: string;
  tags: string[];
  featured: boolean;
  adminApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

export interface ItineraryBlock {
  id: string;
  dayNumber: number;
  date: Timestamp;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  type: ItineraryBlockType;
  startTime?: string;
  endTime?: string;
  location?: string;
  sortOrder: number;
}

export interface InventoryItem {
  id: string;
  type: "room" | "seat" | "bus";
  category: string;
  label: string;
  totalQuantity: number;
  bookedQuantity: number;
  priceAddonKWD: number;
}

export interface PricingTier {
  id: string;
  name: string;
  nameAr: string;
  priceKWD: number;
  description: string;
  includes: string[];
  maxCapacity: number;
  bookedCount: number;
}
