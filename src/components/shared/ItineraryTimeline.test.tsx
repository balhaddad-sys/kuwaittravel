import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ItineraryTimeline } from "./ItineraryTimeline";
import type { ItineraryBlock } from "@/types";

vi.mock("@/providers/DirectionProvider", () => ({
  useDirection: () => ({
    language: "en",
    direction: "ltr",
    setLanguage: vi.fn(),
    t: (_ar: string, en: string) => en,
  }),
}));

function makeDate(value: string) {
  return {
    toDate: () => new Date(value),
  } as unknown as ItineraryBlock["date"];
}

describe("ItineraryTimeline", () => {
  it("builds route-specific day headers from location data", () => {
    const blocks: ItineraryBlock[] = [
      {
        id: "b1",
        dayNumber: 1,
        date: makeDate("2026-03-01T00:00:00.000Z"),
        title: "Flight to Najaf",
        titleAr: "رحلة إلى النجف",
        type: "flight",
        location: "Kuwait",
        sortOrder: 1,
      },
      {
        id: "b2",
        dayNumber: 1,
        date: makeDate("2026-03-01T00:00:00.000Z"),
        title: "Transfer",
        titleAr: "تنقل",
        type: "transport",
        location: "Najaf",
        sortOrder: 2,
      },
    ];

    render(<ItineraryTimeline blocks={blocks} />);

    expect(screen.getByText("Kuwait to Najaf route")).toBeInTheDocument();
    expect(screen.getByText(/Kuwait → Najaf/)).toBeInTheDocument();
    expect(screen.getByText(/2 stops/)).toBeInTheDocument();
  });

  it("uses activity-aware single-location headers", () => {
    const blocks: ItineraryBlock[] = [
      {
        id: "b3",
        dayNumber: 2,
        date: makeDate("2026-03-02T00:00:00.000Z"),
        title: "Visit Shrine",
        titleAr: "زيارة المرقد",
        type: "religious",
        location: "Karbala",
        sortOrder: 1,
      },
    ];

    render(<ItineraryTimeline blocks={blocks} />);

    expect(screen.getByText("Ziyarat in Karbala")).toBeInTheDocument();
  });

  it("falls back to numbered day label when no location/title context exists", () => {
    const blocks: ItineraryBlock[] = [
      {
        id: "b4",
        dayNumber: 3,
        date: makeDate("2026-03-03T00:00:00.000Z"),
        title: "Day 3",
        titleAr: "اليوم 3",
        type: "free_time",
        sortOrder: 1,
      },
    ];

    render(<ItineraryTimeline blocks={blocks} />);

    expect(
      screen.getByRole("heading", { name: "Day 3", level: 4 })
    ).toBeInTheDocument();
  });
});
