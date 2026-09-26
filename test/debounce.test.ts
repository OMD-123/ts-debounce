import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "../src/index";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should debounce a function", () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100);

    debounced();
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(0);

    // Fast forward time
    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should invoke immediately if immediate is true", () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100, true);

    debounced();
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1); // No additional call
  });

  it("should pass arguments and context", () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const debounced = debounce(mockFn, 100);

    debounced.call({ custom: "context" }, 42, "hello");

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(42, "hello");
    expect(mockFn).toHaveBeenCalledWith({ custom: "context" } as any);
  });
});