import type { Timestamp, UserRole, StaffRole } from "./common";

export interface User {
  uid: string;
  phone: string;
  email?: string;
  displayName: string;
  displayNameAr?: string;
  avatarUrl?: string;
  role: UserRole;
  campaignId?: string;
  staffRole?: StaffRole;
  nationality?: string;
  civilId?: string;
  passportNumber?: string;
  passportExpiry?: Timestamp;
  dateOfBirth?: Timestamp;
  gender?: "male" | "female";
  preferredLanguage: "ar" | "en";
  notificationTokens: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}
