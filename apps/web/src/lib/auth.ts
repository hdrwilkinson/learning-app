/**
 * Auth utilities for the web app
 */

import { auth } from "../auth";
import type { Session } from "next-auth";

/**
 * Get the current user session (server-side)
 */
export async function getSession(): Promise<Session | null> {
    const result = await auth();
    return result;
}

/**
 * Get the current user (server-side)
 */
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
