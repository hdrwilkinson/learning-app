/**
 * Message Helpers
 *
 * Utility functions for extracting content and tool invocations from AI SDK messages.
 */

import type { ToolInvocation } from "../types";

/**
 * Message part types from AI SDK v6.
 */
interface TextPart {
    type: "text";
    text: string;
}

interface ToolPart {
    type: string;
    state: string;
    input?: Record<string, unknown>;
    output?: unknown;
}

type MessagePart =
    | TextPart
    | ToolPart
    | { type: string; [key: string]: unknown };

/**
 * Message type from AI SDK useChat hook.
 */
interface AIMessage {
    id: string;
    role: string;
    parts?: MessagePart[];
    content?: string;
}

/**
 * Extract text content from message parts.
 * Handles AI SDK v6 UIMessage format with parts array.
 */
export function getMessageContent(message: AIMessage): string {
    if ("parts" in message && Array.isArray(message.parts)) {
        return message.parts
            .filter((part): part is TextPart => part.type === "text")
            .map((part) => part.text)
            .join("");
    }
    // Fallback for messages with direct content
    if ("content" in message && typeof message.content === "string") {
        return message.content;
    }
    return "";
}

/**
 * Extract tool invocations from message parts.
 * AI SDK v6 uses part.type format: "tool-{toolName}" (e.g., "tool-suggestFollowUpQuestions")
 */
export function getToolInvocations(
    message: AIMessage
): ToolInvocation[] | undefined {
    if (!("parts" in message) || !Array.isArray(message.parts)) {
        return undefined;
    }

    const toolParts = message.parts.filter(
        (part): part is ToolPart =>
            typeof part.type === "string" && part.type.startsWith("tool-")
    );

    if (toolParts.length === 0) {
        return undefined;
    }

    return toolParts.map((part) => {
        // Extract tool name from type (e.g., "tool-suggestFollowUpQuestions" -> "suggestFollowUpQuestions")
        const toolName = part.type.replace("tool-", "");

        // Map AI SDK v6 states to our internal states
        // AI SDK v6: "input-available" | "output-available" | "output-error"
        const state: "pending" | "result" =
            part.state === "output-available" ? "result" : "pending";

        return {
            toolName,
            state,
            args: part.input,
            result: part.output,
        };
    });
}
