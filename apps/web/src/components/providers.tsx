"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { OnboardingCheck } from "@/components/auth/onboarding-check";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <OnboardingCheck />
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
