/**
 * Quiz Agent
 *
 * AI SDK v6 Agent for Quiz mode - testing and reinforcing knowledge.
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
    stepCountIs,
} from "ai";
import { gemini } from "../../config";
import { quizOptionsSchema, type QuizOptions } from "../types";
import { quizTools } from "../../tools";
import { buildQuizPrompt } from "./prompt";

/**
 * Quiz Agent - Supportive quiz assistant for testing knowledge.
 *
 * Features:
 * - Dynamic system prompt based on quiz/question context
 * - Tools: none currently
 * - Max 10 steps per conversation turn
 */
export const quizAgent = new Agent({
    model: gemini,
    callOptionsSchema: quizOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildQuizPrompt(options),
    }),

    tools: quizTools,

    // Allow up to 10 steps per turn (usually just 1-2 for answer evaluation)
    stopWhen: stepCountIs(10),
});

/**
 * Type-safe UIMessage type for Quiz agent.
 * Use with useChat<QuizAgentUIMessage> for full type safety.
 */
export type QuizAgentUIMessage = InferAgentUIMessage<typeof quizAgent>;

export type { QuizOptions };
