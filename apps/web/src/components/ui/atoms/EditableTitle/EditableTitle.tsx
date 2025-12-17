/**
 * EditableTitle Component
 *
 * A borderless, editable title input that auto-saves on blur.
 * Used in the Explore chat header to allow users to rename conversations.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface EditableTitleProps {
    /** Current title value */
    value: string;
    /** Callback when title is saved (on blur) */
    onSave: (newTitle: string) => Promise<void> | void;
    /** Placeholder text when empty */
    placeholder?: string;
    /** Whether the title is editable */
    editable?: boolean;
    /** Additional class names */
    className?: string;
    /** Icon to display before the title */
    icon?: React.ReactNode;
}

export function EditableTitle({
    value,
    onSave,
    placeholder = "Untitled",
    editable = true,
    className,
    icon,
}: EditableTitleProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const originalValueRef = useRef(value);

    // Sync with external value changes
    useEffect(() => {
        setLocalValue(value);
        originalValueRef.current = value;
    }, [value]);

    const handleBlur = useCallback(async () => {
        const trimmedValue = localValue.trim();

        // Don't save if unchanged or empty
        if (trimmedValue === originalValueRef.current || !trimmedValue) {
            setLocalValue(originalValueRef.current);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(trimmedValue);
            originalValueRef.current = trimmedValue;
        } catch {
            // Revert on error
            setLocalValue(originalValueRef.current);
        } finally {
            setIsSaving(false);
        }
    }, [localValue, onSave]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
        } else if (e.key === "Escape") {
            setLocalValue(originalValueRef.current);
            inputRef.current?.blur();
        }
    };

    if (!editable) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                {icon && <span className="text-xl">{icon}</span>}
                <h1 className="text-lg font-semibold text-foreground">
                    {value || placeholder}
                </h1>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
            <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isSaving}
                className={cn(
                    "text-lg font-semibold text-foreground",
                    "bg-transparent border-none outline-none",
                    "w-full min-w-0",
                    "placeholder:text-muted-foreground",
                    "focus:ring-0",
                    "hover:bg-surface-1 focus:bg-surface-1",
                    "rounded px-1 -mx-1 py-0.5 -my-0.5",
                    "transition-colors duration-150",
                    isSaving && "opacity-50 cursor-wait"
                )}
                aria-label="Edit conversation title"
            />
        </div>
    );
}
