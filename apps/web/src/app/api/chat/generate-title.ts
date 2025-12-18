/**
 * Title Generation Utility
 *
 * Generates concise titles for conversations using AI SDK.
 * Used by the chat route's onFinish callback for automatic title generation.
 */

import { generateText, type UIMessage } from "ai";
import { gemini } from "@/lib/ai/config";
import { extractTextContent } from "@/features/chat";

/**
 * Extract text content from UIMessage parts.
 */
function getMessageText(message: UIMessage): string {
    if (Array.isArray(message.parts)) {
        return extractTextContent(
            message.parts as Array<{ type: string; text?: string }>
        );
    }
    return "";
}

/**
 * Generate a concise title from conversation messages.
 * Uses the same Gemini model as chat for consistency.
 */
export async function generateTitle(messages: UIMessage[]): Promise<string> {
    try {
        const conversationPreview = messages
            .slice(0, 4)
            .map((m) => `${m.role}: ${getMessageText(m).slice(0, 200)}`)
            .join("\n");

        const { text } = await generateText({
            model: gemini,
            prompt: `Generate a concise title (3-6 words) for this conversation. Return ONLY the title, no quotes or punctuation.

${conversationPreview}`,
        });

        return text.trim() || "New conversation";
    } catch (error) {
        console.error("Title generation error:", error);
        // Fallback: generate title from first user message
        const firstUserMessage = messages.find((m) => m.role === "user");
        if (firstUserMessage) {
            const content = getMessageText(firstUserMessage);
            // Take first few words of the message
            const words = content.split(/\s+/).slice(0, 5).join(" ");
            return words.length > 30
                ? words.slice(0, 30) + "..."
                : words || "New conversation";
        }
        return "New conversation";
    }
}
