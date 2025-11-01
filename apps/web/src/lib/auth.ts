/**
 * Auth utilities for the web app
 */

import getServerSession from "next-auth";
import { authOptions } from "../../../../services/db/auth";
import type { Session } from "next-auth";

/**
 * Get the current user session (server-side)
 */
export async function getSession(): Promise<Session | null> {
    const result = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any)?.session || null;
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
