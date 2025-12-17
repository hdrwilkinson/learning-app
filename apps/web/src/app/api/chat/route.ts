/**
 * Chat API Route
 *
 * Single endpoint for all chat modes. Uses AI SDK v6 streamText
 * with mode-specific system prompts.
 *
 * For curiosity mode, follows the AI SDK v6 chatbot message persistence pattern:
 * - Accepts only the last message from client (previous messages loaded from DB)
 * - Saves messages via onFinish callback
 * - Uses consumeStream() to handle client disconnects
 *
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import {
    convertToModelMessages,
    createIdGenerator,
    streamText,
    type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { gemini } from "@/lib/ai/config";
import {
    learnTools,
    quizTools,
    curiosityTools,
    reflectionTools,
} from "@/lib/ai/tools";
import { buildLearnPrompt } from "@/lib/ai/agents/learn/prompt";
import { buildQuizPrompt } from "@/lib/ai/agents/quiz/prompt";
import { buildCuriosityPrompt } from "@/lib/ai/agents/curiosity/prompt";
import { buildReflectionPrompt } from "@/lib/ai/agents/reflection/prompt";
import type {
    ChatMode,
    LearnOptions,
    QuizOptions,
    CuriosityOptions,
    ReflectionOptions,
} from "@/lib/ai/agents";
import { loadChat, saveChat, getChat, updateChatTitle } from "@/lib/chat";
import { generateTitle } from "./generate-title";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Request body shape for the chat endpoint.
 *
 * For curiosity mode with persistence:
 * - `message`: The single new message from the user
 * - `id`: The conversation ID for loading/saving
 * - `isNewChat`: Whether this is a new chat (needs creation)
 *
 * For other modes (legacy):
 * - `messages`: Full message history
 */
interface ChatRequestBody {
    // New pattern (curiosity mode with persistence)
    message?: UIMessage;
    id?: string;
    isNewChat?: boolean;
    // Legacy pattern (other modes)
    messages?: UIMessage[];
    // Common
    mode: ChatMode;
    options: LearnOptions | QuizOptions | CuriosityOptions | ReflectionOptions;
}

/**
 * Get the system prompt for the given mode and options.
 */
function getSystemPrompt(
    mode: ChatMode,
    options: ChatRequestBody["options"]
): string {
    switch (mode) {
        case "learn":
            return buildLearnPrompt(options as LearnOptions);
        case "quiz":
            return buildQuizPrompt(options as QuizOptions);
        case "curiosity":
            return buildCuriosityPrompt(options as CuriosityOptions);
        case "reflection":
            return buildReflectionPrompt(options as ReflectionOptions);
        default:
            return "You are a helpful learning assistant.";
    }
}

/**
 * Get the tools for the given mode.
 */
function getTools(mode: ChatMode) {
    switch (mode) {
        case "learn":
            return learnTools;
        case "quiz":
            return quizTools;
        case "curiosity":
            return curiosityTools;
        case "reflection":
            return reflectionTools;
        default:
            return {};
    }
}

/**
 * POST /api/chat
 *
 * Handles chat messages for all modes (learn, quiz, curiosity, reflection).
 * The mode and options determine the system prompt and available tools.
 * Requires authenticated session.
 *
 * For curiosity mode:
 * - Accepts { message, id, mode, options } - only the last message
 * - Loads previous messages from database
 * - Saves all messages via onFinish callback
 * - Generates title after first assistant response
 */
export async function POST(request: Request) {
    try {
        // Verify user is authenticated
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized - please sign in to use chat" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = (await request.json()) as ChatRequestBody;
        const {
            message,
            id,
            isNewChat,
            messages: legacyMessages,
            mode,
            options,
        } = body;

        // Validate mode
        if (
            !mode ||
            !["learn", "quiz", "curiosity", "reflection"].includes(mode)
        ) {
            return NextResponse.json(
                { error: "Invalid or missing chat mode" },
                { status: 400 }
            );
        }

        // Validate options exist
        if (!options) {
            return NextResponse.json(
                { error: "Missing options for chat mode" },
                { status: 400 }
            );
        }

        // Determine messages based on mode
        let messages: UIMessage[];
        let chatId: string | undefined;

        if (mode === "curiosity" && id && message) {
            // New pattern: Load previous messages from DB, append new message
            chatId = id;

            // For new chats, don't try to load from DB (chat will be created in saveChat)
            // For existing chats, load previous messages
            let previousMessages: UIMessage[] = [];
            if (!isNewChat) {
                const chat = await loadChat(chatId, userId);
                previousMessages = chat?.messages || [];
            }
            messages = [...previousMessages, message];
        } else if (legacyMessages) {
            // Legacy pattern: Use full message array from client
            messages = legacyMessages;
        } else {
            return NextResponse.json(
                { error: "Missing messages" },
                { status: 400 }
            );
        }

        // Get mode-specific configuration
        const systemPrompt = getSystemPrompt(mode, options);
        const tools = getTools(mode);

        // Use streamText with the configured model, prompt, and tools
        const result = streamText({
            model: gemini,
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
            tools,
        });

        // For curiosity mode with persistence, consume stream and save on finish
        if (mode === "curiosity" && chatId) {
            // Consume stream to ensure completion even if client disconnects
            result.consumeStream();

            return result.toUIMessageStreamResponse({
                originalMessages: messages,
                generateMessageId: createIdGenerator({
                    prefix: "msg",
                    size: 16,
                }),
                onFinish: async ({ messages: finalMessages }) => {
                    try {
                        // Save all messages to database
                        await saveChat({
                            chatId: chatId!,
                            messages: finalMessages,
                            userId,
                        });

                        // Generate title after first AI response if needed
                        const chat = await getChat(chatId!, userId);
                        if (
                            chat?.title === "New conversation" &&
                            finalMessages.length >= 2
                        ) {
                            const title = await generateTitle(finalMessages);
                            await updateChatTitle(chatId!, title, userId);
                        }
                    } catch (error) {
                        console.error("Error in onFinish callback:", error);
                    }
                },
            });
        }

        // Return streaming response (legacy pattern without persistence)
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API error:", error);

        // Handle validation errors specifically
        if (error instanceof Error && error.message.includes("validation")) {
            return NextResponse.json(
                { error: "Invalid request format", details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * OPTIONS handler for CORS preflight.
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
