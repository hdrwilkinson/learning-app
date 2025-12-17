/**
 * Explain Concept Tool
 *
 * Re-explains a concept to the user using a different approach.
 * Available in all modes for clarification requests.
 */

import { tool } from "ai";
import { z } from "zod";

export const explainConcept = tool({
    description:
        "Re-explain a concept using a different approach, analogy, or example. Use when the user needs clarification or asks for the concept to be explained differently.",
    inputSchema: z.object({
        conceptId: z
            .string()
            .describe("The ID of the concept/information point"),
        approach: z
            .enum([
                "analogy",
                "example",
                "step_by_step",
                "visual",
                "simplified",
            ])
            .describe("The approach to use for the explanation"),
        context: z
            .string()
            .optional()
            .describe(
                "Additional context about what the user is struggling with"
            ),
    }),
    execute: async ({
        conceptId,
        approach,
        context,
    }: {
        conceptId: string;
        approach:
            | "analogy"
            | "example"
            | "step_by_step"
            | "visual"
            | "simplified";
        context?: string;
    }) => {
        // In a full implementation, this would:
        // 1. Fetch the concept content from the database
        // 2. Log the re-explanation request for analytics
        // 3. Return structured data for the AI to use

        return {
            success: true,
            conceptId,
            approach,
            context,
            // The AI will use this info to craft a new explanation
            instruction: `Provide a ${approach} explanation for this concept`,
        };
    },
});
