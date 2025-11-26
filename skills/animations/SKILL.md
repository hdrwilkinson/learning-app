---
name: animations
description: Motion design with Tailwind transitions and animation patterns. Use when adding animations, transitions, or micro-interactions. Triggers include "animation", "transition", "motion", "animate".
---

# Animations Skill

## Purpose & Context (WHY)

Purposeful motion enhances user experience by providing feedback, guiding attention, and creating delight. This skill covers animation patterns using Tailwind CSS and CSS animations.

**When to use**: Adding transitions for state changes, loading states, micro-interactions.

**When to skip**: When animation would distract from content or harm performance.

## Core Principles

1. **Purpose over decoration**: Every animation should serve a function
2. **Fast by default**: Keep durations short (150-300ms for UI)
3. **Respect preferences**: Honor `prefers-reduced-motion`
4. **Performance first**: Use transform/opacity, avoid layout changes

## Tailwind Transitions

### Basic Transition

```tsx
// Hover transition
<button className="transition-colors duration-200 hover:bg-primary">
  Click me
</button>

// Multiple properties
<div className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
  Card
</div>
```

### Transition Classes

| Class                  | Properties               |
| ---------------------- | ------------------------ |
| `transition`           | Common properties        |
| `transition-colors`    | Color changes            |
| `transition-opacity`   | Opacity only             |
| `transition-transform` | Scale, rotate, translate |
| `transition-all`       | All properties           |

### Duration Classes

| Class          | Duration         |
| -------------- | ---------------- |
| `duration-75`  | 75ms             |
| `duration-150` | 150ms (quick UI) |
| `duration-200` | 200ms (default)  |
| `duration-300` | 300ms (emphasis) |
| `duration-500` | 500ms (slow)     |

### Easing Classes

| Class         | Effect             |
| ------------- | ------------------ |
| `ease-linear` | Constant speed     |
| `ease-in`     | Slow start         |
| `ease-out`    | Slow end (natural) |
| `ease-in-out` | Slow both ends     |

## Common Patterns

### Fade In/Out

```tsx
<div
    className={cn(
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
    )}
>
    Content
</div>
```

### Slide In

```tsx
<div
    className={cn(
        "transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
    )}
>
    Sidebar
</div>
```

### Scale on Hover

```tsx
<button className="transition-transform duration-200 hover:scale-105 active:scale-95">
    Interactive
</button>
```

### Staggered Animation

```tsx
{
    items.map((item, index) => (
        <div
            key={item.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {item.name}
        </div>
    ));
}
```

## CSS Keyframe Animations

### Define in globals.css

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
```

### Use with Tailwind

```tsx
// In tailwind.config.ts
animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'spin-slow': 'spin 2s linear infinite',
}

// Usage
<div className="animate-fade-in">Fades in</div>
<Spinner className="animate-spin-slow" />
```

## Loading States

### Spinner

```tsx
<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
    />
    <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
</svg>
```

### Skeleton

```tsx
<div className="animate-pulse space-y-4">
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-1/2" />
</div>
```

## Reduced Motion

### Always Include

```css
/* In globals.css */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Hook for React

```tsx
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return prefersReducedMotion;
}
```

## Performance Tips

1. **Use transform/opacity**: These are GPU-accelerated
2. **Avoid animating layout**: Don't animate width, height, margin
3. **Use `will-change` sparingly**: Only when needed
4. **Keep durations short**: UI animations < 300ms

## Resources

**This Skill**:

- `reference/animation-patterns.md` - More animation patterns

**Related Skills**:

- `accessibility` - Reduced motion support
- `components` - Animated components

## Key Principle

Purposeful motion enhances UX without distraction.

---

_Skill established November 2025 for the Learning App (Cognia) project._
