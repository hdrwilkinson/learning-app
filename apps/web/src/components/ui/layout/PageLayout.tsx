/**
 * PageLayout Component
 *
 * The base layout for standard pages that uses the main sidebar but hides
 * the right accessory panel. Features a top header with gamification stats
 * and settings menu.
 *
 * This is the most general-purpose layout, suitable for:
 * - Listing pages (courses, etc.)
 * - Browse experiences
 * - Any page that doesn't need the dashboard widgets or focused task UI
 *
 * Structure:
 * - Header with gamification stats (left) and SettingsMenu (right)
 * - Scrollable content area below
 *
 * Layout hierarchy:
 * - DashboardLayout: Has accessory panel with widgets (AppShell default)
 * - PageLayout: Base layout with gamification header (this component)
 * - FocusLayout: Immersive experiences with back navigation
 */

"use client";

import { type ReactNode } from "react";
import { HiFire, HiSparkles, HiGlobe } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "@/components/ui/molecules/SettingsMenu/SettingsMenu";

interface PageLayoutProps {
    /** Main content */
    children: ReactNode;
    /** Additional class name for the layout container */
    className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header with gamification stats and settings */}
            <header className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0">
                {/* Gamification Stats - Left Side */}
                <div className="flex items-center gap-4">
                    {/* Course Flag */}
                    <div className="flex items-center gap-2">
                        <HiGlobe className="h-5 w-5 text-foreground" />
                        <span className="text-sm font-medium text-foreground">
                            10
                        </span>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-2">
                        <HiFire className="h-5 w-5 text-orange-500" />
                        <span className="text-sm font-medium text-foreground">
                            196
                        </span>
                    </div>

                    {/* Gems */}
                    <div className="flex items-center gap-2">
                        <HiSparkles className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">
                            4795
                        </span>
                    </div>
                </div>

                {/* Settings Menu - Right Side */}
                <SettingsMenu />
            </header>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
        </div>
    );
}
