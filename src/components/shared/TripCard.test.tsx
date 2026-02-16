import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TripCard } from "./TripCard";

vi.mock("@/providers/DirectionProvider", () => ({
  useDirection: () => ({
    language: "en",
    direction: "ltr",
    setLanguage: vi.fn(),
    t: (_ar: string, en: string) => en,
  }),
}));

describe("TripCard", () => {
  const baseProps = {
    title: "Karbala Journey",
    destination: "Karbala",
    departureDate: "Mar 10",
    returnDate: "Mar 15",
    price: 250,
    capacity: 40,
    booked: 38,
    status: "active" as const,
    campaignName: "Al Noor Campaign",
  };

  it("renders trip details and remaining seats text", () => {
    render(<TripCard {...baseProps} />);

    expect(screen.getByText("Karbala Journey")).toBeInTheDocument();
    expect(screen.getByText("Karbala")).toBeInTheDocument();
    expect(screen.getByText("2 left")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
  });

  it("fires onClick when card is clicked", () => {
    const onClick = vi.fn();
    render(<TripCard {...baseProps} onClick={onClick} />);

    fireEvent.click(screen.getByText("Karbala Journey"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders full state when no capacity remains", () => {
    render(<TripCard {...baseProps} booked={40} remainingCapacity={0} />);
    expect(screen.getByText("Full")).toBeInTheDocument();
  });

  it("handles wishlist toggle without triggering card click", () => {
    const onClick = vi.fn();
    const onWishlistToggle = vi.fn();

    render(
      <TripCard
        {...baseProps}
        onClick={onClick}
        onWishlistToggle={onWishlistToggle}
        wishlisted={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add to wishlist/i }));

    expect(onWishlistToggle).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
