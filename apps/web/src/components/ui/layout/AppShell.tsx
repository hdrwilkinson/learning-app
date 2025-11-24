"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { SecondaryNav } from "./SecondaryNav";
import { AccessorySection } from "./AccessorySection";

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
        <div className="fixed inset-0 lg:relative lg:inset-auto overflow-hidden lg:overflow-visible bg-background flex flex-col lg:block lg:min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
                <MobileNav />
            </div>

            {/* Main Content Area */}
            <div className="md:ml-16 lg:ml-64 lg:mr-80 pb-16 md:pb-0 flex flex-col lg:block flex-1 lg:flex-none h-full lg:h-auto overflow-hidden lg:overflow-visible">
                {/* Accessory Section - Top Bar on Tablet/Mobile, Right Column on Desktop */}
                <div className="lg:hidden bg-background flex-shrink-0">
                    {/* Secondary Nav as Top Bar on Tablet/Mobile */}
                    <SecondaryNav />
                </div>

                {/* Content Section */}
                <main className="flex-1 overflow-y-auto lg:overflow-visible lg:h-auto">
                    {children}
                </main>

                {/* Accessory Section - Right Column on Desktop */}
                <AccessorySection />
            </div>
        </div>
    );
}
