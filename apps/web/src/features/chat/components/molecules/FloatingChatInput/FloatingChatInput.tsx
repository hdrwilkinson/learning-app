/**
 * FloatingChatInput Component
 *
 * Self-contained floating input bar for chat interfaces.
 * Designed to be positioned at the bottom of a flex container with flex-shrink-0.
 * Grey background container includes input and optional action buttons.
 */

"use client";

import {
    useRef,
    type FormEvent,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { HiPaperAirplane, HiStop } from "react-icons/hi";

export interface FloatingChatInputProps {
    /** Current input value */
    value: string;
    /** Called when input value changes */
    onChange: (value: string) => void;
    /** Called when form is submitted */
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Called when stop button is clicked during streaming */
    onStop?: () => void;
    /** Whether the chat is currently loading/streaming */
    isLoading?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Whether input is disabled */
    disabled?: boolean;
    /** Action buttons to display below the input */
    actions?: ReactNode;
    /** Additional class name for the container */
    className?: string;
}

export function FloatingChatInput({
    value,
    onChange,
    onSubmit,
    onStop,
    isLoading = false,
    placeholder = "Type your message...",
    disabled = false,
    actions,
    className,
}: FloatingChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Handle keyboard shortcuts.
     * Enter to submit (even while loading - parent handles stopping stream), Shift+Enter for new line.
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) {
                const form = e.currentTarget.form;
                if (form) {
                    const submitEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                    });
                    form.dispatchEvent(submitEvent);
                }
            }
        }
    };

    /**
     * Auto-resize textarea based on content.
     */
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        onChange(textarea.value);

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = "auto";
        // Set height to scrollHeight, max 200px
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    return (
        <div className={cn("flex-shrink-0 pb-4", className)}>
            {/* Grey background container - wider than chat history to cleanly cover scrolling messages */}
            <div className="max-w-[calc(48rem+2rem)] mx-auto rounded-2xl bg-surface-1 p-3">
                <form onSubmit={onSubmit}>
                    {/* Textarea - full width, remains enabled during streaming to allow interruption */}
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className={cn(
                            "w-full resize-none bg-transparent px-1 py-1",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                        style={{ minHeight: "24px", maxHeight: "200px" }}
                    />

                    {/* Button row - actions left, submit right */}
                    <div className="flex items-center justify-between mt-2">
                        {/* Action buttons - left */}
                        <div className="flex items-center gap-2">{actions}</div>

                        {/* Stop/Submit button - right */}
                        {isLoading ? (
                            <button
                                type="button"
                                onClick={onStop}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full",
                                    "bg-destructive text-destructive-foreground",
                                    "transition-all duration-200",
                                    "hover:bg-destructive/90",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                )}
                                aria-label="Stop response"
                            >
                                <HiStop className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!value.trim() || disabled}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full",
                                    "bg-primary text-primary-foreground",
                                    "transition-all duration-200",
                                    "hover:bg-primary/90",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                                aria-label="Send message"
                            >
                                <HiPaperAirplane className="h-4 w-4 rotate-90" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
