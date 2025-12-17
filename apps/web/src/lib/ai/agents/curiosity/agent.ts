/**
 * Curiosity Agent
 *
 * AI SDK v6 Agent for Curiosity mode - free-form exploration and discovery.
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
    stepCountIs,
} from "ai";
import { gemini } from "../../config";
import { curiosityOptionsSchema, type CuriosityOptions } from "../types";
import { curiosityTools } from "../../tools";
import { buildCuriosityPrompt } from "./prompt";

/**
 * Curiosity Agent - Knowledgeable companion for exploration.
 *
 * Features:
 * - Dynamic system prompt based on course context (or lack thereof)
 * - Tools: suggestFollowUpQuestions
 * - Max 20 steps per conversation turn (more freedom to explore)
 */
export const curiosityAgent = new Agent({
    model: gemini,
    callOptionsSchema: curiosityOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildCuriosityPrompt(options),
    }),

    tools: curiosityTools,

    // Allow more steps for free-form exploration
    stopWhen: stepCountIs(20),
});

/**
 * Type-safe UIMessage type for Curiosity agent.
 * Use with useChat<CuriosityAgentUIMessage> for full type safety.
 */
export type CuriosityAgentUIMessage = InferAgentUIMessage<
    typeof curiosityAgent
>;

export type { CuriosityOptions };
