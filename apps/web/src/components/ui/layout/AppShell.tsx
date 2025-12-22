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

// Routes that should render in fullscreen mode (no sidebars)
const fullscreenRoutes = ["/auth"];

// Layout hierarchy:
// - DashboardLayout: Has accessory panel with widgets (default behavior below)
// - PageLayout: Base layout with gamification header (noAccessoryRoutes)
// - FocusLayout: Immersive experiences with back navigation (noAccessoryRoutes)

// Routes that should hide the right accessory panel (prefix match)
// Used by: FocusLayout (explore/chat experiences)
const noAccessoryRoutes = ["/explore"];

// Routes that should hide the right accessory panel (exact match only)
// Used by: PageLayout (listing/browse pages)
const exactNoAccessoryRoutes = ["/courses"];

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const isFullscreenRoute = fullscreenRoutes.some((route) =>
        pathname?.startsWith(route)
    );
    const isExactNoAccessoryRoute = exactNoAccessoryRoutes.includes(
        pathname ?? ""
    );
    const isPrefixNoAccessoryRoute = noAccessoryRoutes.some((route) =>
        pathname?.startsWith(route)
    );
    const showAccessory = !isExactNoAccessoryRoute && !isPrefixNoAccessoryRoute;

    // For fullscreen routes, render children directly without navigation
    if (isFullscreenRoute) {
        return <main className="min-h-screen bg-background">{children}</main>;
    }

    return (
        <>
            {/* Sidebar - Hidden on mobile, slim on tablet (64px), full on desktop (256px) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Bottom Navigation - Fixed at bottom, only on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
                <MobileNav />
            </div>

            {/* Main Content Area - Single container with responsive sidebar margins
                - Mobile: no left margin, bottom padding for MobileNav
                - Tablet: ml-16 (64px for slim sidebar)
                - Desktop: ml-64 (256px for full sidebar)
            */}
            <div className="fixed inset-0 md:ml-16 lg:ml-64 flex flex-col bg-background pb-16 md:pb-0">
                {/* Secondary Nav Header - Always shown for DashboardLayout (gamification stats + settings) */}
                {showAccessory && (
                    <div className="flex-shrink-0 px-4 md:px-6">
                        <SecondaryNav />
                    </div>
                )}

                {/* Email Verification Banner */}
                <EmailVerificationBanner />

                {/* Content Layout - Two modes: DashboardLayout (with accessory) or PageLayout/FocusLayout (full-height flex) */}
                {showAccessory ? (
                    /* DashboardLayout - Scrollable content with accessory panel on right */
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="flex justify-center px-4 md:px-6 py-4 lg:pt-8 lg:pb-6">
                            <div className="flex gap-6 w-full max-w-[1056px] items-start">
                                {/* Main Content Column */}
                                <main className="flex-1 min-w-0 w-full lg:pt-2">
                                    {children}
                                </main>

                                {/* Accessory Section - Desktop only (includes SecondaryNav on desktop) */}
                                <div className="hidden lg:block sticky top-8 self-start">
                                    <AccessorySection />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* PageLayout/FocusLayout - Full-height flex for pages without accessory panel */
                    <main className="flex-1 min-h-0 flex flex-col">
                        {children}
                    </main>
                )}
            </div>
        </>
    );
}
