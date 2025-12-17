/**
 * Chat utilities
 *
 * Exports serialization and storage utilities for chat persistence.
 */

export {
    serializeMessage,
    serializeMessages,
    deserializeMessage,
    deserializeMessages,
    extractTextContent,
    toStoredMessages,
    generateMessageId,
    type StoredMessage,
    type UIMessage,
} from "./serialization";

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
