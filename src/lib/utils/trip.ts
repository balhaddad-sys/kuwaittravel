import type { TripStatus } from "@/types";

export type TripCardStatus = "active" | "draft" | "completed" | "cancelled";

export function toTripCardStatus(status: TripStatus): TripCardStatus {
  if (status === "draft") return "draft";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  return "active";
}

export function isBookableTrip(status: TripStatus): boolean {
  return status === "published" || status === "registration_open";
}
