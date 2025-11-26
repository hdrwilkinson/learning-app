# Typography & Spacing

Complete typography system and spacing scale.

## Font Families (Google Fonts)

| Purpose          | Font            | Usage                        |
| ---------------- | --------------- | ---------------------------- |
| Display Fun      | `Space Grotesk` | Hero headers, huge numbers   |
| Display Grounded | `Inter Tight`   | Section headers, card titles |
| Body             | `Inter`         | Paragraphs, UI text          |
| Mono             | `Fira Code`     | Code snippets, tokens        |

## Advanced Typography

### Tabular Numbers (`tnum`)

**ALWAYS** use for data, tables, and countdowns to prevent jitter.

```css
.tnum {
    font-variant-numeric: tabular-nums;
}
```

### Feature Settings

Enable in Inter for legibility:

- `cv05` - lowercase 'l' with tail
- `cv11` - single-story 'a'

### Tracking (Letter Spacing)

- **Headings**: Tighten (`-0.02em`)
- **Caps**: Loosen (`+0.05em`)

## Logo

**Wordmark**: "Cognia" in **Inter Tight** (bold/semibold), custom letter-spacing.

**Mark**: Simple lighthouse/beam or path-node motif (guidance & mastery).

### Logo Usage Guidelines

- ✅ Keep aspect ratio, approved colors, and clear space
- ❌ Don't slant, add effects, outline, or place on low-contrast backgrounds

## Spacing System

**Base unit**: 4px (0.25rem)

| Token | Value | Pixels |
| ----- | ----- | ------ |
| xs    | 1     | 4px    |
| sm    | 2     | 8px    |
| md    | 4     | 16px   |
| lg    | 6     | 24px   |
| xl    | 8     | 32px   |
| 2xl   | 12    | 48px   |
| 3xl   | 16    | 64px   |

## Shape Language

### Border Radius

| Token   | Value   | Pixels |
| ------- | ------- | ------ |
| sm      | 0.25rem | 4px    |
| DEFAULT | 0.5rem  | 8px    |
| md      | 0.75rem | 12px   |
| lg      | 1rem    | 16px   |
| xl      | 1.5rem  | 24px   |
| full    | 9999px  | Pill   |

## Motion & Animation

### Physics

Use spring-based animations for natural feel.

**Spring-Damped**:

```css
transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
```

Quick entry, soft landing.

**Fade-Scale** (for modals):

```
Entry: opacity-0 scale-95 → opacity-100 scale-100
```

## Component Patterns

### Buttons

| Variant   | Style                      |
| --------- | -------------------------- |
| Primary   | Brand action. `bg-primary` |
| Secondary | Supportive. `bg-secondary` |
| Ghost     | `hover:bg-surface-2`       |

### Cards

- Background: `bg-card` or `bg-surface-1` for distinct sections
- Border: `border-border` (subtle)
- Shadow: `shadow-sm` default, `shadow-md` on hover (interactive)

## Implementation Notes

Configure in `packages/theme/tailwind-preset.cjs`:

- Map surface colors
- Map chart colors
- Add tnum utility
