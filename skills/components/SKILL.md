---
name: components
description: UI component patterns using shadcn/ui, atomic design, and feature-based organization. Use when building new components, organizing component structure, or following UI patterns. Triggers include "create component", "shadcn", "atomic design", "feature component".
---

# Components Skill

## Purpose & Context (WHY)

This skill provides patterns for building consistent, accessible UI components using shadcn/ui and atomic design principles. Components live in **two locations**: feature-specific folders for domain logic, and shared `components/ui/` for reusable primitives.

**When to use**: Building new UI components, refactoring existing components, or organizing component structure.

**When to skip**: For one-off UI elements that won't be reused.

## Feature-Based vs Shared Components

**First decision**: Is this component feature-specific or shared?

| Put in...                     | When...                                              |
| ----------------------------- | ---------------------------------------------------- |
| `features/{name}/components/` | Component is only used within that feature           |
| `components/ui/`              | Component is used by 2+ features OR is truly generic |

**Start in features, promote upon reuse.** When a component is needed by multiple features, move it to `components/ui/`.

### Feature Components Structure

```
apps/web/src/features/{feature-name}/
├── components/           # Feature-specific UI (atomic structure)
│   ├── atoms/
│   │   └── FeatureAtom/
│   ├── molecules/
│   │   └── FeatureMolecule/
│   ├── organisms/
│   │   └── FeatureOrganism/
│   └── index.ts          # Barrel export
├── hooks/
├── utils/
├── types.ts
└── index.ts              # Public API
```

### Shared Components Structure

```
apps/web/src/components/ui/
├── shadcn/           # Base shadcn/ui components (button, input, etc.)
├── atoms/            # Shared fundamental building blocks
│   └── SharedAtom/
├── molecules/        # Shared combinations of atoms
│   └── SharedMolecule/
├── organisms/        # Shared complex compositions (rare)
└── layout/           # Layout components
```

## Component Hierarchy

### Atomic Design Levels

Both feature and shared components use atomic design:

| Level    | Create when...                   | Examples                   |
| -------- | -------------------------------- | -------------------------- |
| shadcn   | Installing base components       | Button, Input, Dialog      |
| Atom     | Single-purpose, highly reusable  | IconButton, Badge, Avatar  |
| Molecule | Combines 2-3 atoms for a purpose | SearchInput, UserCard      |
| Organism | Complex compositions             | Header, Sidebar, DataTable |

## Component Creation Workflow

### 1. Determine Placement

Ask: **Is this component only used within one feature?**

- **Yes** → Create in `features/{feature-name}/components/`
- **No** → Create in `components/ui/`

### 2. Check Existing Components

Before creating:

```bash
# Check feature components (if feature-specific)
ls apps/web/src/features/{feature-name}/components/

# Check shared components
ls apps/web/src/components/ui/shadcn/
ls apps/web/src/components/ui/atoms/
ls apps/web/src/components/ui/molecules/
```

### 3. Install shadcn Component (if needed)

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

### 4. Create Custom Component

**File structure** (same for feature and shared):

```
ComponentName/
├── ComponentName.tsx      # Implementation
├── ComponentName.test.tsx # Tests
└── index.ts              # Barrel export
```

**index.ts pattern**:

```typescript
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

### 5. Component Template

```tsx
import { cn } from "@/lib/utils";

export interface ComponentNameProps {
    /** Description of prop */
    variant?: "default" | "destructive";
    /** Additional CSS classes */
    className?: string;
    /** Children elements */
    children?: React.ReactNode;
}

export function ComponentName({
    variant = "default",
    className,
    children,
}: ComponentNameProps) {
    return (
        <div
            className={cn(
                "base-classes-here",
                variant === "destructive" && "destructive-classes",
                className
            )}
        >
            {children}
        </div>
    );
}
```

## Styling Guidelines

### Use Design Tokens

```tsx
// ✅ Good - uses CSS variables
className = "text-foreground bg-background";

// ❌ Bad - hardcoded colors
className = "text-gray-900 bg-white";
```

### Use cn() for Conditional Classes

```tsx
import { cn } from '@/lib/utils';

className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // Allow override
)}
```

### Reference Branding Skill

For colors, typography, and spacing, see `/skills/branding/SKILL.md`.

## Testing Components

```tsx
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
    it("renders children", () => {
        render(<ComponentName>Hello</ComponentName>);
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("applies variant styles", () => {
        render(<ComponentName variant="destructive">Delete</ComponentName>);
        expect(screen.getByText("Delete")).toHaveClass("destructive-class");
    });
});
```

## Import Patterns

```typescript
// Feature components (internal use within feature)
import { FeatureMolecule } from "./components/molecules/FeatureMolecule";

// Feature public API (from outside the feature)
import { FeatureMolecule, useFeatureHook } from "@/features/feature-name";

// Shared components
import { Button } from "@/components/ui/shadcn/button";
import { SharedAtom } from "@/components/ui/atoms";
```

## Resources

**This Skill**:

- `reference/shadcn-patterns.md` - shadcn/ui component patterns

**Related Skills**:

- `branding` - Design tokens and visual identity
- `accessibility` - ARIA and keyboard patterns
- `testing` - Component testing patterns

## Key Principle

Build composable, accessible components from atoms to organisms. Start in features, promote to shared upon reuse.

---

_Skill established November 2025 for the Learning App (Cognia) project._
