import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Login rate limiter: 5 attempts per 15 minutes per IP+email combination
// Also has a global limit: 20 attempts per hour per IP
export const loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/login",
});

export const loginGlobalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/login-global",
});

// Signup rate limiter: 5 attempts per hour per IP
export const signupLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/signup",
});

// Password reset rate limiter: 3 attempts per hour per email
export const passwordResetLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(3, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/password-reset",
});

// Resend verification email rate limiter: 3 attempts per hour per email
export const resendVerificationLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(3, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/resend-verification",
});

// New password (token-based) rate limiter: 5 attempts per hour per token
export const newPasswordLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/new-password",
});

// General API rate limiter: 100 requests per minute per IP
export const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/api",
});

/**
 * Extract client IP from request headers
 * Handles x-forwarded-for (can contain multiple IPs) and x-real-ip
 */
export function getClientIp(headers: Headers): string {
    // Check x-forwarded-for header (first IP is the original client)
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
        const firstIp = forwardedFor.split(",")[0]?.trim();
        if (firstIp) {
            return firstIp;
        }
    }

    // Check x-real-ip header
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }

    // Fallback: return a default identifier (will use stricter limits)
    return "unknown";
}

/**
 * Check rate limit and return result
 */
export async function checkRateLimit(
    identifier: string,
    limiter: Ratelimit
): Promise<{ success: boolean; remaining: number; reset: number }> {
    try {
        const result = await limiter.limit(identifier);
        return {
            success: result.success,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error) {
        // Graceful degradation: if Redis is unavailable, allow request through
        console.error("Rate limit check failed:", error);
        return {
            success: true,
            remaining: 0,
            reset: Date.now() + 60000, // 1 minute from now
        };
    }
}

/**
 * Create a 429 Too Many Requests response with Retry-After header
 */
export function rateLimitResponse(reset: number): Response {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return new Response(
        JSON.stringify({
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter,
        }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": retryAfter.toString(),
            },
        }
    );
}
