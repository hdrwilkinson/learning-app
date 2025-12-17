/**
 * Check Understanding Tool
 *
 * Performs a quick comprehension check on the user.
 * Used in Learn mode to verify understanding before proceeding.
 */

import { tool } from "ai";
import { z } from "zod";

export const checkUnderstanding = tool({
    description:
        "Perform a quick comprehension check by asking 1-2 verification questions. Use when the user says they understand to verify before proceeding to the next concept.",
    inputSchema: z.object({
        informationPointId: z
            .string()
            .describe("The ID of the information point to check"),
        checkType: z
            .enum(["recall", "application", "comparison"])
            .describe("The type of check to perform"),
        difficulty: z
            .enum(["easy", "medium"])
            .describe("Difficulty level of the verification questions"),
    }),
    execute: async ({
        informationPointId,
        checkType,
        difficulty,
    }: {
        informationPointId: string;
        checkType: "recall" | "application" | "comparison";
        difficulty: "easy" | "medium";
    }) => {
        // In a full implementation, this would:
        // 1. Generate or fetch appropriate verification questions
        // 2. Track that a check is in progress
        // 3. Return question data for the AI to ask

        return {
            success: true,
            informationPointId,
            checkType,
            difficulty,
            // The AI should ask verification questions based on this
            instruction: `Ask ${difficulty} ${checkType} questions to verify understanding`,
            questionCount: difficulty === "easy" ? 1 : 2,
        };
    },
});
