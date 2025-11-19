"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function OnboardingCheck() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const isMissingInfo =
                !session.user.dateOfBirth || !session.user.country;
            const isOnboarding = pathname === "/auth/onboarding";

            if (isMissingInfo && !isOnboarding) {
                router.push("/auth/onboarding");
            }
        }
    }, [status, session, pathname, router]);

    return null;
}
