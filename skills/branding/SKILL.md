---
name: branding
description: Complete brand guidelines for Cognia - visual identity, design tokens, component styles, and brand voice. Part of Frontend category (_hub-frontend). Use when building UI components, choosing colors, writing copy, or making design decisions. Trigger phrases include "brand colors", "design tokens", "typography", "brand guidelines", "UI styling", "component design".
---

# Branding

## Purpose & Context (WHY)

**Problem**: Inconsistent design across the application leads to poor user experience and brand dilution.

**Solution**: Centralized brand guidelines with design tokens that ensure consistency across web and mobile platforms.

**Reference this skill when**: Building UI components, choosing colors, writing copy, or making design decisions. Keep tokens in sync across web/mobile. Follow accessibility rules by default (WCAG AA, AAA where feasible).

## Brand Identity

**Brand Name**: **Cognia**  
_(Evokes "cognition," "knowledge," and "insight")_

**Tagline**: **Master anything, on schedule.**  
Alternates: _Your path to mastery, simplified._ / _From effort to mastery._

**Mission**: We turn consistent effort into lasting understanding by giving every student a clear plan, science-backed practice, and a supportive companion.

**Brand Personality** (Magician × Caregiver):

- **Encouraging** – supportive, never snarky; celebrates consistency
- **Calm-confident** – serious about outcomes without hype
- **Curious** – delights in "aha!" moments and insight
- **Precise** – evidence-based, honest about progress
- **Playful** – light touches of delight; never childish

## Quick Reference

**Primary Colors**:

- Primary: `hsl(262 83% 58%)` - Bold Purple (#7C3AED)
- Secondary: `hsl(201 96% 32%)` - Deep Sky Blue (#0369A1)
- Accent: `hsl(193 82% 31%)` - Cyan (#0E7490)
- Accent Gold: `hsl(45 93% 47%)` - Gold (#F59E0B)

**Typography**:

- Display Fun: `Space Grotesk` - Hero headers, huge numbers
- Display Grounded: `Inter Tight` - Section headers, card titles
- Body: `Inter` - Paragraphs, UI text
- Mono: `Fira Code` - Code snippets, tokens

**Spacing Base**: 4px (0.25rem)  
**Scale**: xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64

**Radius**: sm 4 · DEFAULT 8 · md 12 · lg 16 · xl 24 · full pill

**Icons**: Heroicons (react-icons/hi) - Outline default, Solid for active states

## Resources

**For detailed implementation**:

- **MANDATORY**: Load `reference/color-tokens.md` for complete color system
- **MANDATORY**: Load `reference/typography.md` for typography and spacing details

## Key Principles

1. **Design tokens are source of truth** - All colors, spacing, typography from tokens
2. **Accessibility first** - WCAG AA minimum, AAA where feasible
3. **Consistency across platforms** - Web and mobile share design tokens
4. **Use CSS variables** - Defined in `apps/web/src/styles/globals.css`
5. **Spring-based animations** - Natural feel with `ease-[cubic-bezier(0.25,1,0.5,1)]`
