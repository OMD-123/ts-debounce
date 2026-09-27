// Search Autocomplete Example
// Run with: npx ts-node examples/search-autocomplete.ts

import { debounce } from '../src/index';

interface SearchResult {
  id: string;
  title: string;
  description: string;
}

const searchInput = document.getElementById('search') as HTMLInputElement | null;
const resultsContainer = document.getElementById('results') as HTMLDivElement | null;

async function fetchResults(query: string): Promise<SearchResult[]> {
  // Simulate API call
  await new Promise(r => setTimeout(r, 200));
  return [
    { id: '1', title: `${query} result 1`, description: 'First result' },
    { id: '2', title: `${query} result 2`, description: 'Second result' },
  ];
}

function renderResults(results: SearchResult[]) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = results
    .map(r => `<div class="result"><strong>${r.title}</strong>: ${r.description}</div>`)
    .join('');
}

// Debounced search - waits 300ms after user stops typing
const debouncedSearch = debounce(async (query: string) => {
  if (!query.trim()) {
    if (resultsContainer) resultsContainer.innerHTML = '';
    return;
  }
  try {
    const results = await fetchResults(query);
    renderResults(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}, 300);

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    debouncedSearch((e.target as HTMLInputElement).value);
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => debouncedSearch.cancel());

console.log('Search autocomplete example loaded. Open in browser with HTML input #search and div #results.');