/**
 * Explore Page (Server Component)
 *
 * Landing page for explore/curiosity mode.
 * Shows an empty chat interface where users can start typing.
 * Chat is created lazily on first message submission.
 *
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ExploreChat } from "./ExploreChat";
import { ExploreChatLayout } from "./ExploreChatLayout";

export default async function ExplorePage() {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    // Render ExploreChat without id (new chat mode with lazy creation)
    return (
        <ExploreChatLayout>
            <ExploreChat />
        </ExploreChatLayout>
    );
}
