import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

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
    if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Check for onboarding completion
    if (session.user) {
        const isMissingInfo =
            !session.user.dateOfBirth || !session.user.country;
        const isOnboarding = pathname === "/onboarding";

        if (isMissingInfo && !isOnboarding) {
            const url = request.nextUrl.clone();
            url.pathname = "/onboarding";
            return NextResponse.redirect(url);
        }

        if (!isMissingInfo && isOnboarding) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
