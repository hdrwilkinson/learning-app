/**
 * Suggest Follow-up Questions Tool
 *
 * Suggests 2-3 follow-up questions for the user to explore.
 * Used in Curiosity mode to encourage deeper learning after explanations.
 */

import { tool } from "ai";
import { z } from "zod";

export const suggestFollowUpQuestions = tool({
    description:
        "Suggest 2-3 follow-up questions for the user to explore. Use at the end of explanations to encourage deeper learning and guide the conversation.",
    inputSchema: z.object({
        questions: z
            .array(z.string())
            .min(2)
            .max(3)
            .describe("Array of 2-3 follow-up questions"),
    }),
    execute: async ({ questions }: { questions: string[] }) => {
        // Simply return the questions - the UI will render them as clickable buttons
        return { questions };
    },
});
