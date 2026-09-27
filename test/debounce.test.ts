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

  it('should invoke immediately if immediate is true', () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 100, true);

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
});
