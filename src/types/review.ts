import type { Timestamp } from "./common";

export interface Review {
  id: string;
  tripId: string;
  campaignId: string;
  travelerId: string;
  travelerName: string;
  travelerNameAr?: string;
  travelerAvatar?: string;
  rating: number;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  photoUrls: string[];
  helpful: number;
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
