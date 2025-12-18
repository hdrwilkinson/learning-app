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
import { buildLearnPrompt } from "./prompt";

/**
 * Tools available to the Learn agent.
 * Currently none - pure conversational tutoring.
 */
const tools = {};

/**
 * Learn Agent - Patient tutor for introducing new concepts.
 *
 * Features:
 * - Dynamic system prompt based on IP context
 * - Tools: none currently
 * - Max 15 steps per conversation turn
 */
export const learnAgent = new Agent({
    model: gemini,
    callOptionsSchema: learnOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildLearnPrompt(options),
    }),

    tools,

    // Allow up to 15 steps (tool calls) per turn
    stopWhen: stepCountIs(15),
});

/**
 * Type-safe UIMessage type for Learn agent.
 * Use with useChat<LearnAgentUIMessage> for full type safety.
 */
export type LearnAgentUIMessage = InferAgentUIMessage<typeof learnAgent>;

export type { LearnOptions };
