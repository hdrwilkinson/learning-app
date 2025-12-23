/**
 * LearnChatLayout Component
 *
 * Client component wrapper for the FocusLayout.
 * Mirrors ExploreChatLayout structure for learning mode with:
 * - IP title with emoji (non-editable)
 * - Progress indicator (1 of 3)
 * - "I understand" button in actions
 * - Back link to course page
 */

"use client";

import { type ReactNode } from "react";
import { FocusLayout } from "@/components/ui/layout";
import { Button } from "@/components/ui/shadcn/button";
import { HiCheck } from "react-icons/hi";

export interface LearnChatLayoutProps {
    /** Main content */
    children: ReactNode;
    /** Course ID for back navigation */
    courseId: string;
    /** Information point title */
    ipTitle: string;
    /** Current position in session (1-based) */
    currentIndex: number;
    /** Total IPs in session */
    totalCount: number;
    /** Callback when user clicks "I understand" */
    onUnderstand: () => void;
    /** Whether the understand action is in progress */
    isLoading?: boolean;
}

export function LearnChatLayout({
    children,
    courseId,
    ipTitle,
    currentIndex,
    totalCount,
    onUnderstand,
    isLoading = false,
}: LearnChatLayoutProps) {
    // Build the title component - mirrors ExploreChatLayout structure
    const titleComponent = (
        <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground leading-tight">
                    {ipTitle}
                </h1>
                <span className="text-xs text-muted-foreground">
                    {currentIndex} of {totalCount}
                </span>
            </div>
        </div>
    );

    // Build the actions - "I understand" button instead of New Chat + Settings
    const actions = (
        <div className="flex items-center gap-1">
            <Button
                variant="default"
                size="sm"
                onClick={onUnderstand}
                disabled={isLoading}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
                <HiCheck className="h-4 w-4" />
                <span className="hidden sm:inline">
                    {isLoading ? "Saving..." : "I understand"}
                </span>
            </Button>
        </div>
    );

    return (
        <FocusLayout
            title={titleComponent}
            backHref={`/courses/${courseId}`}
            actions={actions}
        >
            {children}
        </FocusLayout>
    );
}
