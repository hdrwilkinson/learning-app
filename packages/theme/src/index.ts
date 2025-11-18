/**
 * Design tokens for the learning app
 * These tokens are used across both web and mobile platforms
 */

export const tokens = {
    radius: { sm: 4, md: 8, lg: 12, xl: 16, xxl: 24 },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64 },
    font: {
        displayFun: "Space Grotesk",
        display: "Inter Tight",
        body: "Inter",
        mono: "Fira Code",
    },
    color: {
        primary: { 600: "#7C3AED", 700: "#6D28D9" },
        secondary: { 600: "#2563EB", 700: "#1D4ED8" },
        accent: { 600: "#0891B2", 700: "#0E7490" },
        accentGold: { 500: "#F59E0B", 600: "#D97706" },
        success: { 600: "#16A34A" },
        warning: { 600: "#D97706" },
        error: { 600: "#DC2626" },
        surface: { bg: "hsl(var(--background))", fg: "hsl(var(--foreground))" },
    },
};

// Legacy exports for backward compatibility if needed,
// otherwise these can be deprecated in favor of the `tokens` object
export const colors = {
    primary: {
        50: "#FAF5FF",
        100: "#F3E8FF",
        200: "#E9D5FF",
        300: "#D8B4FE",
        400: "#C084FC",
        500: "#A855F7",
        600: "#7C3AED",
        700: "#6D28D9",
        800: "#5B21B6",
        900: "#4C1D95",
        950: "#2E1065",
    },
    secondary: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: "#3B82F6",
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
        950: "#172554",
    },
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
} as const;

export const typography = {
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
    },
    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

export const borderRadius = {
    none: 0,
    sm: 4,
    default: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;
