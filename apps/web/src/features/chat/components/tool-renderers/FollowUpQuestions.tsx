/**
 * Follow-up Questions Tool Renderer
 *
 * Renders clickable question buttons that send the question as a new message.
 * Used in Curiosity mode to guide exploration.
 * Disappears from chat history once a question is clicked.
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ToolRendererProps, FollowUpQuestionsResult } from "../../types";

/**
 * Renders follow-up question suggestions as clickable pill buttons.
 * Hides completely once any question is clicked.
 */
export function FollowUpQuestions({
    result,
    state,
    onAction,
}: ToolRendererProps<unknown, FollowUpQuestionsResult>) {
    const [clicked, setClicked] = useState(false);

    // Don't render if already clicked
    if (clicked) {
        return null;
    }

    // Don't render anything while pending
    if (state === "pending") {
        return null;
    }

    // Check if we have valid questions
    const questions = result?.questions;
    if (!questions || questions.length === 0) {
        return null;
    }

    /**
     * Handle question click - sends the question as a new user message and hides this component.
     */
    const handleQuestionClick = (question: string) => {
        setClicked(true);
        onAction?.("sendMessage", question);
    };

    return (
        <div className="mt-4">
            <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm",
                            "bg-surface-2 hover:bg-surface-3",
                            "border border-border/50 hover:border-accent/50",
                            "text-foreground/90 hover:text-foreground",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
                        )}
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
}
