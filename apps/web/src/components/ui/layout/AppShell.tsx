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

// Routes that should hide the right accessory panel
const noAccessoryRoutes = ["/explore"];

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const isFullscreenRoute = fullscreenRoutes.some((route) =>
        pathname?.startsWith(route)
    );
    const showAccessory = !noAccessoryRoutes.some((route) =>
        pathname?.startsWith(route)
    );

    // For fullscreen routes, render children directly without navigation
    if (isFullscreenRoute) {
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
                {/* Secondary Nav as Header - Fixed at top (hidden for noAccessory routes) */}
                {showAccessory && (
                    <div className="bg-background flex-shrink-0 border-b border-border">
                        <SecondaryNav />
                    </div>
                )}

                {/* Email Verification Banner - Below nav, at top of scrollable content */}
                <EmailVerificationBanner />

                {/* Main Content - Scrollable (or flex for focus routes), centered with padding */}
                <main
                    className={
                        showAccessory
                            ? "flex-1 overflow-y-auto flex flex-col items-center min-h-0 p-4 md:p-6"
                            : "flex-1 min-h-0 flex flex-col"
                    }
                >
                    <div
                        className={
                            showAccessory ? "w-full max-w-4xl" : "w-full h-full"
                        }
                    >
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation - Fixed at bottom */}
                <div className="md:hidden flex-shrink-0">
                    <MobileNav />
                </div>
            </div>

            {/* Desktop Layout - Whole page scroll with centered content */}
            <div className="hidden lg:block min-h-screen bg-background">
                {/* Main Wrapper - Offset by sidebar, centers content */}
                <div
                    className={
                        showAccessory
                            ? "ml-64 flex flex-col"
                            : "ml-64 flex flex-col h-screen"
                    }
                >
                    {/* Email Verification Banner - Fixed at top, above content/accessory divide */}
                    <EmailVerificationBanner />
                    {/* Content Wrapper - Centers content with padding */}
                    <div
                        className={
                            showAccessory
                                ? "flex justify-center px-6 pt-8 pb-6"
                                : "flex-1 min-h-0 flex flex-col"
                        }
                    >
                        {/* Content Container - Max width with flex layout */}
                        <div
                            className={
                                showAccessory
                                    ? "flex gap-6 w-full max-w-[1056px] items-start"
                                    : "flex-1 min-h-0 flex flex-col"
                            }
                        >
                            {/* Main Content Column - Fills width, aligned to top */}
                            <main
                                className={
                                    showAccessory
                                        ? "flex-1 min-w-0 w-full pt-2"
                                        : "flex-1 min-h-0 w-full"
                                }
                            >
                                {children}
                            </main>

                            {/* Accessory Section - Sticky on right (hidden on certain routes) */}
                            {showAccessory && (
                                <div className="sticky top-8 self-start">
                                    <AccessorySection />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
