/**
 * Chat Utilities
 *
 * Utility functions for the chat feature.
 */

export { getMessageContent, getToolInvocations } from "./message-helpers";

export {
    extractTextContent,
    serializeMessage,
    serializeMessages,
    deserializeMessage,
    deserializeMessages,
    toStoredMessages,
    generateMessageId,
} from "./serialization";

export type { StoredMessage, UIMessage } from "./serialization";

// Server-side storage functions (use only in Server Components and API routes)
export {
    createChat,
    loadChat,
    saveChat,
    getChat,
    updateChatTitle,
    listChats,
    archiveChat,
    deleteChat,
    searchChats,
} from "./storage";
