/**
 * Format a number as Kuwaiti Dinar currency
 */
export function formatKWD(amount: number): string {
  return new Intl.NumberFormat("ar-KW", {
    style: "currency",
    currency: "KWD",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

/**
 * Format a date in Arabic locale
 */
export function formatDate(date: Date | string, locale = "ar-KW"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

type TimestampLike = {
  seconds?: number;
  toDate?: () => Date;
};

/**
 * Convert Firestore-like timestamps into a Date.
 */
export function parseTimestamp(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object") {
    const ts = value as TimestampLike;
    if (typeof ts.toDate === "function") {
      return ts.toDate();
    }
    if (typeof ts.seconds === "number") {
      return new Date(ts.seconds * 1000);
    }
  }

  return null;
}

/**
 * Format Firestore-like timestamps using locale formatting.
 */
export function formatTimestamp(value: unknown, locale = "ar-KW"): string {
  const parsed = parseTimestamp(value);
  if (!parsed) return "غير محدد";
  return formatDate(parsed, locale);
}

/**
 * Format a date as relative time (e.g., "3 days ago")
 */
export function formatRelativeTime(date: Date | string, locale = "ar-KW"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return rtf.format(-diffMinutes, "minute");
    }
    return rtf.format(-diffHours, "hour");
  }
  if (diffDays < 30) return rtf.format(-diffDays, "day");
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), "month");
  return rtf.format(-Math.floor(diffDays / 365), "year");
}

/**
 * Format a Kuwait phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("965")) {
    const local = cleaned.slice(3);
    return `+965 ${local.slice(0, 4)} ${local.slice(4)}`;
  }
  return phone;
}
