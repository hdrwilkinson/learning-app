import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    // 1. Static/API: Allow pass-through
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // 2. Unauthenticated users
    if (!isLoggedIn) {
        // Allow access to login, signup, error, reset-password, and new-password pages
        if (
            pathname.startsWith("/auth/login") ||
            pathname.startsWith("/auth/signup") ||
            pathname.startsWith("/auth/error") ||
            pathname.startsWith("/auth/reset-password") ||
            pathname.startsWith("/auth/new-password")
        ) {
            return NextResponse.next();
        }
        // Redirect all other unauthenticated requests to login
        const url = nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // 3. Authenticated users
    const user = req.auth?.user;
    const isMissingInfo = !user?.dateOfBirth || !user?.country;

    // Incomplete Profile
    if (isMissingInfo) {
        // Allow access to onboarding and signout
        if (
            pathname.startsWith("/auth/onboarding") ||
            pathname.startsWith("/auth/signout")
        ) {
            return NextResponse.next();
        }
        // Redirect everything else to onboarding
        const url = nextUrl.clone();
        url.pathname = "/auth/onboarding";
        return NextResponse.redirect(url);
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
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
