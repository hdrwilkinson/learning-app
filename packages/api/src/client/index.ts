/**
 * API client configuration and helpers
 */

import type { ApiResponse } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Base fetch wrapper with error handling
 */
export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error: error || "An error occurred",
            };
        }

        const data = await response.json();
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * GET request helper
 */
export function apiGet<T>(endpoint: string, options?: RequestInit) {
    return apiFetch<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request helper
 */
export function apiPost<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
) {
    return apiFetch<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * PUT request helper
 */
export function apiPut<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
) {
    return apiFetch<T>(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
    });
}

/**
 * DELETE request helper
 */
export function apiDelete<T>(endpoint: string, options?: RequestInit) {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
}
