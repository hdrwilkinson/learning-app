/**
 * ChatSettingsDropdown Component
 *
 * A three-dot menu for chat-specific actions and general settings.
 * Displayed in the Explore chat header.
 * Includes delete chat option and base settings (theme, profile, logout).
 */

"use client";

import * as React from "react";
import { HiCog, HiTrash } from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BaseSettingsContent } from "@/components/ui/molecules/SettingsMenu";

export interface ChatSettingsDropdownProps {
    /** Callback when delete is clicked */
    onDelete?: () => void;
    /** Whether actions are disabled */
    disabled?: boolean;
}

export function ChatSettingsDropdown({
    onDelete,
    disabled = false,
}: ChatSettingsDropdownProps) {
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch for BaseSettingsContent
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    aria-label="Settings"
                >
                    <HiCog className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {/* Chat-specific actions */}
                {onDelete && (
                    <>
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-destructive focus:text-destructive"
                        >
                            <HiTrash className="mr-2 h-4 w-4" />
                            Delete Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Base settings (Theme, Profile, Logout) */}
                <BaseSettingsContent mounted={mounted} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
