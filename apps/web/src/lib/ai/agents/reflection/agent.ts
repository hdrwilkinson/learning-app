/**
 * Reflection Agent
 *
 * AI SDK v6 Agent for Reflection mode - understanding after wrong answers.
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
    stepCountIs,
} from "ai";
import { gemini } from "../../config";
import { reflectionOptionsSchema, type ReflectionOptions } from "../types";
import { buildReflectionPrompt } from "./prompt";

/**
 * Tools available to the Reflection agent.
 * Currently none - pure conversational guidance.
 */
const tools = {};

/**
 * Reflection Agent - Supportive guide for understanding after mistakes.
 *
 * Features:
 * - Dynamic system prompt based on question/answer context
 * - Tools: none currently
 * - Max 15 steps per conversation turn
 */
export const reflectionAgent = new Agent({
    model: gemini,
    callOptionsSchema: reflectionOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildReflectionPrompt(options),
    }),

    tools,

    // Allow enough steps for thorough re-explanation
    stopWhen: stepCountIs(15),
});

/**
 * Type-safe UIMessage type for Reflection agent.
 * Use with useChat<ReflectionAgentUIMessage> for full type safety.
 */
export type ReflectionAgentUIMessage = InferAgentUIMessage<
    typeof reflectionAgent
>;

export type { ReflectionOptions };
