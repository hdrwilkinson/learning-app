---
name: accessibility
description: WCAG compliance, ARIA patterns, and keyboard navigation. Use when ensuring accessibility, adding ARIA labels, or keyboard support. Triggers include "accessibility", "a11y", "ARIA", "keyboard navigation", "screen reader".
---

# Accessibility Skill

## Purpose & Context (WHY)

Accessibility ensures the application is usable by everyone, including people using screen readers, keyboard navigation, or other assistive technologies. This skill covers WCAG 2.1 guidelines and practical patterns.

**When to use**: Building new components, auditing existing UI, adding keyboard support.

**When to skip**: Never skip accessibility. Every component should be accessible.

## Core Principles (POUR)

| Principle          | Meaning                    | Example                    |
| ------------------ | -------------------------- | -------------------------- |
| **Perceivable**    | Users can perceive content | Alt text, color contrast   |
| **Operable**       | Users can interact         | Keyboard navigation, focus |
| **Understandable** | Content is clear           | Labels, error messages     |
| **Robust**         | Works with assistive tech  | Semantic HTML, ARIA        |

## Quick Checklist

### Every Component

- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Focus visible (outline on focus)
- [ ] Color contrast >= 4.5:1 (text), 3:1 (UI)
- [ ] Screen reader announces correctly

### Interactive Elements

- [ ] Has accessible name (label, aria-label)
- [ ] Role is correct (button, link, etc.)
- [ ] State is announced (expanded, selected, etc.)

## Semantic HTML First

```tsx
// ✅ Good - semantic HTML
<button onClick={handleClick}>Submit</button>
<a href="/about">About Us</a>
<nav>...</nav>
<main>...</main>
<article>...</article>

// ❌ Bad - divs with click handlers
<div onClick={handleClick}>Submit</div>
<div onClick={() => router.push('/about')}>About Us</div>
```

## Keyboard Navigation

### Required Keys

| Key          | Action                           |
| ------------ | -------------------------------- |
| `Tab`        | Move to next focusable element   |
| `Shift+Tab`  | Move to previous                 |
| `Enter`      | Activate button/link             |
| `Space`      | Toggle checkbox, activate button |
| `Escape`     | Close modal/dropdown             |
| `Arrow keys` | Navigate within component        |

### Focus Management

```tsx
import { useRef, useEffect } from "react";

function Modal({ isOpen, onClose }: ModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus first interactive element
            closeButtonRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <dialog open={isOpen} aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">Modal Title</h2>
            <button ref={closeButtonRef} onClick={onClose}>
                Close
            </button>
        </dialog>
    );
}
```

## ARIA Patterns

### Labels

```tsx
// Visible label (preferred)
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Hidden label (when visual label not possible)
<input aria-label="Search courses" type="search" />

// Described by another element
<input aria-describedby="email-hint" />
<p id="email-hint">We'll never share your email</p>
```

### States

```tsx
// Expanded/collapsed
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<div id="menu" hidden={!isOpen}>...</div>

// Selected
<li role="option" aria-selected={isSelected}>Option</li>

// Disabled
<button disabled aria-disabled="true">Submit</button>

// Loading
<button aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Live Regions

```tsx
// Announce dynamic content
<div aria-live="polite" aria-atomic="true">
  {message && <p>{message}</p>}
</div>

// For errors (more urgent)
<div role="alert">
  {error && <p>{error}</p>}
</div>
```

## Color and Contrast

### Minimum Ratios

| Element            | Ratio |
| ------------------ | ----- |
| Normal text        | 4.5:1 |
| Large text (18px+) | 3:1   |
| UI components      | 3:1   |

### Don't Rely on Color Alone

```tsx
// ❌ Bad - color only
<span className="text-red-500">Error occurred</span>

// ✅ Good - color + icon + text
<span className="text-red-500">
  <AlertIcon aria-hidden="true" /> Error: Invalid email
</span>
```

## Reduced Motion

```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

```tsx
// In React
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;
```

## Testing Accessibility

### Manual Testing

1. Navigate with keyboard only (no mouse)
2. Use screen reader (VoiceOver on Mac, NVDA on Windows)
3. Zoom to 200% and check layout
4. Check with high contrast mode

### Automated Testing

```bash
# Axe DevTools browser extension
# Lighthouse accessibility audit
```

## Resources

**This Skill**:

- `reference/aria-patterns.md` - Common ARIA patterns

**Related Skills**:

- `components` - Accessible component patterns
- `branding` - Color contrast in design tokens

## Key Principle

Accessible by default, not as an afterthought.

---

_Skill established November 2025 for the Learning App (Cognia) project._
