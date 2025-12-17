/**
 * Chat Component
 *
 * Main chat interface component using AI SDK v6 useChat hook.
 * Adapts to different modes (learn, quiz, curiosity, reflection).
 *
 * Layout structure:
 * - Messages area: flex-1 with overflow-y-auto for independent scrolling
 * - Input area: flex-shrink-0, always visible at bottom
 *
 * @see docs/features/specifications/learning-interaction-modes.md
 */

"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/utils";
import type {
    ChatMode,
    LearnOptions,
    QuizOptions,
    CuriosityOptions,
    ReflectionOptions,
} from "@/lib/ai/agents";
import { ChatMessage } from "./ChatMessage";
import { FloatingChatInput } from "./FloatingChatInput";
import { ChatActions } from "./ChatActions";

/**
 * Mode-specific configuration.
 */
const modeConfig: Record<
    ChatMode,
    {
        icon: string;
        label: string;
        colorClass: string;
        placeholder: string;
    }
> = {
    learn: {
        icon: "📖",
        label: "Learning",
        colorClass: "text-secondary",
        placeholder: "Ask about this concept...",
    },
    quiz: {
        icon: "❓",
        label: "Quiz",
        colorClass: "text-accent-gold",
        placeholder: "Type your answer...",
    },
    curiosity: {
        icon: "🔮",
        label: "Explore",
        colorClass: "text-primary",
        placeholder: "What would you like to explore?",
    },
    reflection: {
        icon: "💡",
        label: "Let's understand this",
        colorClass: "text-accent",
        placeholder: "Ask questions about this concept...",
    },
};

interface ChatProps {
    /** Current chat mode */
    mode: ChatMode;
    /** Mode-specific options/context */
    options: LearnOptions | QuizOptions | CuriosityOptions | ReflectionOptions;
    /** Called when a mode-specific action is triggered */
    onAction?: (action: string) => void;
    /** Optional class name for the container */
    className?: string;
}

export function Chat({ mode, options, onAction, className }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const config = modeConfig[mode];

    // Local input state (v6 no longer manages this)
    const [input, setInput] = useState("");

    // AI SDK v6 useChat hook with transport-based architecture
    const { messages, sendMessage, status, error, stop } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
            body: {
                mode,
                options,
            },
        }),
    });

    const isLoading = status === "streaming" || status === "submitted";

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * Handle form submission.
     * If AI is currently streaming, stop it first then send the new message.
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Stop any current stream before sending new message
        if (isLoading) {
            stop();
        }

        sendMessage({ text: input });
        setInput("");
    };

    /**
     * Handle stop button click.
     * Aborts the current AI stream.
     */
    const handleStop = () => {
        stop();
    };

    /**
     * Handle action button clicks.
     * Some actions inject messages, others trigger callbacks.
     */
    const handleAction = (action: string) => {
        // Handle common actions that inject user messages
        switch (action) {
            case "got-it":
                sendMessage({
                    text: "I got it, I understand this concept now.",
                });
                return;
            case "example":
                sendMessage({ text: "Can you show me an example?" });
                return;
            case "reflect":
                sendMessage({
                    text: "I'd like to understand this better before answering.",
                });
                return;
        }

        // Pass other actions to parent handler
        onAction?.(action);
    };

    /**
     * Handle tool-triggered actions (e.g., from follow-up question buttons).
     */
    const handleToolAction = (action: string, payload?: unknown) => {
        switch (action) {
            case "sendMessage":
                if (typeof payload === "string" && payload.trim()) {
                    sendMessage({ text: payload });
                }
                return;
        }
    };

    /**
     * Extract text content from UIMessage parts.
     */
    const getMessageContent = (message: (typeof messages)[number]): string => {
        if ("parts" in message && Array.isArray(message.parts)) {
            return message.parts
                .filter((part) => part.type === "text")
                .map((part) => (part as { type: "text"; text: string }).text)
                .join("");
        }
        return "";
    };

    /**
     * Extract tool invocations from UIMessage parts.
     * AI SDK v6 uses part.type format: "tool-{toolName}" (e.g., "tool-suggestFollowUpQuestions")
     */
    const getToolInvocations = (message: (typeof messages)[number]) => {
        if ("parts" in message && Array.isArray(message.parts)) {
            // Filter for tool parts - they start with "tool-" prefix
            const toolParts = message.parts.filter(
                (part) =>
                    typeof part.type === "string" &&
                    part.type.startsWith("tool-")
            );
            if (toolParts.length === 0) return undefined;

            return toolParts.map((part) => {
                // Cast through unknown to handle the complex union type
                const toolPart = part as unknown as {
                    type: string;
                    state: string;
                    input?: Record<string, unknown>;
                    output?: unknown;
                    errorText?: string;
                };

                // Extract tool name from type (e.g., "tool-suggestFollowUpQuestions" -> "suggestFollowUpQuestions")
                const toolName = toolPart.type.replace("tool-", "");

                // Map AI SDK v6 states to our internal states
                // AI SDK v6: "input-available" | "output-available" | "output-error"
                let state: "pending" | "result" = "pending";
                if (toolPart.state === "output-available") {
                    state = "result";
                }

                return {
                    toolName,
                    state,
                    args: toolPart.input,
                    result: toolPart.output,
                };
            });
        }
        return undefined;
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Messages area - scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p className="text-center text-sm">
                            Start a conversation...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-3xl mx-auto">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.id}
                                role={message.role as "user" | "assistant"}
                                content={getMessageContent(message)}
                                mode={mode}
                                toolInvocations={getToolInvocations(message)}
                                onAction={handleToolAction}
                                isLastMessage={index === messages.length - 1}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Error display */}
            {error && (
                <div className="mx-4 mb-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive max-w-3xl mx-auto">
                    {error.message || "An error occurred. Please try again."}
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                    Thinking...
                </div>
            )}

            {/* Input area with actions - fixed at bottom */}
            <FloatingChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onStop={handleStop}
                isLoading={isLoading}
                placeholder={config.placeholder}
                actions={
                    <ChatActions
                        mode={mode}
                        onAction={handleAction}
                        disabled={isLoading}
                    />
                }
            />
        </div>
    );
}
