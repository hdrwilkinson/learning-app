/**
 * LearnChat Component
 *
 * Chat interface for learning mode where users are introduced to
 * information points through AI-guided conversation.
 *
 * Mirrors ExploreChat structure - just the chat interface without layout.
 * The "I understand" button is in LearnChatLayout (like "New Chat" in ExploreChatLayout).
 */

"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { cn } from "@/lib/utils";
import type { LearnOptions } from "@/lib/ai/agents";
import {
    ChatMessage,
    FloatingChatInput,
    getMessageContent,
    getToolInvocations,
} from "@/features/chat";
import { Button } from "@/components/ui/shadcn/button";
import { HiLightBulb } from "react-icons/hi";
import type { LearnChatProps } from "../../../types";

export function LearnChat({ ip, courseId, className }: LearnChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    // Build learn mode options from the IP
    const options: LearnOptions = {
        courseId,
        lessonId: ip.lesson.id,
        informationPointId: ip.id,
        ipTitle: ip.title,
        ipContent: ip.content,
        lessonTitle: ip.lesson.title,
        lessonDescription: ip.lesson.description ?? undefined,
        prerequisites: ip.prerequisites,
    };

    // Generate a unique chat ID for this learning session
    const [chatId] = useState(() => `learn-${ip.id}-${Date.now()}`);

    // Initial message to introduce the IP (using AI SDK v6 parts format)
    const initialMessages: UIMessage[] = [
        {
            id: "intro",
            role: "assistant",
            parts: [
                {
                    type: "text",
                    text: `Let's learn about **${ip.title}**.\n\n${ip.content}\n\nTake a moment to read this. Feel free to ask me any questions, or let me know when you're ready to confirm your understanding!`,
                },
            ],
        },
    ];

    // AI SDK useChat hook for learn mode
    const { messages, sendMessage, status, error, stop } = useChat({
        id: chatId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: "/api/chat",
            prepareSendMessagesRequest({ messages: currentMessages }) {
                return {
                    body: {
                        messages: currentMessages,
                        mode: "learn",
                        options,
                    },
                };
            },
        }),
    } as Parameters<typeof useChat>[0]);

    const isLoading = status === "streaming" || status === "submitted";

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * Handle form submission.
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (isLoading) {
            stop();
        }

        sendMessage({ text: input });
        setInput("");
    };

    /**
     * Handle stop button click.
     */
    const handleStop = () => {
        stop();
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Messages area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p className="text-center text-sm">
                            Loading concept...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-3xl mx-auto">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.id}
                                role={message.role as "user" | "assistant"}
                                content={getMessageContent(message)}
                                mode="learn"
                                toolInvocations={getToolInvocations(message)}
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

            {/* Input area */}
            <FloatingChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onStop={handleStop}
                isLoading={isLoading}
                placeholder="Ask a question about this concept..."
                actions={
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        onClick={() =>
                            sendMessage({ text: "Can you give me an example?" })
                        }
                        disabled={isLoading}
                    >
                        <HiLightBulb className="h-4 w-4" />
                        <span className="hidden sm:inline">Example</span>
                    </Button>
                }
            />
        </div>
    );
}
