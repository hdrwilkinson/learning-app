import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    // Helper to create response with pathname header
    const nextWithPathname = () => {
        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    };

    // 1. Static/API: Allow pass-through
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname === "/favicon.ico"
    ) {
        return nextWithPathname();
    }

    // 2. Unauthenticated users
    if (!isLoggedIn) {
        // Allow access to login, signup, error, reset-password, new-password, verify-email, and resend-verification pages
        if (
            pathname.startsWith("/auth/login") ||
            pathname.startsWith("/auth/signup") ||
            pathname.startsWith("/auth/error") ||
            pathname.startsWith("/auth/reset-password") ||
            pathname.startsWith("/auth/new-password") ||
            pathname.startsWith("/auth/verify-email") ||
            pathname.startsWith("/auth/resend-verification")
        ) {
            return nextWithPathname();
        }
        // Redirect all other unauthenticated requests (including homepage "/") to login
        // This ensures homepage and all non-auth pages require authentication
        const url = nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // 3. Authenticated users
    const user = req.auth?.user;
    const isMissingInfo = !user?.dateOfBirth || !user?.country;
    const isEmailNotVerified = !user?.emailVerified;

    // Incomplete Profile
    if (isMissingInfo) {
        // Allow access to onboarding, signout, verify-email, and resend-verification
        if (
            pathname.startsWith("/auth/onboarding") ||
            pathname.startsWith("/auth/signout") ||
            pathname.startsWith("/auth/verify-email") ||
            pathname.startsWith("/auth/resend-verification")
        ) {
            return nextWithPathname();
        }
        // Redirect everything else to onboarding
        const url = nextUrl.clone();
        url.pathname = "/auth/onboarding";
        return NextResponse.redirect(url);
    }

    // Email not verified - allow access but show banner (handled by component)
    // Allow access to verification pages
    if (isEmailNotVerified) {
        if (
            pathname.startsWith("/auth/verify-email") ||
            pathname.startsWith("/auth/resend-verification") ||
            pathname.startsWith("/auth/signout")
        ) {
            return nextWithPathname();
        }
        // Allow access to other pages but banner will prompt verification
        // Don't redirect to avoid blocking user from seeing the banner
    }

    // Complete Profile
    // Redirect auth pages (login, signup, onboarding, reset-password, new-password) to home
    if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup") ||
        pathname.startsWith("/auth/onboarding") ||
        pathname.startsWith("/auth/reset-password") ||
        pathname.startsWith("/auth/new-password")
    ) {
        const url = nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // Allow everything else for complete profiles
    return nextWithPathname();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
