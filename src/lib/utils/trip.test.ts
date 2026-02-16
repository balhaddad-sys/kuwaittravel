import { describe, expect, it } from "vitest";
import { isBookableTrip, toTripCardStatus } from "./trip";

describe("trip utils", () => {
  describe("toTripCardStatus", () => {
    it("maps draft status to draft card state", () => {
      expect(toTripCardStatus("draft")).toBe("draft");
    });

    it("maps completed status to completed card state", () => {
      expect(toTripCardStatus("completed")).toBe("completed");
    });

    it("maps cancelled status to cancelled card state", () => {
      expect(toTripCardStatus("cancelled")).toBe("cancelled");
    });

    it("maps active-like statuses to active card state", () => {
      expect(toTripCardStatus("published")).toBe("active");
      expect(toTripCardStatus("registration_open")).toBe("active");
      expect(toTripCardStatus("registration_closed")).toBe("active");
      expect(toTripCardStatus("in_progress")).toBe("active");
    });
  });

  describe("isBookableTrip", () => {
    it("returns true for published and registration_open statuses", () => {
      expect(isBookableTrip("published")).toBe(true);
      expect(isBookableTrip("registration_open")).toBe(true);
    });

    it("returns false for non-bookable statuses", () => {
      expect(isBookableTrip("draft")).toBe(false);
      expect(isBookableTrip("registration_closed")).toBe(false);
      expect(isBookableTrip("completed")).toBe(false);
      expect(isBookableTrip("cancelled")).toBe(false);
    });
  });
});
