import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("binds the label to the generated input id", () => {
    render(<Input label="Email Address" />);

    const input = screen.getByLabelText("Email Address");
    expect(input).toHaveAttribute("id", "email-address");
  });

  it("renders hint when no error is provided", () => {
    render(<Input label="Phone" hint="Use your Kuwait number" />);
    expect(screen.getByText("Use your Kuwait number")).toBeInTheDocument();
  });

  it("renders error and hides hint when validation fails", () => {
    render(
      <Input
        label="Phone"
        hint="Use your Kuwait number"
        error="Phone is required"
      />
    );

    expect(screen.getByText("Phone is required")).toBeInTheDocument();
    expect(screen.queryByText("Use your Kuwait number")).not.toBeInTheDocument();
  });

  it("renders left and right addons", () => {
    render(
      <Input
        label="Search"
        leftAddon={<span data-testid="left-addon">@</span>}
        rightAddon={<span data-testid="right-addon">.kw</span>}
      />
    );

    expect(screen.getByTestId("left-addon")).toBeInTheDocument();
    expect(screen.getByTestId("right-addon")).toBeInTheDocument();
  });

  it("accepts user input through onChange", () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ali" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
