/**
 * Chat Feature
 *
 * Public API for the shared chat foundation.
 * This feature provides the building blocks for all chat-based interactions
 * in the learning app (curiosity, learn, quiz, reflection modes).
 */

// Types
export type {
    ChatMode,
    ToolInvocation,
    ToolRendererProps,
    ToolRenderer,
    FollowUpQuestionsResult,
} from "./types";

// Components
export {
    ChatMessage,
    ChatInput,
    FloatingChatInput,
    ChatActions,
    FollowUpQuestions,
    toolRegistry,
    hasCustomRenderer,
    getToolRenderer,
    registerToolRenderer,
} from "./components";

export type {
    ChatMessageProps,
    ChatInputProps,
    FloatingChatInputProps,
    ChatActionsProps,
} from "./components";

// Hooks
export { useAutoScroll } from "./hooks";

// Utilities
export {
    getMessageContent,
    getToolInvocations,
    extractTextContent,
    serializeMessage,
    serializeMessages,
    deserializeMessage,
    deserializeMessages,
    toStoredMessages,
    generateMessageId,
    // Server-side storage functions
    createChat,
    loadChat,
    saveChat,
    getChat,
    updateChatTitle,
    listChats,
    archiveChat,
    deleteChat,
    searchChats,
} from "./utils";

export type { StoredMessage, UIMessage } from "./utils";
