/**
 * ExploreChatLayout Component
 *
 * Client component wrapper for the FocusLayout.
 * Provides the layout structure for explore/curiosity mode with:
 * - Editable title (for existing chats)
 * - New Chat button
 * - Settings dropdown with delete and general settings
 */

"use client";

import { type ReactNode, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FocusLayout } from "@/components/ui/layout";
import { Button } from "@/components/ui/shadcn/button";
import { HiPlus } from "react-icons/hi";
import { EditableTitle } from "@/components/ui/atoms";
import { ChatSettingsDropdown } from "../ChatSettingsDropdown";
import { DeleteChatDialog } from "../DeleteChatDialog";
import { useConversations } from "../../../hooks";

export interface ExploreChatLayoutProps {
    /** Main content */
    children: ReactNode;
    /** Chat ID (undefined for new chats) */
    chatId?: string;
    /** Chat title (defaults to "Explore" for new chats) */
    chatTitle?: string;
}

export function ExploreChatLayout({
    children,
    chatId,
    chatTitle = "Explore",
}: ExploreChatLayoutProps) {
    const router = useRouter();
    const { renameConversation, deleteConversation } = useConversations();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isNewChat = !chatId;

    const handleNewChat = () => {
        router.push("/explore");
    };

    const handleTitleSave = useCallback(
        async (newTitle: string) => {
            if (!chatId) return;
            await renameConversation(chatId, newTitle);
        },
        [chatId, renameConversation]
    );

    const handleDelete = useCallback(async () => {
        if (!chatId) return;

        setIsDeleting(true);
        try {
            const success = await deleteConversation(chatId);
            if (success) {
                setDeleteDialogOpen(false);
                router.push("/explore");
            }
        } finally {
            setIsDeleting(false);
        }
    }, [chatId, deleteConversation, router]);

    // Build the title component
    const titleComponent = isNewChat ? (
        <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <h1 className="text-lg font-semibold text-foreground">Explore</h1>
        </div>
    ) : (
        <EditableTitle
            value={chatTitle}
            onSave={handleTitleSave}
            placeholder="Untitled conversation"
            icon="🔮"
        />
    );

    // Build the actions
    const actions = (
        <div className="flex items-center gap-1">
            {/* New Chat Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="gap-1.5"
            >
                <HiPlus className="h-4 w-4" />
                <span className="hidden sm:inline">New Chat</span>
            </Button>

            {/* Settings Dropdown (delete only available for existing chats) */}
            <ChatSettingsDropdown
                onDelete={
                    !isNewChat ? () => setDeleteDialogOpen(true) : undefined
                }
            />
        </div>
    );

    return (
        <>
            <FocusLayout title={titleComponent} backHref="/" actions={actions}>
                {children}
            </FocusLayout>

            {/* Delete Confirmation Dialog */}
            <DeleteChatDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                chatTitle={chatTitle !== "Explore" ? chatTitle : undefined}
                isDeleting={isDeleting}
            />
        </>
    );
}
