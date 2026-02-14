import type { Timestamp, PaymentMethod, PaymentStatus } from "./common";

export interface PaymentRecord {
  id: string;
  bookingId: string;
  campaignId: string;
  tripId: string;
  payerId: string;
  amountKWD: number;
  method: PaymentMethod;
  direction: "inbound" | "outbound";
  status: PaymentStatus;
  gatewayReference?: string;
  gatewayResponse?: Record<string, unknown>;
  receiptUrl?: string;
  notes?: string;
  processedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Payout {
  id: string;
  campaignId: string;
  amountKWD: number;
  platformFeeKWD: number;
  netAmountKWD: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer";
  bankDetails: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
  periodStart: Timestamp;
  periodEnd: Timestamp;
  bookingIds: string[];
  processedBy?: string;
  processedAt?: Timestamp;
  createdAt: Timestamp;
}
