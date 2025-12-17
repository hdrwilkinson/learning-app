/**
 * FocusHeader Component
 *
 * Header for focused experiences (chat, quiz, etc.) with back navigation,
 * title, and customizable action buttons.
 *
 * Supports both string titles (rendered as h1) and ReactNode titles
 * (for editable titles or custom components).
 */

"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface FocusHeaderProps {
    /** Title displayed in the header - can be string or ReactNode (e.g., EditableTitle) */
    title: string | ReactNode;
    /** Optional icon displayed before the title (only used with string titles) */
    icon?: ReactNode;
    /** URL to navigate back to (defaults to '/') */
    backHref?: string;
    /** Action buttons displayed on the right side */
    actions?: ReactNode;
    /** Additional class name for the header */
    className?: string;
}

export function FocusHeader({
    title,
    icon,
    backHref = "/",
    actions,
    className,
}: FocusHeaderProps) {
    const isStringTitle = typeof title === "string";

    return (
        <header
            className={cn(
                "flex items-center justify-between px-4 py-3 flex-shrink-0",
                className
            )}
        >
            {/* Left side: Back button + Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link
                    href={backHref}
                    className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-surface-1 transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                    aria-label="Go back"
                >
                    <HiArrowLeft className="h-5 w-5" />
                </Link>
                {isStringTitle ? (
                    <div className="flex items-center gap-2 min-w-0">
                        {icon && (
                            <span className="text-xl flex-shrink-0">
                                {icon}
                            </span>
                        )}
                        <h1 className="text-lg font-semibold text-foreground truncate">
                            {title}
                        </h1>
                    </div>
                ) : (
                    <div className="min-w-0 flex-1">{title}</div>
                )}
            </div>

            {/* Right side: Actions */}
            {actions && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    {actions}
                </div>
            )}
        </header>
    );
}
