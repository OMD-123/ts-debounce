import { describe, it, expect } from 'vitest';
import { format } from '../src/index';

describe('format', () => {
  it('should replace placeholders with arguments', () => {
    const result = format('Hello {0}, you are {1} years old.', 'John', 25);
    expect(result).toBe('Hello John, you are 25 years old.');
  });

  it('should handle missing placeholders', () => {
    const result = format('Hello {0}, you are {1} years old.', 'John');
    expect(result).toBe('Hello John, you are {1} years old.');
  });

  it('should handle extra arguments', () => {
    const result = format('Hello {0}!', 'John', 'extra');
    expect(result).toBe('Hello John!');
  });

  it('should handle no placeholders', () => {
    const result = format('Hello World!');
    expect(result).toBe('Hello World!');
  });

  it('should handle escaped braces', () => {
    const result = format('Hello {{0}}!', 'John');
    expect(result).toBe('Hello {0}!');
  });

  it('should handle repeated placeholders', () => {
    const result = format('{0} and {0} and {1}', 'first', 'second');
    expect(result).toBe('first and first and second');
  });
});
