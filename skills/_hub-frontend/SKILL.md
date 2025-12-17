---
name: _hub-frontend
description: Frontend development skills hub. Routes to branding, components, accessibility, and animations. Use when building UI, choosing colors, creating components, or adding motion.
---

# Frontend Development Skills Hub

## Purpose

This hub helps you choose the right skill for frontend development tasks. It provides:

- **Decision tree**: Which skill do I need?
- **Cross-skill workflows**: Common multi-skill patterns
- **Category context**: Shared principles for UI development

## Decision Tree

| If you need to...                        | Use this skill  |
| ---------------------------------------- | --------------- |
| Choose colors, typography, design tokens | `branding`      |
| Build UI components (feature or shared)  | `components`    |
| Add ARIA labels, keyboard navigation     | `accessibility` |
| Add transitions, animations              | `animations`    |

### Component Placement Decision

Before creating any component, decide where it belongs:

| Component is...                      | Put in...                     |
| ------------------------------------ | ----------------------------- |
| Used only within one feature         | `features/{name}/components/` |
| Used by 2+ features or truly generic | `components/ui/`              |

## Sub-Skills in This Category

### branding

**Use when**: Building UI components, choosing colors, typography decisions, design consistency

**Trigger phrases**: "brand colors", "design tokens", "typography", "UI styling"

**Path**: `/skills/branding/SKILL.md`

---

### components

**Use when**: Building new components, organizing component structure, feature vs shared placement

**Trigger phrases**: "create component", "shadcn", "atomic design", "UI component", "feature component"

**Path**: `/skills/components/SKILL.md`

---

### accessibility

**Use when**: Ensuring accessibility, adding ARIA labels, keyboard support

**Trigger phrases**: "accessibility", "a11y", "ARIA", "keyboard navigation", "screen reader"

**Path**: `/skills/accessibility/SKILL.md`

---

### animations

**Use when**: Adding animations, transitions, micro-interactions

**Trigger phrases**: "animation", "transition", "motion", "animate"

**Path**: `/skills/animations/SKILL.md`

---

## Cross-Skill Workflows

### Building a New Component

When creating a component from scratch:

1. **Decide placement**: Feature-specific (`features/{name}/components/`) or shared (`components/ui/`)
2. **branding**: Check design tokens for colors, spacing, typography
3. **components**: Use atomic design pattern (atom → molecule → organism)
4. **accessibility**: Add ARIA labels, keyboard support
5. **animations**: Add appropriate transitions

### Design System Consistency

When ensuring consistency across UI:

1. **branding**: Reference design tokens
2. **components**: Use shadcn/ui as foundation
3. **accessibility**: Apply consistent focus states

### Adding Micro-Interactions

When adding polish to existing UI:

1. **animations**: Add transitions for state changes
2. **accessibility**: Ensure motion respects `prefers-reduced-motion`

## Category Principles

1. **Feature first**: Start in `features/{name}/`, promote to shared upon reuse
2. **Design tokens first**: Never hardcode colors, use CSS variables
3. **Atomic composition**: Build complex UI from simple, tested atoms
4. **Accessible by default**: Every component must be keyboard navigable
5. **Purposeful motion**: Animations should guide, not distract
6. **Mobile-first**: Design for mobile, enhance for desktop

## Tech Stack Reference

- **Component library**: shadcn/ui (Radix + Tailwind)
- **Styling**: Tailwind CSS with custom theme preset
- **Icons**: react-icons/hi (Heroicons)
- **Animation**: Tailwind transitions, CSS animations
- **Testing**: React Testing Library

---

_Hub established November 2025 for the Learning App (Cognia) project._
