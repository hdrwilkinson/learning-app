/**
 * Curiosity Feature Types
 *
 * Types specific to the Curiosity/Explore mode.
 */

/**
 * Conversation metadata for list display.
 */
export interface ConversationMeta {
    id: string;
    title: string;
    summary: string | null;
    updatedAt: string;
    createdAt: string;
    messagePreview: string;
}

/**
 * API response for listing conversations.
 */
export interface ListConversationsResponse {
    conversations: ConversationMeta[];
    nextCursor?: string;
    hasMore: boolean;
}
