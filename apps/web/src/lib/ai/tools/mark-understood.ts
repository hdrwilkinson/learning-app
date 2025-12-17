/**
 * Mark Understood Tool
 *
 * Marks an Information Point as understood by the user.
 * Used in Learn mode when the user confirms understanding.
 */

import { tool } from "ai";
import { z } from "zod";

export const markUnderstood = tool({
    description:
        'Mark an information point as understood by the user. Use when the user explicitly indicates they understand the concept (e.g., "I got it", "That makes sense", "I understand now").',
    inputSchema: z.object({
        informationPointId: z
            .string()
            .describe("The ID of the information point being marked"),
        confidence: z
            .enum(["low", "medium", "high"])
            .describe(
                "Estimated confidence level based on the conversation quality"
            ),
        notes: z
            .string()
            .optional()
            .describe(
                "Any notes about the understanding (e.g., areas of strength)"
            ),
    }),
    execute: async ({
        informationPointId,
        confidence,
        notes,
    }: {
        informationPointId: string;
        confidence: "low" | "medium" | "high";
        notes?: string;
    }) => {
        // In a full implementation, this would:
        // 1. Update the IP progress in the database
        // 2. Set state to 'introduced' or 'learning'
        // 3. Trigger any necessary state transitions

        return {
            success: true,
            informationPointId,
            confidence,
            notes,
            message: "Information point marked as understood",
            // Signal to the UI that the user can proceed
            canProceed: true,
        };
    },
});
