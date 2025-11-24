/**
 * Global request context storage
 * Used to pass headers from route handler to auth callbacks
 * This is a workaround since NextAuth callbacks don't have direct access to request headers
 */

let currentRequestHeaders: Headers | null = null;

export function setCurrentRequestHeaders(headers: Headers): void {
    currentRequestHeaders = headers;
}

export function getCurrentRequestHeaders(): Headers | null {
    return currentRequestHeaders;
}

export function clearCurrentRequestHeaders(): void {
    currentRequestHeaders = null;
}
