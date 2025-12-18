/**
 * ExploreChat Component
 *
 * Chat interface for Explore/Curiosity mode.
 * Following AI SDK v6 chatbot message persistence pattern:
 * - Receives initial messages from Server Component via `messages` prop
 * - Sends only the last message to the server
 * - Server handles loading previous messages and saving
 * - Supports lazy chat creation (no id = new chat mode)
 *
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 */

"use client";

import {
    useRef,
    useEffect,
    useState,
    useCallback,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { generateId, DefaultChatTransport, type UIMessage } from "ai";
import { cn } from "@/lib/utils";
import type { CuriosityOptions } from "@/lib/ai/agents";
import {
    ChatMessage,
    FloatingChatInput,
    ChatActions,
    getMessageContent,
    getToolInvocations,
} from "@/features/chat";

export interface ExploreChatProps {
    /** Conversation ID - undefined for new chat (lazy creation) */
    id?: string;
    /** Initial messages loaded by Server Component */
    initialMessages?: UIMessage[];
    /** Additional class name */
    className?: string;
}

export function ExploreChat({
    id,
    initialMessages = [],
    className,
}: ExploreChatProps) {
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Local input state
    const [input, setInput] = useState("");

    // Track if this is a new chat (no ID provided) - we'll create it lazily
    const isNewChat = !id;

    // Generate a stable chat ID for new chats (used until server confirms)
    const [chatId] = useState(() => id || generateId());

    // Track if we need to redirect after response (use ref to avoid stale closure)
    const shouldRedirectRef = useRef(false);

    // Curiosity mode options
    const options: CuriosityOptions = {
        courseId: undefined,
        courseTitle: undefined,
        courseDescription: undefined,
        completedTopics: [],
        progress: undefined,
    };

    // AI SDK v6 useChat hook
    // Uses `messages` prop (not initialMessages) per v6 API
    // Uses prepareSendMessagesRequest to send only the last message
    // Server loads previous messages from DB and saves on completion
    const chatOptions = {
        id: chatId,
        messages: initialMessages, // Correct property name per AI SDK v6
        transport: new DefaultChatTransport({
            api: "/api/chat",
            // Only send the last message to the server
            // Server loads previous messages from database
            prepareSendMessagesRequest({ messages: currentMessages }) {
                return {
                    body: {
                        message: currentMessages[currentMessages.length - 1],
                        id: chatId,
                        isNewChat, // Tell server if this needs creation
                        mode: "curiosity",
                        options,
                    },
                };
            },
        }),
        // Handle redirect for new chats after first response
        onFinish: useCallback(() => {
            if (shouldRedirectRef.current) {
                // Redirect to the permanent URL after chat is created
                shouldRedirectRef.current = false;
                router.replace(`/explore/${chatId}`);
            }
        }, [chatId, router]),
    };

    const { messages, sendMessage, status, error, stop } = useChat(
        chatOptions as Parameters<typeof useChat>[0]
    );

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

        // For new chats, mark that we should redirect after response
        if (isNewChat) {
            shouldRedirectRef.current = true;
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

    /**
     * Handle action button clicks.
     */
    const handleAction = (action: string) => {
        switch (action) {
            case "new-topic":
                router.push("/explore");
                return;
        }
    };

    /**
     * Handle tool-triggered actions.
     */
    const handleToolAction = (action: string, payload?: unknown) => {
        if (
            action === "sendMessage" &&
            typeof payload === "string" &&
            payload.trim()
        ) {
            sendMessage({ text: payload });
        }
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Messages area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p className="text-center text-sm">
                            Start exploring any topic...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-3xl mx-auto">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.id}
                                role={message.role as "user" | "assistant"}
                                content={getMessageContent(message)}
                                mode="curiosity"
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

            {/* Input area */}
            <FloatingChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onStop={handleStop}
                isLoading={isLoading}
                placeholder="What would you like to explore?"
                actions={
                    <ChatActions
                        mode="curiosity"
                        onAction={handleAction}
                        disabled={isLoading}
                    />
                }
            />
        </div>
    );
}
