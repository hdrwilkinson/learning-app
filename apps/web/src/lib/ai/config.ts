/**
 * AI Provider Configuration
 *
 * Configures Google Gemini as the LLM provider using AI SDK v6.
 * The model is used by all chat agents in the application.
 */

import { google } from "@ai-sdk/google";

/**
 * Default Gemini model for chat agents.
 * Using gemini-2.5-flash-lite for fast, cost-effective responses.
 *
 * Can be overridden via GEMINI_MODEL env var.
 */
export const DEFAULT_MODEL_ID =
    process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

/**
 * Pre-configured Gemini model instance.
 * Used by all agents for consistent model configuration.
 */
export const gemini = google(DEFAULT_MODEL_ID);

/**
 * Create a Gemini model with a specific model ID.
 * Useful when different agents need different model capabilities.
 */
export function createGeminiModel(modelId: string = DEFAULT_MODEL_ID) {
    return google(modelId);
}
