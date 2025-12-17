/**
 * ChatActions Component
 *
 * Mode-specific action buttons that appear below the chat input.
 * Actions vary based on the current chat mode.
 */

"use client";

import { cn } from "@/lib/utils";
import type { ChatMode } from "@/lib/ai/agents";

interface ChatActionsProps {
    mode: ChatMode;
    /** Called when an action is triggered */
    onAction?: (action: string) => void;
    /** Whether actions are disabled */
    disabled?: boolean;
}

/**
 * Action definitions per mode.
 */
const modeActions: Record<
    ChatMode,
    Array<{
        id: string;
        label: string;
        variant: "primary" | "secondary" | "ghost";
        icon?: string;
    }>
> = {
    learn: [
        { id: "next", label: "Next", variant: "primary", icon: "→" },
        { id: "got-it", label: "I got it", variant: "secondary", icon: "✓" },
        { id: "example", label: "Show example", variant: "ghost" },
    ],
    quiz: [
        { id: "submit", label: "Submit Answer", variant: "primary" },
        { id: "reflect", label: "Reflect", variant: "secondary", icon: "💡" },
        { id: "skip", label: "Skip", variant: "ghost" },
    ],
    curiosity: [{ id: "new-topic", label: "New Topic", variant: "ghost" }],
    reflection: [
        {
            id: "return",
            label: "Return to Quiz",
            variant: "primary",
            icon: "←",
        },
        { id: "exit", label: "Exit Quiz", variant: "ghost" },
    ],
};

export function ChatActions({
    mode,
    onAction,
    disabled = false,
}: ChatActionsProps) {
    const actions = modeActions[mode];

    if (!actions || actions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction?.(action.id)}
                    disabled={disabled}
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
                        "transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        // Variant styles
                        action.variant === "primary" && [
                            "bg-primary text-primary-foreground",
                            "hover:bg-primary/90",
                        ],
                        action.variant === "secondary" && [
                            "bg-surface-2 text-foreground border border-border",
                            "hover:bg-surface-3",
                        ],
                        action.variant === "ghost" && [
                            "text-muted-foreground",
                            "hover:bg-surface-2 hover:text-foreground",
                        ]
                    )}
                >
                    {action.icon && <span>{action.icon}</span>}
                    {action.label}
                </button>
            ))}
        </div>
    );
}
