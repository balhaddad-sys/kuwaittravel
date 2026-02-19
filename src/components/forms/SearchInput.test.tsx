import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onSearch initially and after debounce on typing", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} delay={300} />);

    expect(onSearch).toHaveBeenCalledWith("");

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Karbala" } });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onSearch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onSearch).toHaveBeenLastCalledWith("Karbala");
  });

  it("clears the query when clear button is clicked", () => {
    const onSearch = vi.fn();
    const { container } = render(<SearchInput onSearch={onSearch} delay={200} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Najaf" } });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onSearch).toHaveBeenLastCalledWith("Najaf");

    fireEvent.click(screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onSearch).toHaveBeenLastCalledWith("");
    expect((input as HTMLInputElement).value).toBe("");

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("updates search icon color on focus and blur", () => {
    const onSearch = vi.fn();
    const { container } = render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole("textbox");
    const icon = container.querySelector("svg");

    expect(icon).toHaveClass("text-gray-400");

    fireEvent.focus(input);
    expect(icon).toHaveClass("text-indigo-600");

    fireEvent.blur(input);
    expect(icon).toHaveClass("text-gray-400");
  });
});
