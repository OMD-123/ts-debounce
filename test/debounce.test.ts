import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../src/index';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce a function', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100);

    debounced();
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should invoke immediately if leading is true', () => {
    const mockFn = vi.fn();
    // With leading: true and trailing: false (default trailing is true, so need to set false)
    const debounced = debounce(mockFn, 100, { leading: true, trailing: false });

    debounced();
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const debounced = debounce(mockFn, 100);

    debounced(42, 'hello');

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(42, 'hello');
  });

  it('should support cancel method', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100);

    debounced();
    debounced.cancel();

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should support flush method', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100);

    debounced();
    debounced.flush();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should support pending method', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100);

    expect(debounced.pending()).toBe(false);

    debounced();

    expect(debounced.pending()).toBe(true);

    vi.advanceTimersByTime(100);

    expect(debounced.pending()).toBe(false);
  });

  it('should support maxWait option', () => {
    const mockFn = vi.fn();
    // maxWait: 100 means function MUST be called within 100ms
    const debounced = debounce(mockFn, 1000, { maxWait: 100, trailing: true });

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();

    // At 100ms (maxWait), function should have been called
    vi.advanceTimersByTime(50);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should support leading and trailing together', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100, { leading: true, trailing: true });

    debounced();
    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced();
    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});