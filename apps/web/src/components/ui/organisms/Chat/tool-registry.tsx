/**
 * Tool Registry
 *
 * Maps tool names to their React renderers for custom UI in chat messages.
 * Tools not in the registry fall back to the generic ToolInvocation display.
 */

import type { ReactNode } from "react";
import { FollowUpQuestions } from "./tool-renderers/FollowUpQuestions";

/**
 * Props passed to tool renderer components.
 */
export interface ToolRendererProps<TArgs = unknown, TResult = unknown> {
    /** Tool arguments passed by the AI */
    args?: TArgs;
    /** Tool execution result */
    result?: TResult;
    /** Current state of the tool invocation */
    state: "pending" | "result";
    /** Callback to trigger chat actions (e.g., send a message) */
    onAction?: (action: string, payload?: unknown) => void;
}

/**
 * Type for a tool renderer component.
 */
export type ToolRenderer<TArgs = unknown, TResult = unknown> = (
    props: ToolRendererProps<TArgs, TResult>
) => ReactNode;

/**
 * Follow-up questions tool result type.
 */
export interface FollowUpQuestionsResult {
    questions: string[];
}

/**
 * Registry mapping tool names to their renderer components.
 * Add new tools here as they are created.
 */
export const toolRegistry: Record<string, ToolRenderer> = {
    suggestFollowUpQuestions: FollowUpQuestions as ToolRenderer,
};

/**
 * Check if a tool has a custom renderer.
 */
export function hasCustomRenderer(toolName: string): boolean {
    return toolName in toolRegistry;
}

/**
 * Get the renderer for a tool, or undefined if none exists.
 */
export function getToolRenderer(toolName: string): ToolRenderer | undefined {
    return toolRegistry[toolName];
}
