/**
 * Conversations API Route
 *
 * Handles listing and creating conversations for Curiosity mode.
 * GET - List user's conversations (paginated, sorted by updatedAt)
 * POST - Create a new conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../services/db/db-client";
import { z } from "zod";

// Validation schema for creating a conversation
const createConversationSchema = z.object({
    title: z.string().min(1).max(200).optional().default("New conversation"),
});

// Query params schema for listing
// Note: searchParams.get() returns null for missing params, so we need .nullable()
const listQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(20),
    cursor: z
        .string()
        .nullable()
        .optional()
        .transform((val) => val ?? undefined),
    // Handle null/undefined from searchParams.get() - coerce string "true"/"false" to boolean
    archived: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean().default(false)
    ),
});

/**
 * GET /api/conversations
 *
 * List user's conversations with cursor-based pagination.
 * Returns conversations sorted by updatedAt descending.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const queryResult = listQuerySchema.safeParse({
            limit: searchParams.get("limit"),
            cursor: searchParams.get("cursor"),
            archived: searchParams.get("archived"),
        });

        if (!queryResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    details: queryResult.error.errors,
                },
                { status: 400 }
            );
        }

        const { limit, cursor, archived } = queryResult.data;

        const conversations = await prisma.curiosityChat.findMany({
            where: {
                userId: session.user.id,
                archived,
            },
            select: {
                id: true,
                title: true,
                summary: true,
                updatedAt: true,
                createdAt: true,
                messages: {
                    select: {
                        content: true,
                        role: true,
                    },
                    orderBy: { createdAt: "asc" },
                    take: 1,
                },
            },
            orderBy: { updatedAt: "desc" },
            take: limit + 1, // Fetch one extra to determine if there's a next page
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1, // Skip the cursor itself
            }),
        });

        // Determine if there's a next page
        const hasMore = conversations.length > limit;
        const items = hasMore ? conversations.slice(0, limit) : conversations;
        const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

        // Transform to include message preview
        const transformedItems = items.map((conv) => ({
            id: conv.id,
            title: conv.title,
            summary: conv.summary,
            updatedAt: conv.updatedAt.toISOString(),
            createdAt: conv.createdAt.toISOString(),
            messagePreview: conv.messages[0]?.content?.slice(0, 100) || "",
        }));

        return NextResponse.json({
            conversations: transformedItems,
            nextCursor,
            hasMore,
        });
    } catch (error) {
        console.error("GET /api/conversations error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/conversations
 *
 * Create a new conversation.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parseResult = createConversationSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid request body",
                    details: parseResult.error.errors,
                },
                { status: 400 }
            );
        }

        const { title } = parseResult.data;

        const conversation = await prisma.curiosityChat.create({
            data: {
                userId: session.user.id,
                title,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            {
                id: conversation.id,
                title: conversation.title,
                createdAt: conversation.createdAt.toISOString(),
                updatedAt: conversation.updatedAt.toISOString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/conversations error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
