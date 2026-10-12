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

    // t=0: leading call fires immediately
    throttled();
    // t=0: ignored (within wait period)
    throttled();
    // t=0: ignored (within wait period)
    throttled();

    // t=100: trailing call fires
    vi.advanceTimersByTime(100);

    // t=100: new call at same time as trailing - in fake timers, 
    // this happens at same timestamp so remaining > 0, it waits for next trailing
    throttled();

    // Total: leading (t=0) + trailing (t=100) = 2 calls
    expect(mockFn).toHaveBeenCalledTimes(2);
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

  it('should support cancel method', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100);

    throttled();
    throttled.cancel();

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should support flush method', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100);

    throttled();
    throttled.flush();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should support pending method', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100, { leading: false, trailing: true });

    expect(throttled.pending()).toBe(false);

    throttled();
    expect(throttled.pending()).toBe(true);

    vi.advanceTimersByTime(100);

    expect(throttled.pending()).toBe(false);
  });

  it('should respect trailing only (leading false)', () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 100, { leading: false, trailing: true });

    throttled();
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});