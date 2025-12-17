/**
 * Conversation Title Generation API Route
 *
 * Generates a concise title for a conversation using Gemini AI.
 * POST - Generate and save title
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../../../../services/db/db-client";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI client (uses same key as AI SDK)
const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * Generate a concise title from conversation messages.
 * Uses Gemini 1.5 Flash for fast, cost-effective title generation.
 */
async function generateTitle(
    messages: Array<{ role: string; content: string }>
): Promise<string> {
    try {
        // Use Gemini 1.5 Flash for title generation (fast and cost-effective)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const conversationPreview = messages
            .slice(0, 4)
            .map((m) => `${m.role}: ${m.content.slice(0, 200)}`)
            .join("\n");

        const prompt = `Generate a concise title (3-6 words) for this conversation. Return ONLY the title, no quotes or punctuation.

${conversationPreview}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return text.trim() || "New conversation";
    } catch (error) {
        console.error("Title generation error:", error);
        // Fallback: generate title from first user message
        const firstUserMessage = messages.find((m) => m.role === "user");
        if (firstUserMessage) {
            // Take first few words of the message
            const words = firstUserMessage.content
                .split(/\s+/)
                .slice(0, 5)
                .join(" ");
            return words.length > 30
                ? words.slice(0, 30) + "..."
                : words || "New conversation";
        }
        return "New conversation";
    }
}

/**
 * POST /api/conversations/[id]/title
 *
 * Generate and save a title for the conversation based on its messages.
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

        // Verify ownership and get messages
        const conversation = await prisma.curiosityChat.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                    take: 4, // Only need first few messages for title generation
                    select: {
                        role: true,
                        content: true,
                    },
                },
            },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        if (conversation.messages.length === 0) {
            return NextResponse.json(
                { error: "No messages to generate title from" },
                { status: 400 }
            );
        }

        // Generate title using Gemini
        const title = await generateTitle(conversation.messages);

        // Update conversation with new title
        const updated = await prisma.curiosityChat.update({
            where: { id },
            data: { title },
            select: {
                id: true,
                title: true,
            },
        });

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
        });
    } catch (error) {
        console.error("POST /api/conversations/[id]/title error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
