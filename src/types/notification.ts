import type { Timestamp, NotificationType, SOSType, SOSStatus, DisputeType, DisputeStatus } from "./common";

export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: "traveler" | "campaign_owner" | "admin";
  type: NotificationType;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  data?: {
    screen?: string;
    entityId?: string;
    entityType?: string;
  };
  isRead: boolean;
  isPushed: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
}

export interface SOSEvent {
  id: string;
  travelerId: string;
  travelerName: string;
  travelerPhone: string;
  bookingId: string;
  tripId: string;
  campaignId: string;
  type: SOSType;
  description: string;
  location?: { lat: number; lng: number };
  status: SOSStatus;
  resolvedBy?: string;
  resolution?: string;
  createdAt: Timestamp;
  acknowledgedAt?: Timestamp;
  resolvedAt?: Timestamp;
}

export interface Dispute {
  id: string;
  bookingId: string;
  tripId: string;
  campaignId: string;
  filedBy: string;
  filedByRole: "traveler" | "campaign_owner";
  type: DisputeType;
  subject: string;
  description: string;
  evidenceUrls: string[];
  status: DisputeStatus;
  resolution?: string;
  resolvedBy?: string;
  amountDisputedKWD?: number;
  amountRefundedKWD?: number;
  messages: {
    senderId: string;
    senderRole: string;
    content: string;
    createdAt: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: Timestamp;
}
