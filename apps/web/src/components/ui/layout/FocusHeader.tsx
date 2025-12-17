/**
 * FocusHeader Component
 *
 * Header for focused experiences (chat, quiz, etc.) with back navigation,
 * title, and customizable action buttons.
 */

"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface FocusHeaderProps {
    /** Title displayed in the header */
    title: string;
    /** Optional icon displayed before the title */
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
    return (
        <header
            className={cn(
                "flex items-center justify-between px-4 py-3 flex-shrink-0",
                className
            )}
        >
            {/* Left side: Back button + Title */}
            <div className="flex items-center gap-3">
                <Link
                    href={backHref}
                    className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-surface-1 transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Go back"
                >
                    <HiArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                    {icon && <span className="text-xl">{icon}</span>}
                    <h1 className="text-lg font-semibold text-foreground">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right side: Actions */}
            {actions && (
                <div className="flex items-center gap-2">{actions}</div>
            )}
        </header>
    );
}
