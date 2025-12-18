/**
 * Curiosity Feature
 *
 * Public API for the Curiosity/Explore mode.
 * This feature provides free-form exploration chat functionality.
 */

// Types
export type { ConversationMeta, ListConversationsResponse } from "./types";

// Components
export {
    ChatSettingsDropdown,
    DeleteChatDialog,
    ExploreChat,
    ExploreChatLayout,
} from "./components";

export type {
    ChatSettingsDropdownProps,
    DeleteChatDialogProps,
    ExploreChatProps,
    ExploreChatLayoutProps,
} from "./components";

// Hooks
export { useConversations, useConversationsStore } from "./hooks";

// Agents
export { buildCuriosityPrompt } from "./agents";
