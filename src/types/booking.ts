import type { Timestamp, BookingStatus } from "./common";

export interface Booking {
  id: string;
  travelerId: string;
  travelerName: string;
  travelerPhone: string;
  campaignId: string;
  tripId: string;
  tripTitle: string;
  pricingTierId?: string;
  numberOfPassengers: number;
  subtotalKWD: number;
  discountKWD: number;
  totalKWD: number;
  paidKWD: number;
  remainingKWD: number;
  status: BookingStatus;
  paymentSchedule: {
    dueDate: Timestamp;
    amountKWD: number;
    status: "pending" | "paid" | "overdue";
    paidAt?: Timestamp;
  }[];
  specialRequests?: string;
  internalNotes?: string;
  cancellationReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  cancelledAt?: Timestamp;
}

export interface Passenger {
  id: string;
  bookingId: string;
  fullName: string;
  fullNameAr?: string;
  passportNumber: string;
  passportExpiry: Timestamp;
  nationalId?: string;
  dateOfBirth: Timestamp;
  gender: "male" | "female";
  nationality: string;
  phone?: string;
  relationship: "self" | "spouse" | "child" | "parent" | "sibling" | "other";
  seatAssignment?: string;
  roomAssignment?: string;
  specialNeeds?: string;
  documentUrls: {
    passport?: string;
    visa?: string;
    vaccination?: string;
    photo?: string;
  };
}
