---
name: components
description: UI component patterns using shadcn/ui and atomic design. Use when building new components, organizing component structure, or following UI patterns. Triggers include "create component", "shadcn", "atomic design".
---

# Components Skill

## Purpose & Context (WHY)

This skill provides patterns for building consistent, accessible UI components using shadcn/ui and atomic design principles. Components are organized in a hierarchy from simple atoms to complex organisms.

**When to use**: Building new UI components, refactoring existing components, or organizing component structure.

**When to skip**: For one-off UI elements that won't be reused.

## Component Hierarchy

### Atomic Design Levels

```
apps/web/src/components/ui/
├── shadcn/           # Base shadcn/ui components (button, input, etc.)
├── atoms/            # Fundamental building blocks
│   └── IconButton/
│       ├── IconButton.tsx
│       ├── IconButton.test.tsx
│       └── index.ts
├── molecules/        # Combinations of atoms
│   └── SearchInput/
└── organisms/        # Complex compositions
    └── Header/
```

### When to Create Each Level

| Level    | Create when...                   | Examples                   |
| -------- | -------------------------------- | -------------------------- |
| shadcn   | Installing base components       | Button, Input, Dialog      |
| Atom     | Single-purpose, highly reusable  | IconButton, Badge, Avatar  |
| Molecule | Combines 2-3 atoms for a purpose | SearchInput, UserCard      |
| Organism | Complex, feature-specific        | Header, Sidebar, DataTable |

## Component Creation Workflow

### 1. Check Existing Components

Before creating:

```bash
# Check shadcn components
ls apps/web/src/components/ui/shadcn/

# Check atoms/molecules
ls apps/web/src/components/ui/atoms/
ls apps/web/src/components/ui/molecules/
```

### 2. Install shadcn Component (if needed)

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

### 3. Create Custom Component

**File structure** (for atoms/molecules):

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

### 4. Component Template

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

## Resources

**This Skill**:

- `reference/shadcn-patterns.md` - shadcn/ui component patterns

**Related Skills**:

- `branding` - Design tokens and visual identity
- `accessibility` - ARIA and keyboard patterns
- `testing` - Component testing patterns

## Key Principle

Build composable, accessible components from atoms to organisms.

---

_Skill established November 2025 for the Learning App (Cognia) project._
