// Window Resize Handler Example
// Run with: npx ts-node examples/resize-handler.ts

import { throttle } from '../src/index';

interface LayoutMetrics {
  width: number;
  height: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

function calculateLayout(): LayoutMetrics {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let breakpoint: LayoutMetrics['breakpoint'] = 'desktop';
  
  if (width < 768) breakpoint = 'mobile';
  else if (width < 1024) breakpoint = 'tablet';
  
  return { width, height, breakpoint };
}

// Only recalculate layout at most every 100ms
const handleResize = throttle(() => {
  const layout = calculateLayout();
  
  // Update CSS custom properties
  document.documentElement.style.setProperty('--viewport-width', `${layout.width}px`);
  document.documentElement.style.setProperty('--viewport-height', `${layout.height}px`);
  
  // Dispatch custom event for other components
  window.dispatchEvent(new CustomEvent('layout-change', { detail: layout }));
  
  console.log('Layout updated:', layout);
}, 100, { leading: true, trailing: true });

window.addEventListener('resize', handleResize);

console.log('Resize handler initialized. Resize window to see layout updates.');
console.log('Try: window.dispatchEvent(new Event("resize"))');

// Cleanup
// handleResize.cancel();

export { calculateLayout, handleResize };