import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("does not render when closed", () => {
    render(<Modal open={false} onClose={vi.fn()} title="Hidden modal" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog content and locks body scroll when open", () => {
    render(
      <Modal open onClose={vi.fn()} title="Trip details">
        Content
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Trip details")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Close on escape" />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<Modal open onClose={onClose} title="Backdrops" />);

    const overlayLayers = container.querySelectorAll("div.fixed.inset-0");
    fireEvent.click(overlayLayers[1] as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("restores body scroll when modal closes", () => {
    const { rerender } = render(<Modal open onClose={vi.fn()} title="Body lock" />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<Modal open={false} onClose={vi.fn()} title="Body lock" />);
    expect(document.body.style.overflow).toBe("");
  });
});
