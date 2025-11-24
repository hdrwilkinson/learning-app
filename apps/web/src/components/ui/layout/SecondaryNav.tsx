"use client";

import { SettingsMenu } from "@/components/ui/molecules/SettingsMenu/SettingsMenu";

export function SecondaryNav() {
    return (
        <div className="flex h-20 items-center justify-end px-6 md:px-8 w-full">
            <SettingsMenu />
        </div>
    );
}
