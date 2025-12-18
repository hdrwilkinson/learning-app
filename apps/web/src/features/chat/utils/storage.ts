/**
 * Server-Side Chat Storage
 *
 * Functions for persisting chat messages to the database.
 * These functions are server-only and use Prisma directly.
 *
 * Following AI SDK v6 chatbot message persistence pattern:
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 */

import { generateId, type UIMessage } from "ai";
import { type PrismaClient } from "@prisma/client";
import { prisma } from "../../../../../../services/db/db-client";
import { extractTextContent } from "./serialization";

// Type for database message records
interface DbMessage {
    id: string;
    role: string;
    content: string;
    parts: unknown;
    createdAt: Date;
}

// Type for database chat with messages
interface DbChatWithMessages {
    id: string;
    title: string;
    summary: string | null;
    messages: DbMessage[];
}

/**
 * Create a new chat conversation.
 * Returns the new conversation ID.
 */
export async function createChat(userId: string): Promise<string> {
    const id = generateId();

    await prisma.curiosityChat.create({
        data: {
            id,
            userId,
            title: "New conversation",
        },
    });

    return id;
}

/**
 * Load a chat conversation with its messages.
 * Returns null if not found or user doesn't have access.
 */
export async function loadChat(
    chatId: string,
    userId?: string
): Promise<{
    id: string;
    title: string;
    messages: UIMessage[];
} | null> {
    const chat = await prisma.curiosityChat.findFirst({
        where: {
            id: chatId,
            ...(userId && { userId }),
            archived: false,
        },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!chat) {
        return null;
    }

    // Convert database messages to UIMessage format
    const messages: UIMessage[] = (chat as DbChatWithMessages).messages.map(
        (msg: DbMessage) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            parts: (msg.parts as UIMessage["parts"]) || [
                { type: "text", text: msg.content },
            ],
            createdAt: msg.createdAt,
        })
    );

    return {
        id: chat.id,
        title: chat.title,
        messages,
    };
}

/**
 * Save messages to a chat conversation.
 * Called from the API route's onFinish callback.
 *
 * This replaces all messages for the conversation (full sync).
 */
export async function saveChat({
    chatId,
    messages,
    userId,
}: {
    chatId: string;
    messages: UIMessage[];
    userId?: string;
}): Promise<void> {
    // Verify chat exists and user has access
    const chat = await prisma.curiosityChat.findFirst({
        where: {
            id: chatId,
            ...(userId && { userId }),
        },
    });

    if (!chat) {
        // Create the chat if it doesn't exist
        if (userId) {
            await prisma.curiosityChat.create({
                data: {
                    id: chatId,
                    userId,
                    title: "New conversation",
                },
            });
        } else {
            throw new Error(
                "Chat not found and no userId provided to create it"
            );
        }
    }

    // Delete existing messages and insert new ones
    await prisma.$transaction(
        async (
            tx: Omit<
                PrismaClient,
                | "$connect"
                | "$disconnect"
                | "$on"
                | "$transaction"
                | "$use"
                | "$extends"
            >
        ) => {
            // Delete existing messages
            await tx.curiosityMessage.deleteMany({
                where: { chatId },
            });

            // Insert all messages
            if (messages.length > 0) {
                await tx.curiosityMessage.createMany({
                    data: messages.map((msg) => ({
                        id: msg.id,
                        chatId,
                        role: msg.role,
                        content: extractTextContent(
                            msg.parts as Array<{ type: string; text?: string }>
                        ),
                        parts: msg.parts as object,
                        // UIMessage.createdAt may be undefined in AI SDK v6
                        createdAt:
                            (msg as { createdAt?: Date }).createdAt ||
                            new Date(),
                    })),
                });
            }

            // Update chat's updatedAt
            await tx.curiosityChat.update({
                where: { id: chatId },
                data: { updatedAt: new Date() },
            });
        }
    );
}

/**
 * Get chat metadata (without messages).
 */
export async function getChat(chatId: string, userId?: string) {
    return prisma.curiosityChat.findFirst({
        where: {
            id: chatId,
            ...(userId && { userId }),
        },
        select: {
            id: true,
            title: true,
            summary: true,
            savedToCourse: true,
            courseId: true,
            archived: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

/**
 * Update chat title.
 */
export async function updateChatTitle(
    chatId: string,
    title: string,
    userId?: string
): Promise<void> {
    await prisma.curiosityChat.updateMany({
        where: {
            id: chatId,
            ...(userId && { userId }),
        },
        data: { title },
    });
}

// Type for chat list items from DB
interface DbChatListItem {
    id: string;
    title: string;
    summary: string | null;
    updatedAt: Date;
    createdAt: Date;
    messages: Array<{ content: string }>;
}

/**
 * List user's chats, sorted by most recent.
 */
export async function listChats(
    userId: string,
    options?: {
        limit?: number;
        includeArchived?: boolean;
    }
): Promise<
    Array<{
        id: string;
        title: string;
        summary: string | null;
        updatedAt: Date;
        createdAt: Date;
        messagePreview: string;
    }>
> {
    const chats = await prisma.curiosityChat.findMany({
        where: {
            userId,
            ...(options?.includeArchived ? {} : { archived: false }),
        },
        orderBy: { updatedAt: "desc" },
        take: options?.limit || 50,
        include: {
            messages: {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { content: true },
            },
        },
    });

    return (chats as DbChatListItem[]).map((chat: DbChatListItem) => ({
        id: chat.id,
        title: chat.title,
        summary: chat.summary,
        updatedAt: chat.updatedAt,
        createdAt: chat.createdAt,
        messagePreview: chat.messages[0]?.content?.slice(0, 100) || "",
    }));
}

/**
 * Archive (soft delete) a chat.
 */
export async function archiveChat(
    chatId: string,
    userId: string
): Promise<void> {
    await prisma.curiosityChat.updateMany({
        where: { id: chatId, userId },
        data: { archived: true },
    });
}

/**
 * Hard delete a chat.
 */
export async function deleteChat(
    chatId: string,
    userId: string
): Promise<void> {
    await prisma.curiosityChat.deleteMany({
        where: { id: chatId, userId },
    });
}

// Type for search results
interface DbChatSearchItem {
    id: string;
    title: string;
    summary: string | null;
    updatedAt: Date;
    messages: Array<{ content: string }>;
}

/**
 * Search chats by title or message content.
 */
export async function searchChats(
    userId: string,
    query: string
): Promise<
    Array<{
        id: string;
        title: string;
        summary: string | null;
        updatedAt: Date;
        messagePreview: string;
    }>
> {
    const chats = await prisma.curiosityChat.findMany({
        where: {
            userId,
            archived: false,
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                {
                    messages: {
                        some: {
                            content: { contains: query, mode: "insensitive" },
                        },
                    },
                },
            ],
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
        include: {
            messages: {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { content: true },
            },
        },
    });

    return (chats as DbChatSearchItem[]).map((chat: DbChatSearchItem) => ({
        id: chat.id,
        title: chat.title,
        summary: chat.summary,
        updatedAt: chat.updatedAt,
        messagePreview: chat.messages[0]?.content?.slice(0, 100) || "",
    }));
}
