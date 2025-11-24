"use client";

import { HiFire, HiSparkles, HiGlobe } from "react-icons/hi";
import { SettingsMenu } from "@/components/ui/molecules/SettingsMenu/SettingsMenu";

export function SecondaryNav() {
    return (
        <div className="flex h-16 items-center justify-between px-6 lg:px-0 w-full">
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
        </div>
    );
}
