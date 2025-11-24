"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { SecondaryNav } from "./SecondaryNav";
import { AccessorySection } from "./AccessorySection";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const isAuthRoute = pathname?.startsWith("/auth");

    // For auth routes, render children directly without navigation
    if (isAuthRoute) {
        return <main className="min-h-screen bg-background">{children}</main>;
    }

    return (
        <>
            {/* Desktop Sidebar - Fixed on left */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile/Tablet Layout - Fixed viewport with container scroll */}
            <div className="fixed inset-0 lg:hidden md:ml-16 flex flex-col overflow-hidden bg-background">
                {/* Secondary Nav as Header - Fixed at top */}
                <div className="bg-background flex-shrink-0 border-b border-border">
                    <SecondaryNav />
                </div>

                {/* Email Verification Banner - Below nav, at top of scrollable content */}
                <EmailVerificationBanner />

                {/* Main Content - Scrollable, centered with padding */}
                <main className="flex-1 overflow-y-auto flex flex-col items-center min-h-0 p-4 md:p-6">
                    <div className="w-full max-w-4xl">{children}</div>
                </main>

                {/* Mobile Bottom Navigation - Fixed at bottom */}
                <div className="md:hidden flex-shrink-0">
                    <MobileNav />
                </div>
            </div>

            {/* Desktop Layout - Whole page scroll with centered content */}
            <div className="hidden lg:block min-h-screen bg-background">
                {/* Main Wrapper - Offset by sidebar, centers content */}
                <div className="ml-64 flex flex-col">
                    {/* Email Verification Banner - Fixed at top, above content/accessory divide */}
                    <EmailVerificationBanner />
                    {/* Content Wrapper - Centers content with padding */}
                    <div className="flex justify-center px-6 pt-8 pb-6">
                        {/* Content Container - Max width with flex layout */}
                        <div className="flex gap-6 w-full max-w-[1056px] items-start">
                            {/* Main Content Column - Fills width, aligned to top */}
                            <main className="flex-1 min-w-0 w-full pt-2">
                                {children}
                            </main>

                            {/* Accessory Section - Sticky on right */}
                            <div className="sticky top-8 self-start">
                                <AccessorySection />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
