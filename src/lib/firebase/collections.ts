export const COLLECTIONS = {
  USERS: "users",
  CAMPAIGNS: "campaigns",
  TRIPS: "trips",
  BOOKINGS: "bookings",
  PAYMENTS: "payments",
  PAYOUTS: "payouts",
  NOTIFICATIONS: "notifications",
  SOS_EVENTS: "sos_events",
  AUDIT_LOGS: "audit_logs",
  DISPUTES: "disputes",
  REVIEWS: "reviews",
  DESTINATION_GUIDES: "destination_guides",
} as const;

export const SUB_COLLECTIONS = {
  CAMPAIGN_STAFF: "staff",
  TRIP_ITINERARY: "itinerary_blocks",
  TRIP_INVENTORY: "inventory",
  TRIP_PRICING: "pricing_tiers",
  BOOKING_PASSENGERS: "passengers",
  TRIP_REVIEWS: "reviews",
} as const;
