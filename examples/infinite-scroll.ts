// Infinite Scroll Example
// Run with: npx ts-node examples/infinite-scroll.ts

import { throttle } from '../src/index';

let page = 1;
let loading = false;
const sentinel = document.getElementById('sentinel') as HTMLDivElement | null;
const feed = document.getElementById('feed') as HTMLDivElement | null;

async function loadMore() {
  if (loading) return;
  loading = true;
  
  try {
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: (page - 1) * 10 + i + 1,
      title: `Item ${(page - 1) * 10 + i + 1}`,
      content: `Content for item ${(page - 1) * 10 + i + 1}`,
    }));
    
    appendItems(items);
    page++;
  } catch (error) {
    console.error('Failed to load more:', error);
  } finally {
    loading = false;
  }
}

function appendItems(items: { id: number; title: string; content: string }[]) {
  if (!feed) return;
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'feed-item';
    el.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
    feed.appendChild(el);
  });
}

// Throttled intersection observer - check at most every 200ms
const observer = new IntersectionObserver(
  throttle(async (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      await loadMore();
    }
  }, 200),
  { rootMargin: '100px' }
);

if (sentinel) {
  observer.observe(sentinel);
  console.log('Infinite scroll initialized. Scroll down to load more items.');
}

// Cleanup
// observer.disconnect();

export { loadMore, appendItems };