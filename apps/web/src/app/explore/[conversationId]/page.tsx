/**
 * Explore Conversation Page (Server Component)
 *
 * Loads an existing conversation and passes messages to the client component.
 * Following AI SDK v6 chatbot message persistence pattern.
 *
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { loadChat } from "@/lib/chat";
import { ExploreChat } from "../ExploreChat";
import { ExploreChatLayout } from "../ExploreChatLayout";

interface PageProps {
    params: Promise<{ conversationId: string }>;
}

export default async function ExploreConversationPage({ params }: PageProps) {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const { conversationId } = await params;

    // Load conversation with messages from database
    const chat = await loadChat(conversationId, session.user.id);

    // Return 404 if conversation not found
    if (!chat) {
        notFound();
    }

    return (
        <ExploreChatLayout chatId={chat.id} chatTitle={chat.title}>
            <ExploreChat id={chat.id} initialMessages={chat.messages} />
        </ExploreChatLayout>
    );
}
