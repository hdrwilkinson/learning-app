/**
 * Auth utilities for the web app
 */

import { getServerSession } from "next-auth";
import { authOptions } from "../../../../services/db/auth";

/**
 * Get the current user session (server-side)
 */
export async function getSession() {
    return await getServerSession(authOptions);
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
