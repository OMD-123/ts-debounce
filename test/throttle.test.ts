import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from '../src/index';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle a function', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100);

    throttled();
    throttled();
    throttled();

    vi.advanceTimersByTime(100);

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should respect leading and trailing options', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100, { leading: true, trailing: false });

    throttled();
    throttled();
    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments and context', () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const throttled = throttle(mockFn, 100);

    throttled(42, 'hello');

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(42, 'hello');
  });
});
