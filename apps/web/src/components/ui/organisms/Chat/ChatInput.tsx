/**
 * ChatInput Component
 *
 * Input field for chat messages with submit handling and loading state.
 */

"use client";

import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { HiPaperAirplane } from "react-icons/hi";

interface ChatInputProps {
    /** Current input value */
    value: string;
    /** Called when input value changes */
    onChange: (value: string) => void;
    /** Called when form is submitted */
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Whether the chat is currently loading/streaming */
    isLoading?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Whether input is disabled */
    disabled?: boolean;
}

export function ChatInput({
    value,
    onChange,
    onSubmit,
    isLoading = false,
    placeholder = "Type your message...",
    disabled = false,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Handle keyboard shortcuts.
     * Enter to submit, Shift+Enter for new line.
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isLoading && !disabled) {
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
        <form onSubmit={onSubmit} className="flex items-end gap-2">
            <div className="relative flex-1">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isLoading}
                    rows={1}
                    className={cn(
                        "w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 pr-12",
                        "text-sm placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-all duration-200"
                    )}
                    style={{ minHeight: "48px", maxHeight: "200px" }}
                />

                {/* Character hint */}
                <div className="absolute bottom-1 right-14 text-[10px] text-muted-foreground/50">
                    ⏎ send · ⇧⏎ newline
                </div>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={!value.trim() || isLoading || disabled}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    "bg-primary text-primary-foreground",
                    "transition-all duration-200",
                    "hover:bg-primary/90 hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
                aria-label="Send message"
            >
                {isLoading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                    <HiPaperAirplane className="h-5 w-5 rotate-90" />
                )}
            </button>
        </form>
    );
}
