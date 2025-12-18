/**
 * Chat Message Serialization
 *
 * Utilities for converting between AI SDK v6 UIMessage format
 * and the database storage format.
 *
 * AI SDK v6 uses UIMessage with a `parts` array containing:
 * - { type: 'text', text: string }
 * - { type: 'tool-{toolName}', ... } for tool invocations
 *
 * Database stores messages with:
 * - content: string (extracted text content)
 * - parts: Json (full parts array for restoration)
 */

import type { Prisma } from "@prisma/client";

/**
 * Stored message format in the database.
 */
export interface StoredMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    parts: Prisma.JsonValue;
    createdAt: string;
}

/**
 * AI SDK v6 UIMessage text part.
 */
interface TextPart {
    type: "text";
    text: string;
}

/**
 * AI SDK v6 UIMessage part (simplified type).
 */
type MessagePart = TextPart | { type: string; [key: string]: unknown };

/**
 * AI SDK v6 UIMessage format (simplified).
 */
export interface UIMessage {
    id: string;
    role: "user" | "assistant" | "system";
    parts: MessagePart[];
    createdAt?: Date;
}

/**
 * Extract text content from message parts.
 */
export function extractTextContent(
    parts: MessagePart[] | undefined | null
): string {
    if (!parts || !Array.isArray(parts)) return "";

    return parts
        .filter((part): part is TextPart => part.type === "text")
        .map((part) => part.text)
        .join("");
}

/**
 * Serialize a UIMessage for database storage.
 *
 * Extracts text content for the `content` field (for search/display)
 * and preserves the full parts array for restoration.
 */
export function serializeMessage(
    message: UIMessage
): Omit<StoredMessage, "createdAt"> & { createdAt?: string } {
    return {
        id: message.id,
        role: message.role as "user" | "assistant",
        content: extractTextContent(message.parts),
        parts: message.parts as Prisma.JsonValue,
        ...(message.createdAt && {
            createdAt: message.createdAt.toISOString(),
        }),
    };
}

/**
 * Serialize multiple UIMessages for database storage.
 */
export function serializeMessages(
    messages: UIMessage[]
): Array<Omit<StoredMessage, "createdAt"> & { createdAt?: string }> {
    return messages.map(serializeMessage);
}

/**
 * Deserialize a stored message back to UIMessage format.
 *
 * If parts are stored, restores them directly.
 * Otherwise, creates a text part from the content field.
 */
export function deserializeMessage(stored: StoredMessage): UIMessage {
    // If parts are stored, use them directly
    if (stored.parts && Array.isArray(stored.parts)) {
        return {
            id: stored.id,
            role: stored.role,
            parts: stored.parts as MessagePart[],
            createdAt: new Date(stored.createdAt),
        };
    }

    // Fallback: create text part from content
    return {
        id: stored.id,
        role: stored.role,
        parts: [{ type: "text", text: stored.content }],
        createdAt: new Date(stored.createdAt),
    };
}

/**
 * Deserialize multiple stored messages back to UIMessage format.
 */
export function deserializeMessages(stored: StoredMessage[]): UIMessage[] {
    return stored.map(deserializeMessage);
}

/**
 * Convert database message records to StoredMessage format.
 * Handles both Date objects (from Prisma) and strings (from API JSON).
 */
export function toStoredMessages(
    dbMessages: Array<{
        id: string;
        role: string;
        content: string;
        parts: Prisma.JsonValue;
        createdAt: Date | string;
    }>
): StoredMessage[] {
    return dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        parts: msg.parts,
        createdAt:
            typeof msg.createdAt === "string"
                ? msg.createdAt
                : msg.createdAt.toISOString(),
    }));
}

/**
 * Generate a unique message ID.
 */
export function generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
