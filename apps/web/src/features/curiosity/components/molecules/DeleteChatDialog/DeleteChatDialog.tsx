/**
 * DeleteChatDialog Component
 *
 * A confirmation dialog for deleting chat conversations.
 * Uses shadcn AlertDialog for consistent styling.
 */

"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";

export interface DeleteChatDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Callback when open state changes */
    onOpenChange: (open: boolean) => void;
    /** Callback when delete is confirmed */
    onConfirm: () => void;
    /** Title of the conversation being deleted (optional, for display) */
    chatTitle?: string;
    /** Whether the delete action is in progress */
    isDeleting?: boolean;
}

export function DeleteChatDialog({
    open,
    onOpenChange,
    onConfirm,
    chatTitle,
    isDeleting = false,
}: DeleteChatDialogProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {chatTitle ? (
                            <>
                                This will permanently delete &quot;{chatTitle}
                                &quot;. This action cannot be undone.
                            </>
                        ) : (
                            <>
                                This will permanently delete this conversation.
                                This action cannot be undone.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
