"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { OnboardingCheck } from "@/components/auth/onboarding-check";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <TooltipProvider>
                    <OnboardingCheck />
                    {children}
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
