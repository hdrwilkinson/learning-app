import React from "react";
import {
    Pressable,
    Text,
    StyleSheet,
    PressableProps,
    ViewStyle,
} from "react-native";

export interface ButtonProps extends Omit<PressableProps, "style"> {
    /** Button text */
    children: React.ReactNode;
    /** Visual variant */
    variant?: "primary" | "secondary" | "outline" | "ghost";
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Disabled state */
    disabled?: boolean;
    /** Additional styles */
    style?: ViewStyle;
}

/**
 * Universal Button component
 * Built on React Native primitives, works on web and mobile
 */
export function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    style,
    ...props
}: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.base,
                styles[variant],
                styles[size],
                pressed && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled}
            {...props}
        >
            <Text
                style={[
                    styles.text,
                    styles[`${variant}Text`],
                    disabled && styles.disabledText,
                ]}
            >
                {children}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        flexDirection: "row",
    },
    // Variants
    primary: {
        backgroundColor: "#0ea5e9",
    },
    secondary: {
        backgroundColor: "#a855f7",
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#0ea5e9",
    },
    ghost: {
        backgroundColor: "transparent",
    },
    // Sizes
    sm: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    md: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    lg: {
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    // States
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        opacity: 0.5,
    },
    // Text styles
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
    primaryText: {
        color: "#ffffff",
    },
    secondaryText: {
        color: "#ffffff",
    },
    outlineText: {
        color: "#0ea5e9",
    },
    ghostText: {
        color: "#0ea5e9",
    },
    disabledText: {
        opacity: 0.7,
    },
});
