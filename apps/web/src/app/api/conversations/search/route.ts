/**
 * Conversation Search API Route
 *
 * Full-text search across user's conversations.
 * GET - Search conversations by query
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../../services/db/db-client";
import { z } from "zod";

// Query params schema
const searchQuerySchema = z.object({
    q: z.string().min(1).max(200),
    limit: z.coerce.number().min(1).max(50).optional().default(20),
});

/**
 * GET /api/conversations/search
 *
 * Search user's conversations by message content.
 * Uses PostgreSQL ILIKE for simple pattern matching.
 * For production, consider using PostgreSQL full-text search with tsvector.
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
        const queryResult = searchQuerySchema.safeParse({
            q: searchParams.get("q"),
            limit: searchParams.get("limit"),
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

        const { q, limit } = queryResult.data;

        // Search in message content and conversation titles
        // Using Prisma's `contains` with `mode: insensitive` for pattern matching
        const conversations = await prisma.curiosityChat.findMany({
            where: {
                userId: session.user.id,
                archived: false,
                OR: [
                    {
                        title: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        messages: {
                            some: {
                                content: {
                                    contains: q,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                title: true,
                summary: true,
                updatedAt: true,
                createdAt: true,
                messages: {
                    where: {
                        content: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    select: {
                        content: true,
                        role: true,
                    },
                    take: 1,
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { updatedAt: "desc" },
            take: limit,
        });

        // Transform results
        const results = conversations.map((conv) => {
            // Find matching snippet
            let matchSnippet = "";
            if (conv.messages.length > 0) {
                const content = conv.messages[0].content;
                const lowerContent = content.toLowerCase();
                const lowerQuery = q.toLowerCase();
                const matchIndex = lowerContent.indexOf(lowerQuery);

                if (matchIndex !== -1) {
                    // Extract snippet around match
                    const start = Math.max(0, matchIndex - 40);
                    const end = Math.min(
                        content.length,
                        matchIndex + q.length + 40
                    );
                    matchSnippet =
                        (start > 0 ? "..." : "") +
                        content.slice(start, end) +
                        (end < content.length ? "..." : "");
                }
            }

            return {
                id: conv.id,
                title: conv.title,
                summary: conv.summary,
                updatedAt: conv.updatedAt.toISOString(),
                createdAt: conv.createdAt.toISOString(),
                matchSnippet,
            };
        });

        return NextResponse.json({
            results,
            query: q,
            count: results.length,
        });
    } catch (error) {
        console.error("GET /api/conversations/search error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
