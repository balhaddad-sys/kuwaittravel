import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatDate,
  formatKWD,
  formatPhone,
  formatRelativeTime,
  formatTimestamp,
  parseTimestamp,
} from "./format";

describe("format utilities", () => {
  describe("formatKWD", () => {
    it("formats amounts as Kuwaiti dinar currency", () => {
      const formatted = formatKWD(12.3);
      expect(formatted).toMatch(/د\.ك|KWD/);
    });
  });

  describe("formatDate", () => {
    it("formats dates with the provided locale", () => {
      const formatted = formatDate("2026-02-16T00:00:00.000Z", "en-US");
      expect(formatted).toMatch(/2026/);
    });
  });

  describe("parseTimestamp", () => {
    it("returns a Date when the input is already a Date instance", () => {
      const input = new Date("2026-02-16T12:00:00.000Z");
      expect(parseTimestamp(input)).toEqual(input);
    });

    it("parses valid ISO date strings", () => {
      const parsed = parseTimestamp("2026-02-16T12:00:00.000Z");
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed?.toISOString()).toBe("2026-02-16T12:00:00.000Z");
    });

    it("parses Firestore-like objects with toDate()", () => {
      const parsed = parseTimestamp({
        toDate: () => new Date("2026-02-16T12:00:00.000Z"),
      });
      expect(parsed?.toISOString()).toBe("2026-02-16T12:00:00.000Z");
    });

    it("parses Firestore-like objects with seconds", () => {
      const parsed = parseTimestamp({ seconds: 60 });
      expect(parsed?.toISOString()).toBe("1970-01-01T00:01:00.000Z");
    });

    it("returns null for invalid values", () => {
      expect(parseTimestamp("not-a-date")).toBeNull();
      expect(parseTimestamp(null)).toBeNull();
      expect(parseTimestamp(undefined)).toBeNull();
    });
  });

  describe("formatTimestamp", () => {
    it("returns fallback label when value cannot be parsed", () => {
      expect(formatTimestamp("invalid", "en-US")).toBe("غير محدد");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-16T12:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("formats minute-level relative time", () => {
      const value = formatRelativeTime("2026-02-16T11:58:00.000Z", "en");
      expect(value).toMatch(/minute/);
    });

    it("formats month-level relative time", () => {
      const value = formatRelativeTime("2025-12-16T12:00:00.000Z", "en");
      expect(value).toMatch(/month/);
    });
  });

  describe("formatPhone", () => {
    it("formats Kuwait numbers with country code", () => {
      expect(formatPhone("+96512345678")).toBe("+965 1234 5678");
    });

    it("returns original phone for non-kuwait patterns", () => {
      expect(formatPhone("+12025550123")).toBe("+12025550123");
    });
  });
});
