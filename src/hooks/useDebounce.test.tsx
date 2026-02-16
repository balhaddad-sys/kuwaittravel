import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the latest value only after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    expect(result.current).toBe("a");

    rerender({ value: "ab", delay: 300 });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");
  });

  it("cancels older timers and keeps only the final update", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "one" });
    rerender({ value: "two" });
    rerender({ value: "final" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("final");
  });
});
