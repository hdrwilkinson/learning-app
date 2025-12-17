/**
 * Chat API Route
 *
 * Single endpoint for all chat modes. Uses AI SDK v6 streamText
 * with mode-specific system prompts.
 *
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import { convertToModelMessages, streamText, type UIMessage } from "ai";
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

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Request body shape for the chat endpoint.
 */
interface ChatRequestBody {
    messages: UIMessage[];
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

        const body = (await request.json()) as ChatRequestBody;
        const { messages, mode, options } = body;

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

        // Return streaming response
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
