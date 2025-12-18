/**
 * Chat Feature Types
 *
 * Shared types for the chat feature used across all modes.
 */

/**
 * Available chat modes.
 *
 * Course Modes (IP-based):
 * - "learn" - Introducing new Information Points
 * - "quiz" - Testing knowledge of IPs
 * - "reflection" - Understanding mistakes after wrong answers
 *
 * Explore (separate feature):
 * - "curiosity" - Free-form exploration, not tied to IPs
 *
 * @see docs/features/specifications/learning-interaction-modes.md
 */
export type ChatMode = "learn" | "quiz" | "curiosity" | "reflection";

/**
 * Tool invocation state.
 */
export interface ToolInvocation {
    toolName: string;
    state: "pending" | "result";
    args?: Record<string, unknown>;
    result?: unknown;
}

/**
 * Props for tool renderer components.
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
) => React.ReactNode;

/**
 * Follow-up questions tool result type.
 */
export interface FollowUpQuestionsResult {
    questions: string[];
}
