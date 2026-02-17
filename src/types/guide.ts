import type { TripType } from "./common";

export interface DestinationGuide {
  id: string;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  heroImageUrl: string;
  description: string;
  descriptionAr: string;
  highlights: {
    title: string;
    titleAr: string;
    icon: string;
  }[];
  practicalInfo: {
    label: string;
    labelAr: string;
    value: string;
    valueAr: string;
  }[];
  relatedTripTypes: TripType[];
}
