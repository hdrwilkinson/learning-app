import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    // Allow auth routes and public assets
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!isLoggedIn) {
        const url = nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Check for onboarding completion
    if (req.auth?.user) {
        // Note: In middleware (Edge), we might not have full user details if they aren't in the token.
        // We rely on the token strategy configured in auth.config.ts.
        // However, custom fields like dateOfBirth might not be available here unless we add them to the token in auth.config.ts
        // But auth.config.ts cannot access the DB to fetch them.
        // So we might need to skip this check in middleware and do it in a Layout or Client Component,
        // OR we accept that we can't enforce onboarding in middleware without DB access.
        // For now, let's rely on the client-side OnboardingCheck for the profile completion,
        // and use middleware mainly for authentication protection.
        // If we really need it here, we'd need to fetch it from an API, but that's expensive in middleware.
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
