import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { throttle } from "../src/index";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throttle a function", () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100);

    throttled();
    throttled();
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should respect leading and trailing options", () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100, { leading: false, trailing: true });

    throttled(); // first call, leading false -> not called
    throttled(); // second call
    throttled(); // third call

    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1); // trailing call after wait

    throttled(); // new call after wait
    expect(mockFn).toHaveBeenCalledTimes(1); // still 1, waiting for trailing

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2); // trailing of the new call
  });

  it("should pass arguments and context", () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const throttled = throttle(mockFn, 100);

    throttled.call({ custom: "context" }, 1, "a");
    throttled.call({ custom: "context" }, 2, "b");

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    // Should have been called with the last arguments
    expect(mockFn).toHaveBeenCalledWith(2, "b");
    expect(mockFn).toHaveBeenCalledWith({ custom: "context" } as any);
  });
});