import React from "react";
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleSheet,
} from "react-native";

export interface TextProps extends RNTextProps {
    /** Visual variant */
    variant?: "h1" | "h2" | "h3" | "body" | "caption" | "label";
    /** Color variant */
    color?: "primary" | "secondary" | "muted" | "error";
    /** Weight */
    weight?: "normal" | "medium" | "semibold" | "bold";
}

/**
 * Universal Text component
 * Provides consistent typography across platforms
 */
export function Text({
    variant = "body",
    color = "primary",
    weight = "normal",
    style,
    ...props
}: TextProps) {
    return (
        <RNText
            style={[styles[variant], styles[color], styles[weight], style]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    // Variants
    h1: {
        fontSize: 36,
        lineHeight: 40,
    },
    h2: {
        fontSize: 30,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        lineHeight: 32,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        lineHeight: 20,
    },
    label: {
        fontSize: 12,
        lineHeight: 16,
    },
    // Colors
    primary: {
        color: "#000000",
    },
    secondary: {
        color: "#6b7280",
    },
    muted: {
        color: "#9ca3af",
    },
    error: {
        color: "#ef4444",
    },
    // Weights
    normal: {
        fontWeight: "400",
    },
    medium: {
        fontWeight: "500",
    },
    semibold: {
        fontWeight: "600",
    },
    bold: {
        fontWeight: "700",
    },
});
