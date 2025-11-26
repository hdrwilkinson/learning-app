---
name: performance
description: Performance optimization, caching, lazy loading, and bundle size. Use when improving performance, reducing bundle size, or implementing caching. Triggers include "performance", "optimize", "bundle size", "caching", "lazy load".
---

# Performance Skill

## Purpose & Context (WHY)

Performance directly impacts user experience and SEO. This skill covers optimization techniques for Next.js applications, focusing on bundle size, loading performance, and runtime efficiency.

**When to use**: Slow page loads, large bundle sizes, poor Core Web Vitals.

**When to skip**: Don't optimize prematurely. Measure first, then optimize.

## Core Metrics (Core Web Vitals)

| Metric                              | Good    | Description         |
| ----------------------------------- | ------- | ------------------- |
| **LCP** (Largest Contentful Paint)  | < 2.5s  | Loading performance |
| **INP** (Interaction to Next Paint) | < 200ms | Interactivity       |
| **CLS** (Cumulative Layout Shift)   | < 0.1   | Visual stability    |

## Measurement First

### Vercel Analytics

```tsx
// Already enabled in Next.js
// View in Vercel Dashboard → Analytics
```

### Lighthouse

```bash
# Run in Chrome DevTools
# Performance tab → Lighthouse
```

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build
```

## Server Components (Default)

```tsx
// ✅ Server Component (default) - no JS shipped
export default async function Page() {
    const data = await fetchData();
    return <div>{data.title}</div>;
}

// ❌ Client Component - adds to bundle
("use client");
export default function Page() {
    const [data, setData] = useState(null);
    // ...
}
```

**Rule**: Use Server Components by default. Add `'use client'` only when needed.

## Code Splitting

### Dynamic Imports

```tsx
import dynamic from "next/dynamic";

// Lazy load heavy component
const HeavyChart = dynamic(() => import("./HeavyChart"), {
    loading: () => <Skeleton />,
    ssr: false, // If not needed on server
});
```

### Route-Based Splitting

```tsx
// Next.js automatically splits by route
// Each page is a separate chunk
```

## Image Optimization

### Use next/image

```tsx
import Image from 'next/image';

// ✅ Optimized
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// ❌ Not optimized
<img src="/hero.jpg" alt="Hero" />
```

### Image Loading

| Attribute            | Use for                     |
| -------------------- | --------------------------- |
| `priority`           | Above-the-fold images (LCP) |
| `loading="lazy"`     | Below-the-fold (default)    |
| `placeholder="blur"` | Show blur while loading     |

## Font Optimization

```tsx
// next/font - no layout shift
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export default function Layout({ children }) {
    return (
        <html className={inter.className}>
            <body>{children}</body>
        </html>
    );
}
```

## Caching Strategies

### Data Cache

```tsx
// Cache fetch requests
const data = await fetch(url, {
    next: { revalidate: 3600 }, // Revalidate every hour
});

// Or static
const data = await fetch(url, {
    cache: "force-cache",
});
```

### React Cache

```tsx
import { cache } from "react";

// Deduplicate requests in same render
export const getUser = cache(async (id: string) => {
    return await prisma.user.findUnique({ where: { id } });
});
```

### unstable_cache (Prisma)

```tsx
import { unstable_cache } from "next/cache";

const getCachedUser = unstable_cache(
    async (id: string) => prisma.user.findUnique({ where: { id } }),
    ["user"],
    { revalidate: 3600 }
);
```

## Bundle Size Reduction

### Import Optimization

```tsx
// ✅ Good - tree-shakeable
import { Button } from "@/components/ui/shadcn/button";

// ❌ Bad - imports entire library
import * as Components from "@/components/ui";
```

### Analyze Large Dependencies

```bash
# Check what's in your bundle
npm run build
# Look for large chunks in .next/analyze/
```

### Replace Heavy Libraries

| Heavy     | Lighter Alternative        |
| --------- | -------------------------- |
| moment.js | date-fns, dayjs            |
| lodash    | lodash-es (tree-shakeable) |
| chart.js  | recharts (for React)       |

## React Performance

### useMemo/useCallback

```tsx
// Only memoize expensive calculations
const expensiveValue = useMemo(() => {
    return heavyComputation(data);
}, [data]);

// Only memoize if passed to optimized children
const handleClick = useCallback(() => {
    doSomething(id);
}, [id]);
```

### Virtualization

```tsx
// For long lists (100+ items)
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }) {
    const parentRef = useRef(null);
    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
    });
    // ...
}
```

## Quick Wins Checklist

- [ ] Use Server Components by default
- [ ] Use `next/image` for all images
- [ ] Use `next/font` for fonts
- [ ] Add `priority` to LCP image
- [ ] Lazy load below-the-fold components
- [ ] Cache data fetches appropriately

## Resources

**This Skill**:

- `reference/performance-patterns.md` - More optimization patterns

**Related Skills**:

- `deployment` - Build optimization
- `components` - Efficient component patterns

## Key Principle

Measure first, optimize where it matters.

---

_Skill established November 2025 for the Learning App (Cognia) project._
