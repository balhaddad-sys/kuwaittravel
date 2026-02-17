import type { TripType } from "./common";

export type ChecklistCategory = "document" | "packing" | "health" | "financial" | "spiritual";
export type ChecklistItemStatus = "pending" | "completed" | "skipped";

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  required: boolean;
  sortOrder: number;
}

export interface ChecklistTemplate {
  id: string;
  tripType: TripType;
  items: ChecklistItem[];
}

export interface TravelerChecklistState {
  bookingId: string;
  items: Record<string, ChecklistItemStatus>;
  updatedAt: number;
}
