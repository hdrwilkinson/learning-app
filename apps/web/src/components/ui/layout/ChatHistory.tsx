/**
 * ChatHistory Component
 *
 * Displays a collapsible list of recent conversations in the sidebar.
 * Includes new chat button, conversation list, and context menu for actions.
 *
 * Auto-refreshes when navigating to a conversation not in the current list
 * (handles server-side chat creation from /explore redirect).
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    HiPlus,
    HiChat,
    HiDotsVertical,
    HiPencil,
    HiTrash,
    HiChevronDown,
    HiChevronRight,
} from "react-icons/hi";
import { cn } from "@/lib/utils";
import {
    useConversations,
    DeleteChatDialog,
    type ConversationMeta,
} from "@/features/curiosity";

interface ChatHistoryProps {
    /** Whether to show the expanded view (desktop) or collapsed (tablet) */
    isExpanded?: boolean;
}

export function ChatHistory({ isExpanded = true }: ChatHistoryProps) {
    const pathname = usePathname();
    const router = useRouter();
    const {
        conversations,
        isLoading,
        renameConversation,
        deleteConversation,
        refresh,
    } = useConversations();

    // Extract conversation ID from pathname if on an explore page
    const exploreMatch = pathname?.match(/^\/explore\/(.+)$/);
    const currentConversationId = exploreMatch?.[1];

    // Track which conversation IDs we've already tried to refresh for
    const refreshedForRef = useRef<Set<string>>(new Set());

    // Auto-refresh when navigating to a conversation not in the list
    // This handles server-side chat creation from /explore redirect
    useEffect(() => {
        if (!currentConversationId || isLoading) return;

        // Don't refresh if we've already tried for this conversation
        if (refreshedForRef.current.has(currentConversationId)) return;

        const conversationExists = conversations.some(
            (c) => c.id === currentConversationId
        );

        if (!conversationExists) {
            // Mark as refreshed to prevent infinite loops
            refreshedForRef.current.add(currentConversationId);
            // Conversation was created server-side, refresh the list
            refresh();
        }
    }, [currentConversationId, conversations, isLoading, refresh]);

    // Clear the refresh tracking when conversation ID changes (allows retry on new navigation)
    useEffect(() => {
        if (currentConversationId) {
            // Keep only the current ID in the set
            const newSet = new Set<string>();
            if (refreshedForRef.current.has(currentConversationId)) {
                newSet.add(currentConversationId);
            }
            refreshedForRef.current = newSet;
        }
    }, [currentConversationId]);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        id: string;
        x: number;
        y: number;
    } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        title: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(e.target as Node)
            ) {
                setContextMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus edit input when editing starts
    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    /**
     * Handle creating a new conversation.
     * Navigates to /explore which creates a new chat server-side and redirects.
     */
    const handleNewChat = () => {
        router.push("/explore");
    };

    /**
     * Handle context menu open.
     */
    const handleContextMenu = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ id, x: e.clientX, y: e.clientY });
    };

    /**
     * Handle rename action.
     */
    const handleRename = (conv: ConversationMeta) => {
        setEditingId(conv.id);
        setEditValue(conv.title);
        setContextMenu(null);
    };

    /**
     * Handle rename submit.
     */
    const handleRenameSubmit = async (id: string) => {
        if (
            editValue.trim() &&
            editValue !== conversations.find((c) => c.id === id)?.title
        ) {
            await renameConversation(id, editValue.trim());
        }
        setEditingId(null);
        setEditValue("");
    };

    /**
     * Open delete confirmation dialog.
     */
    const handleDeleteClick = (id: string) => {
        setContextMenu(null);
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setDeleteTarget({ id: conv.id, title: conv.title });
            setDeleteDialogOpen(true);
        }
    };

    /**
     * Confirm and execute delete action.
     */
    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            const success = await deleteConversation(deleteTarget.id);
            if (success) {
                setDeleteDialogOpen(false);
                setDeleteTarget(null);
                // Navigate away if deleting current conversation
                if (pathname === `/explore/${deleteTarget.id}`) {
                    router.push("/explore");
                }
            }
        } finally {
            setIsDeleting(false);
        }
    }, [deleteTarget, deleteConversation, pathname, router]);

    // Only show on desktop expanded view
    if (!isExpanded) {
        return (
            <div className="px-2 py-4">
                <button
                    onClick={handleNewChat}
                    className={cn(
                        "flex items-center justify-center w-full p-3 rounded-lg",
                        "bg-primary/10 text-primary hover:bg-primary/20",
                        "transition-colors"
                    )}
                    aria-label="New chat"
                >
                    <HiPlus className="h-5 w-5" />
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col border-t border-border">
                {/* Header with collapse toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "flex items-center justify-between px-4 py-3",
                        "text-muted-foreground hover:text-foreground",
                        "transition-colors"
                    )}
                >
                    <span className="text-xs font-medium uppercase tracking-wider">
                        Recent Chats
                    </span>
                    {isCollapsed ? (
                        <HiChevronRight className="h-4 w-4" />
                    ) : (
                        <HiChevronDown className="h-4 w-4" />
                    )}
                </button>

                {!isCollapsed && (
                    <>
                        {/* New Chat Button */}
                        <div className="px-4 pb-2">
                            <button
                                onClick={handleNewChat}
                                className={cn(
                                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
                                    "bg-primary/10 text-primary hover:bg-primary/20",
                                    "text-sm font-medium transition-colors"
                                )}
                            >
                                <HiPlus className="h-4 w-4" />
                                New Chat
                            </button>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto px-2 pb-4 max-h-[300px]">
                            {isLoading && conversations.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <span className="text-xs text-muted-foreground">
                                        Loading...
                                    </span>
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <HiChat className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                    <span className="text-xs text-muted-foreground">
                                        No conversations yet
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {conversations.slice(0, 15).map((conv) => {
                                        const isActive =
                                            pathname === `/explore/${conv.id}`;
                                        const isEditing = editingId === conv.id;

                                        return (
                                            <div
                                                key={conv.id}
                                                className="relative group"
                                            >
                                                {isEditing ? (
                                                    <input
                                                        ref={editInputRef}
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) =>
                                                            setEditValue(
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            handleRenameSubmit(
                                                                conv.id
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                handleRenameSubmit(
                                                                    conv.id
                                                                );
                                                            } else if (
                                                                e.key ===
                                                                "Escape"
                                                            ) {
                                                                setEditingId(
                                                                    null
                                                                );
                                                                setEditValue(
                                                                    ""
                                                                );
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-full px-3 py-2 rounded-lg text-sm",
                                                            "bg-surface-2 border border-primary",
                                                            "focus:outline-none focus:ring-1 focus:ring-primary"
                                                        )}
                                                    />
                                                ) : (
                                                    <Link
                                                        href={`/explore/${conv.id}`}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-lg",
                                                            "text-sm transition-colors",
                                                            isActive
                                                                ? "bg-accent/10 text-accent"
                                                                : "text-foreground hover:bg-surface-2"
                                                        )}
                                                    >
                                                        <HiChat
                                                            className={cn(
                                                                "h-4 w-4 flex-shrink-0",
                                                                isActive
                                                                    ? "text-accent"
                                                                    : "text-muted-foreground"
                                                            )}
                                                        />
                                                        <span className="truncate flex-1">
                                                            {conv.title}
                                                        </span>
                                                    </Link>
                                                )}

                                                {/* Context menu button */}
                                                {!isEditing && (
                                                    <button
                                                        onClick={(e) =>
                                                            handleContextMenu(
                                                                e,
                                                                conv.id
                                                            )
                                                        }
                                                        className={cn(
                                                            "absolute right-1 top-1/2 -translate-y-1/2",
                                                            "p-1.5 rounded opacity-0 group-hover:opacity-100",
                                                            "text-muted-foreground hover:text-foreground hover:bg-surface-3",
                                                            "transition-all"
                                                        )}
                                                        aria-label="Conversation options"
                                                    >
                                                        <HiDotsVertical className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Context Menu */}
                {contextMenu && (
                    <div
                        ref={contextMenuRef}
                        className={cn(
                            "fixed z-50 min-w-[140px] rounded-lg border border-border",
                            "bg-surface-1 shadow-lg py-1"
                        )}
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                        }}
                    >
                        <button
                            onClick={() => {
                                const conv = conversations.find(
                                    (c) => c.id === contextMenu.id
                                );
                                if (conv) handleRename(conv);
                            }}
                            className={cn(
                                "flex items-center gap-2 w-full px-3 py-2",
                                "text-sm text-foreground hover:bg-surface-2",
                                "transition-colors"
                            )}
                        >
                            <HiPencil className="h-4 w-4" />
                            Rename
                        </button>
                        <button
                            onClick={() => handleDeleteClick(contextMenu.id)}
                            className={cn(
                                "flex items-center gap-2 w-full px-3 py-2",
                                "text-sm text-destructive hover:bg-destructive/10",
                                "transition-colors"
                            )}
                        >
                            <HiTrash className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteChatDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                chatTitle={deleteTarget?.title}
                isDeleting={isDeleting}
            />
        </>
    );
}
