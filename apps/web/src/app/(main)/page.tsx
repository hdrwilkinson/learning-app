/**
 * Home Page (Server Component)
 *
 * Protected page that requires authentication.
 * Redirects to login if user is not authenticated.
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HomePageContent } from "./_components/HomePageContent";

export default async function HomePage() {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    return <HomePageContent />;
}
