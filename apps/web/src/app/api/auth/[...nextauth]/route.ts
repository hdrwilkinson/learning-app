import { handlers } from "@/auth";
import { NextRequest } from "next/server";
import {
    setCurrentRequestHeaders,
    clearCurrentRequestHeaders,
} from "@/lib/request-context";
import {
    loginLimiter,
    loginGlobalLimiter,
    getClientIp,
    checkRateLimit,
    rateLimitResponse,
} from "@/lib/rate-limit";

// Wrap handlers to store request headers for login tracking
const originalGET = handlers.GET;
const originalPOST = handlers.POST;

handlers.GET = async (req: NextRequest) => {
    setCurrentRequestHeaders(req.headers);
    try {
        return await originalGET(req);
    } finally {
        clearCurrentRequestHeaders();
    }
};

handlers.POST = async (req: NextRequest) => {
    setCurrentRequestHeaders(req.headers);

    // Rate limiting for login attempts (credentials signin)
    // NextAuth uses form data, so we check the pathname to identify signin requests
    try {
        const url = new URL(req.url);
        const pathname = url.pathname;

        // Check if this is a signin request (NextAuth uses /api/auth/signin for credentials)
        if (
            pathname.includes("signin") ||
            pathname.includes("callback/credentials")
        ) {
            const ip = getClientIp(req.headers);

            // Check global IP limit first (20/hour per IP)
            const globalLimitResult = await checkRateLimit(
                ip,
                loginGlobalLimiter
            );
            if (!globalLimitResult.success) {
                return rateLimitResponse(globalLimitResult.reset);
            }

            // Try to extract email from form data for per-email+IP limiting
            // Clone request to read body without consuming the original stream
            try {
                const clonedReq = req.clone();
                const formData = await clonedReq.formData();
                const emailEntry = formData.get("email");
                const email =
                    emailEntry instanceof File ? null : emailEntry?.toString();

                if (email) {
                    const normalizedEmail = email.toLowerCase();
                    const combinedKey = `${ip}:${normalizedEmail}`;
                    const loginLimitResult = await checkRateLimit(
                        combinedKey,
                        loginLimiter
                    );
                    if (!loginLimitResult.success) {
                        return rateLimitResponse(loginLimitResult.reset);
                    }
                }
            } catch {
                // If form data parsing fails (e.g., body already consumed, or not form data),
                // continue with IP-only limiting which is already applied above
                // This handles OAuth callbacks and other non-credentials requests gracefully
            }
        }
    } catch (error) {
        // If rate limiting fails, log but continue (graceful degradation)
        console.error("Rate limiting check failed:", error);
    }

    try {
        return await originalPOST(req);
    } finally {
        clearCurrentRequestHeaders();
    }
};

export const { GET, POST } = handlers;
