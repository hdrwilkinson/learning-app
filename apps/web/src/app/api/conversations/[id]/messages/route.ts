/**
 * Conversation Messages API Route
 *
 * Handles saving messages to a conversation.
 * POST - Save one or more messages
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../../../services/db/db-client";
import { z } from "zod";

// Validation schema for saving messages
const saveMessagesSchema = z.object({
    messages: z
        .array(
            z.object({
                id: z.string().optional(), // Optional - will be generated if not provided
                role: z.enum(["user", "assistant"]),
                content: z.string(),
                parts: z.any().optional(), // AI SDK v6 parts array (tool calls, etc.)
            })
        )
        .min(1),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/conversations/[id]/messages
 *
 * Save one or more messages to a conversation.
 * Creates the conversation if it doesn't exist.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const parseResult = saveMessagesSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid request body",
                    details: parseResult.error.errors,
                },
                { status: 400 }
            );
        }

        const { messages } = parseResult.data;

        // Check if conversation exists and belongs to user
        let conversation = await prisma.curiosityChat.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await prisma.curiosityChat.create({
                data: {
                    id, // Use the provided ID
                    userId: session.user.id,
                    title: "New conversation",
                },
            });
        }

        // Save messages
        const savedMessages = await prisma.curiosityMessage.createMany({
            data: messages.map((msg) => ({
                ...(msg.id && { id: msg.id }),
                chatId: id,
                role: msg.role,
                content: msg.content,
                parts: msg.parts || null,
            })),
        });

        // Update conversation timestamp
        await prisma.curiosityChat.update({
            where: { id },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            count: savedMessages.count,
            conversationId: id,
        });
    } catch (error) {
        console.error("POST /api/conversations/[id]/messages error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
