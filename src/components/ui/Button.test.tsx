import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders content and handles clicks", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Book now</Button>);
    fireEvent.click(screen.getByRole("button", { name: /book now/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction and shows spinner when loading", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: /save/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders optional left and right icons", () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Continue
      </Button>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("supports full-width layout", () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole("button", { name: /wide/i })).toHaveClass("w-full");
  });
});
