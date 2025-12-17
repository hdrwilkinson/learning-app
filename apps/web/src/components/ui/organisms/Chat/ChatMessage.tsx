/**
 * ChatMessage Component
 *
 * Renders individual chat messages with role-based styling.
 * Uses Streamdown for markdown rendering in AI responses.
 */

"use client";

import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";
import type { ChatMode } from "@/lib/ai/agents";

/**
 * Mode-specific styling for user message bubbles.
 */
const modeStyles: Record<ChatMode, string> = {
    learn: "bg-secondary",
    quiz: "bg-accent-gold",
    curiosity: "bg-primary",
    reflection: "bg-accent",
};

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    mode: ChatMode;
    /** Tool invocations in this message (if any) */
    toolInvocations?: Array<{
        toolName: string;
        state: "pending" | "result";
        args?: Record<string, unknown>;
        result?: unknown;
    }>;
}

export function ChatMessage({
    role,
    content,
    mode,
    toolInvocations,
}: ChatMessageProps) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";

    return (
        <div className="w-full py-2">
            {/* User message - bubble style with mode-specific colors */}
            {isUser && (
                <div className="max-w-[85%]">
                    <div
                        className={cn(
                            "inline-block rounded-2xl rounded-bl-md px-4 py-2.5 text-primary-foreground",
                            modeStyles[mode]
                        )}
                    >
                        <p className="whitespace-pre-wrap m-0">{content}</p>
                    </div>
                </div>
            )}

            {/* Assistant message - clean text with markdown */}
            {isAssistant && (
                <div>
                    {/* Message content with Streamdown markdown rendering */}
                    <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-3 prose-code:text-accent">
                        <Streamdown>{content}</Streamdown>
                    </div>

                    {/* Tool invocations */}
                    {toolInvocations && toolInvocations.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {toolInvocations.map((invocation, index) => (
                                <ToolInvocation key={index} {...invocation} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Renders a tool invocation within a message.
 */
function ToolInvocation({
    toolName,
    state,
    result,
}: {
    toolName: string;
    state: "pending" | "result";
    args?: Record<string, unknown>;
    result?: unknown;
}) {
    const getResultMessage = (): string => {
        if (!result) return "Action completed";
        if (
            typeof result === "object" &&
            result !== null &&
            "message" in result
        ) {
            return String((result as { message: string }).message);
        }
        return "Action completed";
    };

    const resultMessage = getResultMessage();

    return (
        <div className="rounded-lg bg-surface-2/50 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                    {formatToolName(toolName)}
                </span>
                {state === "pending" && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                        Running...
                    </span>
                )}
                {state === "result" && (
                    <span className="text-accent">✓ Complete</span>
                )}
            </div>
            {state === "result" && result !== undefined && (
                <div className="mt-1 text-muted-foreground">
                    {resultMessage}
                </div>
            )}
        </div>
    );
}

/**
 * Format tool name for display.
 */
function formatToolName(name: string): string {
    return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}
