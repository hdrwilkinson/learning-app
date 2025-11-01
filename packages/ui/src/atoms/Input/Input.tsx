import React from "react";
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from "react-native";

export interface InputProps extends TextInputProps {
    /** Input label */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Container style */
    containerStyle?: ViewStyle;
}

/**
 * Universal Input component
 * Form input with label, error, and helper text support
 */
export function Input({
    label,
    error,
    helperText,
    containerStyle,
    style,
    ...props
}: InputProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError, style]}
                placeholderTextColor="#9ca3af"
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {helperText && !error && (
                <Text style={styles.helper}>{helperText}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: "#ffffff",
        color: "#000000",
    },
    inputError: {
        borderColor: "#ef4444",
    },
    error: {
        fontSize: 12,
        color: "#ef4444",
        marginTop: 4,
    },
    helper: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
});
