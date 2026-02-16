import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("binds the label to the generated textarea id", () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText("Notes")).toHaveAttribute("id", "notes");
  });

  it("shows hint text when there is no error", () => {
    render(<Textarea label="Notes" hint="Add details for your team" />);
    expect(screen.getByText("Add details for your team")).toBeInTheDocument();
  });

  it("shows error message and suppresses hint", () => {
    render(
      <Textarea
        label="Notes"
        hint="Add details for your team"
        error="Notes are required"
      />
    );

    expect(screen.getByText("Notes are required")).toBeInTheDocument();
    expect(screen.queryByText("Add details for your team")).not.toBeInTheDocument();
  });

  it("handles user typing", () => {
    const onChange = vi.fn();
    render(<Textarea label="Description" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Draft itinerary details" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
