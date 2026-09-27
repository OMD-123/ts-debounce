// React Hook Integration Example
// Run with: npx ts-node examples/use-debounce.ts

import { useCallback, useRef, useEffect, useState } from 'react';
import { debounce, DebouncedFunction } from '../src/index';

// Custom hook for debounced callbacks
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean; maxWait?: number }
): DebouncedFunction<T> {
  const debouncedRef = useRef<DebouncedFunction<T>>();
  
  if (!debouncedRef.current) {
    debouncedRef.current = debounce(callback, wait, options);
  }
  
  // Update callback reference without changing debounce timing
  useEffect(() => {
    if (debouncedRef.current) {
      debouncedRef.current.fn = callback;
    }
  }, [callback]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => debouncedRef.current?.cancel();
  }, []);
  
  return debouncedRef.current!;
}

// Custom hook for debounced values
export function useDebouncedValue<T>(value: T, wait: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);
    
    return () => clearTimeout(timer);
  }, [value, wait]);
  
  return debouncedValue;
}

// Example Search Component
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Debounced search function
  const debouncedSearch = useDebouncedCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(r => setTimeout(r, 300));
        const data = [`Result for "${q}" #1`, `Result for "${q}" #2`, `Result for "${q}" #3`];
        setResults(data);
      } finally {
        setLoading(false);
      }
    },
    300
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Search with Debounce</h2>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Type to search..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
          boxSizing: 'border-box'
        }}
      />
      {loading && <div style={{ color: 'orange' }}>Searching...</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((result, i) => (
          <li key={i} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            {result}
          </li>
        ))}
      </ul>
      {results.length === 0 && query && !loading && (
        <div style={{ color: '#666' }}>No results found</div>
      )}
    </div>
  );
}

// Example: Throttled Scroll Position
function useThrottledScrollPosition(wait: number = 16) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = throttle(() => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    }, wait);
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [wait]);
  
  return position;
}

// Example Component using throttled scroll
function ScrollIndicator() {
  const { y } = useThrottledScrollPosition(50);
  const progress = Math.min((y / (document.body.scrollHeight - window.innerHeight)) * 100, 100);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #61dafb, #1fa2ff)',
        zIndex: 9999,
        transition: 'width 0.1s linear'
      }}
    />
  );
}

// Export for use in React apps
export { SearchComponent, ScrollIndicator, useThrottledScrollPosition };