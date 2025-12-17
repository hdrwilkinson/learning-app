/**
 * Single Conversation API Route
 *
 * Handles operations on individual conversations.
 * GET - Get conversation with messages
 * PATCH - Update conversation (rename, archive)
 * DELETE - Hard delete conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../../services/db/db-client";
import { z } from "zod";

// Validation schema for updating a conversation
const updateConversationSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    archived: z.boolean().optional(),
    summary: z.string().optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/conversations/[id]
 *
 * Get a single conversation with all its messages.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const conversation = await prisma.curiosityChat.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: conversation.id,
            title: conversation.title,
            summary: conversation.summary,
            archived: conversation.archived,
            savedToCourse: conversation.savedToCourse,
            courseId: conversation.courseId,
            createdAt: conversation.createdAt.toISOString(),
            updatedAt: conversation.updatedAt.toISOString(),
            messages: conversation.messages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                parts: msg.parts,
                createdAt: msg.createdAt.toISOString(),
            })),
        });
    } catch (error) {
        console.error("GET /api/conversations/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/conversations/[id]
 *
 * Update a conversation (rename, archive, etc.).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
        const parseResult = updateConversationSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid request body",
                    details: parseResult.error.errors,
                },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.curiosityChat.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        const { title, archived, summary } = parseResult.data;

        const updated = await prisma.curiosityChat.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(archived !== undefined && { archived }),
                ...(summary !== undefined && { summary }),
            },
            select: {
                id: true,
                title: true,
                summary: true,
                archived: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            summary: updated.summary,
            archived: updated.archived,
            updatedAt: updated.updatedAt.toISOString(),
        });
    } catch (error) {
        console.error("PATCH /api/conversations/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/conversations/[id]
 *
 * Hard delete a conversation and all its messages.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Verify ownership
        const existing = await prisma.curiosityChat.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        // Delete conversation (messages cascade due to relation)
        await prisma.curiosityChat.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/conversations/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
