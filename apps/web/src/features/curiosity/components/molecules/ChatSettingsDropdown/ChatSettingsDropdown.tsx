/**
 * ChatSettingsDropdown Component
 *
 * A three-dot menu for chat-specific actions and settings.
 * Displayed in the Explore chat header.
 */

"use client";

import { HiDotsVertical, HiCog, HiArchive, HiShare } from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

export interface ChatSettingsDropdownProps {
    /** Whether the chat can be archived */
    canArchive?: boolean;
    /** Callback when archive is clicked */
    onArchive?: () => void;
    /** Callback when share is clicked */
    onShare?: () => void;
    /** Callback when settings is clicked */
    onSettings?: () => void;
    /** Whether actions are disabled */
    disabled?: boolean;
}

export function ChatSettingsDropdown({
    canArchive = true,
    onArchive,
    onShare,
    onSettings,
    disabled = false,
}: ChatSettingsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    disabled={disabled}
                    aria-label="Chat options"
                >
                    <HiDotsVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {onShare && (
                    <DropdownMenuItem onClick={onShare}>
                        <HiShare className="mr-2 h-4 w-4" />
                        Share
                    </DropdownMenuItem>
                )}
                {canArchive && onArchive && (
                    <DropdownMenuItem onClick={onArchive}>
                        <HiArchive className="mr-2 h-4 w-4" />
                        Archive
                    </DropdownMenuItem>
                )}
                {(onShare || (canArchive && onArchive)) && onSettings && (
                    <DropdownMenuSeparator />
                )}
                {onSettings && (
                    <DropdownMenuItem onClick={onSettings}>
                        <HiCog className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
