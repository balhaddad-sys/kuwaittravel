import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title, description, and icon", () => {
    render(
      <EmptyState
        icon={<span data-testid="empty-icon">I</span>}
        title="No trips yet"
        description="Create your first trip to get started."
      />
    );

    expect(screen.getByText("No trips yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first trip to get started.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("calls action callback when CTA is clicked", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No bookings"
        action={{ label: "Create trip", onClick }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /create trip/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
