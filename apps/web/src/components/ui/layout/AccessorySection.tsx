"use client";

import {
    HiStar,
    HiLightningBolt,
    HiCheckCircle,
    HiSpeakerphone,
} from "react-icons/hi";
import { SecondaryNav } from "./SecondaryNav";

interface AccessorySectionProps {
    children?: React.ReactNode;
}

export function AccessorySection({ children }: AccessorySectionProps) {
    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-80">
            {/* Secondary Navigation at the top */}
            <div className="lg:z-40 lg:bg-background">
                <SecondaryNav />
            </div>

            {/* Accessory Content */}
            <div className="flex flex-col gap-4 py-6">
                {/* Leaderboard Card */}
                <div className="rounded-lg border border-border bg-surface-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                            Leaderboards
                        </h3>
                        <HiStar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                        Unlock leaderboards by completing your first lesson!
                    </p>
                    <button className="w-full text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                        Go to Leaderboards
                    </button>
                </div>

                {/* Daily Quests Card */}
                <div className="rounded-lg border border-border bg-surface-1 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                            Daily Quests
                        </h3>
                        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Quest 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HiLightningBolt className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm text-foreground">
                                        Earn 30 XP
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    30/30
                                </span>
                            </div>
                            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-yellow-500 rounded-full" />
                            </div>
                        </div>

                        {/* Quest 2 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HiCheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-foreground">
                                        Score 90% or higher in 2 lessons
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    1/2
                                </span>
                            </div>
                            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                <div className="h-full w-[50%] bg-yellow-500 rounded-full" />
                            </div>
                        </div>

                        {/* Quest 3 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HiSpeakerphone className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm text-foreground">
                                        Listen to 10 exercises
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    3/10
                                </span>
                            </div>
                            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                <div className="h-full w-[30%] bg-yellow-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Blog
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Store
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Efficacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Careers
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Investors
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>

                {/* Custom children content */}
                {children}
            </div>
        </aside>
    );
}
