/**
 * FocusLayout Component
 *
 * A layout for focused experiences (chat, quiz, etc.) that uses the main
 * sidebar but hides the right accessory panel. Content is displayed with
 * a flex column structure where:
 * - Header is fixed at top (flex-shrink-0)
 * - Content fills remaining space (flex-1)
 *
 * This component should be used within pages that are in the noAccessoryRoutes
 * list in AppShell.
 */

"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FocusHeader } from "./FocusHeader";

interface FocusLayoutProps {
    /** Title displayed in the header - can be string or ReactNode (e.g., EditableTitle) */
    title: string | ReactNode;
    /** Optional icon displayed before the title (only used with string titles) */
    icon?: ReactNode;
    /** URL to navigate back to (defaults to '/') */
    backHref?: string;
    /** Action buttons displayed on the right side of the header */
    actions?: ReactNode;
    /** Main content */
    children: ReactNode;
    /** Additional class name for the layout container */
    className?: string;
}

export function FocusLayout({
    title,
    icon,
    backHref = "/",
    actions,
    children,
    className,
}: FocusLayoutProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <FocusHeader
                title={title}
                icon={icon}
                backHref={backHref}
                actions={actions}
            />
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    );
}
