# Color Tokens

Complete color system for the learning app. All text/interactive combinations meet AA minimum.

## Role Tokens (Light Mode)

```css
--background: 0 0% 100%; /* Pure White */
--surface-1: 210 40% 98%; /* Subtle Cool Gray - Sidebar/Card bg */
--surface-2: 210 40% 96%; /* Hover states/Input bg */
--surface-3: 210 40% 93%; /* Active states/Borders */
--foreground: 222 47% 11%; /* Deep Navy */
--card: 0 0% 100%;
--card-foreground: 222 47% 11%;
--popover: 0 0% 100%;
--popover-foreground: 222 47% 11%;
--primary: 262 83% 58%; /* Purple 600 #7C3AED */
--primary-foreground: 0 0% 100%;
--secondary: 201 96% 32%; /* Blue 700 #0369A1 */
--secondary-foreground: 0 0% 100%;
--accent: 193 82% 31%; /* Cyan 700 #0E7490 */
--accent-foreground: 0 0% 100%;
--accent-gold: 45 93% 47%; /* Gold 500 #F59E0B */
--accent-gold-foreground: 0 0% 100%;
--muted: 210 40% 96%;
--muted-foreground: 215 16% 47%;
--destructive: 0 72% 51%; /* Red 600 #DC2626 */
--destructive-foreground: 0 0% 100%;
--border: 214 32% 91%;
--input: 214 32% 91%;
--ring: 262 83% 58%;
--radius: 0.5rem;
```

## Dark Mode Mapping

```css
--background: 222 47% 7%; /* Deepest Navy */
--surface-1: 222 47% 10%; /* Elevated surface */
--surface-2: 222 47% 13%; /* Hover/Input */
--surface-3: 222 47% 16%; /* Active/Border */
--foreground: 0 0% 98%;
--primary: 262 83% 65%; /* Purple 500 for better dark contrast */
--destructive: 0 84% 60%; /* Bright Red #EF4444 for visibility */
```

## Data Visualization Palette (Charts/Progress)

Distinct from UI colors to avoid confusion with actions. Colors optimized for contrast in each mode.

### Light Mode (muted for white/light backgrounds)

```css
--chart-1: 173 58% 39%; /* Teal - Mastery */
--chart-2: 12 76% 61%; /* Coral - Struggle */
--chart-3: 197 37% 24%; /* Slate Blue - Neutral */
--chart-4: 43 74% 66%; /* Yellow - In Progress */
--chart-5: 27 87% 67%; /* Orange - Warning */
```

### Dark Mode (vibrant for dark backgrounds - higher saturation)

```css
--chart-1: 160 60% 45%; /* Green - Mastery */
--chart-2: 12 76% 61%; /* Coral/Orange - Struggle */
--chart-3: 197 37% 40%; /* Slate Blue - Neutral */
--chart-4: 340 75% 55%; /* Pink/Magenta - In Progress */
--chart-5: 30 80% 55%; /* Orange - Warning */
```

## Color Meaning

- **Primary (Purple)** - Brand action, main CTA
- **Secondary (Blue)** - Supportive actions
- **Accent (Cyan)** - UI highlights
- **Accent Gold** - Warmth, rewards, achievements
- **Destructive (Red)** - Errors, dangerous actions

## Depth System (Elevation)

- **Flat**: Base background
- **Raised (Surface-1)**: Cards, sidebars. `shadow-sm`
- **Overlay (Surface-2)**: Dropdowns, popovers. `shadow-md`
- **Modal (Surface-3)**: Dialogs. `shadow-xl` + backdrop blur

## Implementation

Add `--surface-1`, `--surface-2`, `--surface-3`, and `--chart-1` through `--chart-5` to `globals.css`.

In Tailwind config, map `surface` and `chart` colors.
