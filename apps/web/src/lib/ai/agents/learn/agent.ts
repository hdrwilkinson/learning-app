/**
 * Learn Agent
 *
 * AI SDK v6 Agent for Learn mode - introducing Information Points to users.
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
    stepCountIs,
} from "ai";
import { gemini } from "../../config";
import { learnOptionsSchema, type LearnOptions } from "../types";
import { learnTools } from "../../tools";
import { buildLearnPrompt } from "./prompt";

/**
 * Learn Agent - Patient tutor for introducing new concepts.
 *
 * Features:
 * - Dynamic system prompt based on IP context
 * - Tools: explainConcept, markUnderstood, checkUnderstanding
 * - Max 15 steps per conversation turn
 */
export const learnAgent = new Agent({
    model: gemini,
    callOptionsSchema: learnOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildLearnPrompt(options),
    }),

    tools: learnTools,

    // Allow up to 15 steps (tool calls) per turn
    stopWhen: stepCountIs(15),
});

/**
 * Type-safe UIMessage type for Learn agent.
 * Use with useChat<LearnAgentUIMessage> for full type safety.
 */
export type LearnAgentUIMessage = InferAgentUIMessage<typeof learnAgent>;

export type { LearnOptions };
