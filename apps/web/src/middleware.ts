import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    // Allow auth routes and public assets
    // Note: /auth/* covers login, signup, onboarding, error
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/auth") || // Covers /auth/login, /auth/signup, /auth/onboarding
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!isLoggedIn) {
        const url = nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // Check for onboarding completion (Prevent Homepage Flash)
    // req.auth.user should contain the session data from the JWT
    if (isLoggedIn && req.auth?.user) {
        const user = req.auth.user;
        const isMissingInfo = !user.dateOfBirth || !user.country;

        // If missing info and NOT already on the onboarding page (or other auth pages), redirect
        if (isMissingInfo && !pathname.startsWith("/auth/onboarding")) {
            const url = nextUrl.clone();
            url.pathname = "/auth/onboarding";
            return NextResponse.redirect(url);
        }

        // If has info and IS on onboarding, redirect to home
        if (!isMissingInfo && pathname.startsWith("/auth/onboarding")) {
            const url = nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
