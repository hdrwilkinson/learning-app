"use client";

import * as React from "react";
import { HiCog } from "react-icons/hi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import { BaseSettingsContent } from "./BaseSettingsContent";

export function SettingsMenu() {
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled aria-label="Settings">
                <HiCog className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <HiCog className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <BaseSettingsContent mounted={mounted} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
