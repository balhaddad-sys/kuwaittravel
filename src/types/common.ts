import type { Timestamp as FirestoreTimestamp } from "firebase/firestore";

export type Timestamp = FirestoreTimestamp;

export type UserRole = "traveler" | "campaign_owner" | "campaign_staff" | "admin" | "super_admin";
export type StaffRole = "manager" | "operator" | "viewer";
export type TripType = "hajj" | "umrah" | "ziyarat" | "combined";
export type TripStatus = "draft" | "published" | "registration_open" | "registration_closed" | "in_progress" | "completed" | "cancelled";
export type BookingStatus = "pending_payment" | "confirmed" | "partially_paid" | "fully_paid" | "checked_in" | "in_transit" | "completed" | "cancelled" | "refunded";
export type PaymentMethod = "knet" | "visa" | "mastercard" | "cash" | "bank_transfer";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type VerificationStatus = "pending" | "approved" | "rejected" | "suspended";
export type DisputeType = "refund" | "service_quality" | "fraud" | "other";
export type DisputeStatus = "open" | "under_review" | "resolved" | "escalated" | "closed";
export type SOSType = "medical" | "security" | "lost" | "other";
export type SOSStatus = "active" | "acknowledged" | "responding" | "resolved";
export type NotificationType = "booking_confirmed" | "payment_received" | "trip_reminder" | "document_required" | "trip_update" | "sos_alert" | "payout_processed" | "campaign_verified" | "dispute_opened" | "system";
export type ItineraryBlockType = "flight" | "hotel_checkin" | "hotel_checkout" | "activity" | "meal" | "transport" | "free_time" | "religious";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TripFilterState {
  tripType: TripType | null;
  priceMin: number | null;
  priceMax: number | null;
  destinations: string[];
  searchQuery: string;
}
