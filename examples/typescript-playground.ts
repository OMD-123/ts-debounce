// TypeScript Playground Examples
// Copy these into TypeScript Playground (https://www.typescriptlang.org/play)
// to see live type inference and IntelliSense

// ============================================
// 1. Basic Debounce with Full Type Inference
// ============================================

import { debounce } from 'ts-debounce';

// Function with typed parameters
function searchUsers(query: string, limit: number): Promise<User[]> {
  return fetch(`/api/users?q=${query}&limit=${limit}`).then(r => r.json());
}

interface User {
  id: string;
  name: string;
  email: string;
}

// TypeScript infers: DebouncedFunction<(query: string, limit: number) => Promise<User[]>>
const debouncedSearch = debounce(searchUsers, 300);

// Usage - fully typed
debouncedSearch('john', 10);  // ✓ Works
// debouncedSearch(123, 10);   // ✗ Type error: Argument of type 'number' not assignable to 'string'

// Access debounced methods
debouncedSearch.cancel();      // Cancel pending
debouncedSearch.flush();       // Execute immediately if pending
debouncedSearch.pending();     // Check if pending


// ============================================
// 2. Throttle with Options
// ============================================

import { throttle, ThrottleOptions } from 'ts-debounce';

interface ScrollPosition {
  x: number;
  y: number;
}

function updateScrollPosition(pos: ScrollPosition): void {
  console.log(`Scroll: ${pos.x}, ${pos.y}`);
}

// Options with full typing
const scrollOptions: ThrottleOptions = {
  leading: true,    // Call immediately on first invoke
  trailing: true    // Call after wait period
};

// TypeScript infers: ThrottledFunction<(pos: ScrollPosition) => void>
const throttledScroll = throttle(updateScrollPosition, 16, scrollOptions);

// Usage
window.addEventListener('scroll', () => {
  throttledScroll({ x: window.scrollX, y: window.scrollY });
});

// Cleanup
// throttledScroll.cancel();


// ============================================
// 3. Format Function Types
// ============================================

import { format } from 'ts-debounce';

// Indexed placeholders - returns string
const indexed = format('Hello {0}, you are {1} years old', 'Alice', 30);
//    ^? string

// Named placeholders with object
const named = format('User: {name}, Role: {role}', { name: 'Bob', role: 'Admin' });
//    ^? string

// Mixed usage
const mixed = format('{0} and {named}', ['first'], { named: 'second' });
//    ^? string

// Escaping
const escaped = format('{{escaped}} and {0}', 'normal');
//    ^? string


// ============================================
// 4. React Hook Types
// ============================================

import { useCallback, useRef, useEffect } from 'react';
import { debounce, DebouncedFunction } from 'ts-debounce';

// Custom hook with proper generics
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number
): DebouncedFunction<T> {
  const ref = useRef<DebouncedFunction<T>>();
  
  if (!ref.current) {
    ref.current = debounce(callback, wait);
  }
  
  useEffect(() => {
    if (ref.current) ref.current.fn = callback;
  }, [callback]);
  
  useEffect(() => () => ref.current?.cancel(), []);
  
  return ref.current!;
}

// Usage in component
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  
  const search = useDebouncedCallback(
    async (q: string) => {
      const users = await searchUsers(q, 10);
      setResults(users);
    },
    300
  );
  
  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        search(e.target.value);
      }}
    />
  );
}


// ============================================
// 5. Advanced: Conditional Types
// ============================================

// Debounce preserves function signature exactly
function add(a: number, b: number): number {
  return a + b;
}

const debouncedAdd = debounce(add, 100);
//    ^? DebouncedFunction<(a: number, b: number) => number>

// Can call with same signature
debouncedAdd(1, 2);  // ✓ number

// Methods available on debounced function
interface DebouncedMethods {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
}

const methods: DebouncedMethods = debouncedAdd;
// cancel, flush, pending all available


// ============================================
// 6. Real-world: API Client Wrapper
// ============================================

import { debounce, throttle } from 'ts-debounce';

interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

function createApiClient(baseUrl: string): ApiClient {
  // Debounced GET for search endpoints
  const debouncedGet = debounce(async <T>(url: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${url}`);
    return response.json();
  }, 200);
  
  // Throttled POST for analytics
  const throttledPost = throttle(async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }, 1000);
  
  return {
    get: debouncedGet,
    post: throttledPost,
  };
}

// Usage
const api = createApiClient('https://api.example.com');

// Search is debounced
api.get<User[]>('/users?q=john');  // Waits 200ms after last call

// Analytics is throttled
api.post('/analytics/event', { type: 'click', element: 'button' });  // Max once/sec


// ============================================
// 7. Generic Utility Types
// ============================================

import type { DebouncedFunction, ThrottledFunction } from 'ts-debounce';

// Extract original function type from debounced version
type OriginalFn<T> = T extends DebouncedFunction<infer F> ? F : never;
type OriginalFnThrottled<T> = T extends ThrottledFunction<infer F> ? F : never;

type SearchFn = OriginalFn<typeof debouncedSearch>;
//    ^? (query: string, limit: number) => Promise<User[]>

// Use in higher-order functions
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args) => {
    console.log('Calling with:', args);
    return fn(...args);
  }) as T;
}

const loggedSearch = withLogging(debouncedSearch.fn);
//    ^? (query: string, limit: number) => Promise<User[]>


// ============================================
// 8. Testing Utilities
// ============================================

// For testing with fake timers
import { vi } from 'vitest';

function testDebounce() {
  vi.useFakeTimers();
  
  const fn = vi.fn();
  const debounced = debounce(fn, 100);
  
  debounced('a');
  debounced('b');
  debounced('c');
  
  expect(fn).not.toHaveBeenCalled();
  
  vi.advanceTimersByTime(100);
  
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('c');  // Last call wins
  
  vi.useRealTimers();
}

console.log('TypeScript playground examples ready!');
console.log('Copy any section into https://www.typescriptlang.org/play');