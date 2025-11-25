# AI Assistant Architecture: A Complete Reference Guide

This document provides a comprehensive blueprint for building an agentic AI assistant with multi-step tool execution, human-in-the-loop confirmation, and robust safeguards. It is framework-agnostic in principle while drawing from a production implementation using Vercel AI SDK v5 and React.

---

## Table of Contents

1. [Core Architecture Overview](#1-core-architecture-overview)
2. [Tool System](#2-tool-system)
3. [Chat Safeguards & Loop Prevention](#3-chat-safeguards--loop-prevention)
4. [Turn Tracking & Isolation](#4-turn-tracking--isolation)
5. [Auto-Continuation Logic](#5-auto-continuation-logic)
6. [System Prompts](#6-system-prompts)
7. [Message Parts & Types](#7-message-parts--types)
8. [Context Management](#8-context-management)
9. [State Persistence](#9-state-persistence)
10. [Template Prompts](#10-template-prompts)
11. [Settings & User Preferences](#11-settings--user-preferences)

---

## 1. Core Architecture Overview

### Why

An agentic assistant must orchestrate multiple tool calls across a conversation while maintaining stability, preventing infinite loops, and providing a responsive user experience. The architecture separates concerns into composable hooks and a centralized context provider.

### What

The system consists of:

- **Chat Hook** (`useAssistantChat`): Low-level chat mechanics, tool execution, streaming
- **Safeguards Hook** (`useChatSafeguards`): Loop prevention, duplicate detection
- **Turn Tracking Hook** (`useTurnTracking`): Turn isolation, step counting
- **Context Management Hook** (`useContextManagement`): Context window awareness
- **Context Provider** (`AssistantChatProvider`): Orchestrates all hooks, manages state

### How

```
┌──────────────────────────────────────────────────────────────┐
│                  AssistantChatProvider                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    useAssistantChat                      │ │
│  │  - Manages AI SDK connection                            │ │
│  │  - Handles tool callbacks                               │ │
│  │  - Controls auto-continuation                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ useSafeguards│  │useTurnTracking│  │useContextManagement│  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Redux State                           │ │
│  │  - Messages persistence                                  │ │
│  │  - Settings (model, tools, preferences)                  │ │
│  │  - Todos, Notepad                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

The provider composes all hooks and exposes a unified interface to UI components via React Context.

---

## 2. Tool System

### Why

Tools extend the AI's capabilities by allowing it to interact with external systems. A unified tool definition system ensures type safety, consistent UI rendering, and seamless server/client coordination.

### What

Each tool is defined once with:

- **Input Schema**: Zod schema for validation
- **Output Type**: TypeScript type for the result
- **AI Description**: Description provided to the model
- **UI Configuration**: How the tool renders (silent, confirmation, card)
- **Execution Configuration**: Auto-execute, confirmation flow, context tracking

### How

#### Tool Definition Structure

```typescript
interface ToolDefinition<TInput extends z.ZodType, TOutput> {
    name: string;
    inputSchema: TInput;
    outputType: TOutput;
    aiDescription: string;

    ui: {
        description: string; // User-facing description
        renderer: "silent" | "confirmation" | "card";
        hideInTranscript?: boolean;
        userToggleable: boolean; // Can user enable/disable?
        defaultEnabled: boolean;
        icon?: ComponentType<{ className?: string }>;
    };

    confirmation?: {
        buildPrompt: (input: z.infer<TInput>) => string;
        buildPendingText: (input: z.infer<TInput>) => string;
    };

    outcome?: {
        buildText: (output: TOutput) => string | undefined;
    };

    execution: {
        isCore: boolean; // Always enabled?
        clientOnly?: boolean; // Not sent to AI model?
        addsContext?: boolean; // Contributes to context window?
        extractContextPayload?: (
            output: TOutput
        ) => string | object | undefined;
        autoExecute?: (args: AutoExecArgs<TInput>) => void | Promise<void>;
        confirmAndExecute?: (
            args: AutoExecArgs<TInput>
        ) => void | Promise<void>;
    };
}
```

#### Tool Renderer Types

| Renderer       | Description                   | Execution Flow                                        |
| -------------- | ----------------------------- | ----------------------------------------------------- |
| `silent`       | No UI, executes automatically | `autoExecute` called immediately on tool call         |
| `confirmation` | Shows confirm/cancel buttons  | Waits for user confirmation, then `confirmAndExecute` |
| `card`         | Rich card UI                  | Custom rendering based on output                      |

#### Creating a Silent Tool (Auto-Execute)

```typescript
export const getCurrentTime = defineToolClientSide({
    name: "getCurrentTime",
    inputSchema: z.object({ timeZone: z.string().optional() }),
    outputType: "" as string,

    aiDescription: "Get the current time for the user (read-only).",

    ui: {
        description: "Return the current local date and time.",
        renderer: "silent",
        userToggleable: false,
        defaultEnabled: true,
    },

    execution: {
        isCore: true,
        autoExecute: ({ input, toolCallId, addToolResult, context }) => {
            const now = new Date();
            const timeString = now.toLocaleString("en-US", {
                timeZone: context?.userTimezone,
            });

            void addToolResult({
                tool: "getCurrentTime",
                toolCallId,
                output: `The current time is ${timeString}`,
            });
        },
    },
});
```

#### Creating a Confirmation Tool

```typescript
export const queryCalls = defineToolClientSide({
    name: "queryCalls",
    inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(100),
        before: z.string().optional(),
        after: z.string().optional(),
    }),
    outputType: {} as {
        confirmed: boolean;
        result?: Record<string, string>;
        error?: string;
    },

    aiDescription: "Query calls with filters (single batch).",

    ui: {
        description: "Fetch calls using filters.",
        renderer: "confirmation",
        userToggleable: true,
        defaultEnabled: true,
        icon: PhoneIcon,
    },

    confirmation: {
        buildPrompt: (input) => `Fetch ${input.limit} calls?`,
        buildPendingText: (input) => `Fetching up to ${input.limit} calls...`,
    },

    outcome: {
        buildText: (output) => {
            if (output.confirmed) {
                const count = output.result
                    ? Object.keys(output.result).length
                    : 0;
                return `Loaded ${count} calls`;
            }
            return "Fetch cancelled";
        },
    },

    execution: {
        isCore: false,
        addsContext: true,
        extractContextPayload: (output) => output.result ?? undefined,
        confirmAndExecute: async ({ input, toolCallId, addToolResult }) => {
            try {
                const response = await apiService.queryCalls(input);
                await addToolResult({
                    tool: "queryCalls",
                    toolCallId,
                    output: {
                        confirmed: true,
                        result: response,
                        count: Object.keys(response).length,
                    },
                });
            } catch (error) {
                await addToolResult({
                    tool: "queryCalls",
                    toolCallId,
                    output: { confirmed: true, error: "Failed to query calls" },
                });
            }
        },
    },
});
```

#### Tool Registry

All tools are registered in a central registry that provides lookup and filtering functions:

```typescript
const TOOL_DEFINITIONS = {
    getCurrentTime,
    queryCalls,
    todo_write,
    // ... other tools
};

// Helper functions
function getClientTool(name: string): ToolDefinition | undefined;
function getToggleableTools(): Array<{ name: string; description: string }>;
function getDefaultEnabledToolsMap(): Record<string, boolean>;
function isContextAddingTool(name: string): boolean;

// Generate server-side tool configs for the AI model
function generateServerToolConfigs(
    enabledNames?: Set<string>
): Record<string, ToolConfig>;
```

---

## 3. Chat Safeguards & Loop Prevention

### Why

Multi-step tool execution can lead to infinite loops if the AI continuously calls tools without completing. Safeguards prevent runaway execution while allowing legitimate multi-step workflows.

### What

The safeguard system provides:

- **Circuit Breaker**: Limits auto-sends per user turn
- **Duplicate Detection**: Prevents identical tool calls within a time window
- **Auto-Send Gating**: One auto-send per new tool result
- **Error Recovery**: Blocks auto-continue after errors

### How

#### Configuration

```typescript
interface SafeguardConfig {
    maxAutoSends?: number; // Default: 20
    duplicateWindowMs?: number; // Default: 2000ms
    enableDuplicateDetection?: boolean;
}
```

#### Key Mechanisms

**1. Circuit Breaker**
Tracks auto-send count per turn. Once `maxAutoSends` is reached, further auto-continuation is blocked.

```typescript
const canAutoSend = (messages, status) => {
    if (autoSendCount >= maxAutoSends) {
        circuitBreakerTriggered = true;
        return false;
    }
    // ... other checks
};
```

**2. Tool Result Counting**
In AI SDK v5, tool results accumulate on the same assistant message. The safeguard tracks the count of completed tool results and only allows auto-continuation when new results appear.

```typescript
const currentToolResultCount = message.parts.filter(
    (p) => isToolCallPart(p) && p.state === "output-available"
).length;

if (currentToolResultCount === lastAutoSendToolResultCount) {
    return false; // No new results
}
```

**3. Cancelled Tool Detection**
If a user cancels a confirmation tool (sets `confirmed: false`), auto-continuation stops.

```typescript
function hasAnyCancelledTools(message): boolean {
    return message.parts.some(
        (p) =>
            isToolCallPart(p) &&
            p.state === "output-available" &&
            p.output?.confirmed === false
    );
}
```

**4. Error Recovery**
After an error, the system blocks auto-continuation for a configurable window (default 3 seconds) and tracks consecutive errors.

```typescript
const ERROR_WINDOW_MS = 3000;
const MAX_CONSECUTIVE_ERRORS = 3;

const recordError = (messageId) => {
    recentErrors.push({ timestamp: Date.now(), messageId });
    lastAutoSendToolResultCount = currentCount; // Prevent immediate retry
};
```

#### Usage Pattern

```typescript
const safeguards = useChatSafeguards({
  maxAutoSends: 20,
  duplicateWindowMs: 2000,
  enableDuplicateDetection: true,
});

// In chat hook config
canAutoSend: (messages, status) => safeguards.canAutoSend(messages, status),
onAutoSend: (messageId) => safeguards.recordAutoSendForMessage(messageId, messages),
onErrorRecord: (messageId) => safeguards.recordError(messageId, messages),

// On new user message
safeguards.reset();
```

---

## 4. Turn Tracking & Isolation

### Why

When a user submits a message, the AI may execute multiple tool calls across several round trips. If the user changes settings (model, enabled tools, auto-execute preferences) mid-turn, those changes should not affect the in-flight request.

### What

Turn tracking provides:

- **Turn ID**: Unique identifier for the conversation turn
- **Step Index**: Counter for steps within a turn
- **Snapshot**: Frozen settings at turn start

### How

```typescript
interface TurnSnapshot {
    modelId: string | null;
    enabledTools: string[] | null;
    autoExecuteMap: Record<string, boolean> | null;
}

function useTurnTracking() {
    const turnIdRef = useRef<string>("");
    const stepIndexRef = useRef<number>(0);
    const snapshotRef = useRef<TurnSnapshot>({
        modelId: null,
        enabledTools: null,
        autoExecuteMap: null,
    });

    const startNewTurn = (snapshot: TurnSnapshot) => {
        turnIdRef.current = `turn-${generateId()}`;
        stepIndexRef.current = 0;
        snapshotRef.current = snapshot;
        return turnIdRef.current;
    };

    const incrementStep = () => {
        stepIndexRef.current += 1;
    };

    const getCurrentSnapshot = () => snapshotRef.current;

    // ... other methods
}
```

#### Usage in Chat Flow

```typescript
// On user submit
const handleSubmit = (text: string) => {
    // Freeze current settings for this turn
    turnTracking.startNewTurn({
        modelId: selectedModelId,
        enabledTools: currentEnabledToolNames,
        autoExecuteMap: { ...toolAutoExecuteMap },
    });

    // Reset safeguards
    safeguards.reset();

    // Send message
    chat.sendMessage({ parts: [{ type: "text", text }] });
};

// In request preparation
const snapshot = turnTracking.getCurrentSnapshot();
const modelId = snapshot.modelId ?? config.selectedModelId;
const enabledTools = snapshot.enabledTools ?? config.enabledTools;
```

---

## 5. Auto-Continuation Logic

### Why

For agentic workflows, the AI should automatically continue after tool results without user intervention. This creates a seamless multi-step execution experience.

### What

Auto-continuation is triggered when:

1. The last assistant message has completed tool calls
2. All safeguards pass
3. The chat is not currently streaming

### How

#### SDK Integration

The AI SDK provides a `sendAutomaticallyWhen` callback that determines when to auto-send:

```typescript
useChat({
    sendAutomaticallyWhen: (options) => {
        // Essential safeguards
        if (userSubmitInProgress) return false;
        if (stopInitiated) return false;
        if (!safeguards.canAutoSend(options.messages, status)) return false;

        // SDK's built-in check for complete tool calls
        const shouldSend = lastAssistantMessageIsCompleteWithToolCalls(options);

        if (shouldSend) {
            safeguards.recordAutoSend();
        }

        return shouldSend;
    },
});
```

#### Tool Call Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ User Message                                                 │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ AI Response with Tool Call (state: 'input-available')       │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ Tool Execution                                               │
│ - Silent: autoExecute() called immediately                  │
│ - Confirmation: Wait for user, then confirmAndExecute()     │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ addToolResult() called (state: 'output-available')          │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ sendAutomaticallyWhen() checks:                             │
│ - Safeguards pass?                                          │
│ - All tool calls complete?                                  │
│ → Auto-continue to next AI response                         │
└─────────────────────────────────────────────────────────────┘
```

#### Handling User-Initiated Stop

When the user clicks "Stop":

1. Cancel all pending tool confirmations
2. Set stop flag to suppress error handling
3. Call SDK's stop method

```typescript
const stop = async () => {
    stopInitiatedRef.current = true;
    lastStopTsRef.current = Date.now();

    // Cancel pending confirmations
    await cancelPendingToolConfirmations(messages);

    // Stop streaming
    await sdkStop();
};

// In error handler, suppress errors shortly after stop
const onError = (error) => {
    const recentlyStopped = Date.now() - lastStopTsRef.current < 1000;
    if (recentlyStopped || stopInitiatedRef.current) {
        stopInitiatedRef.current = false;
        return; // Suppress expected abort errors
    }
    // Handle actual errors...
};
```

---

## 6. System Prompts

### Why

The system prompt defines the AI's behavior, capabilities, and constraints. For agentic assistants, it must clearly specify the multi-step execution workflow, stopping conditions, and tool usage guidelines.

### What

A comprehensive system prompt includes:

- Identity and role
- Multi-step execution workflow
- Stopping conditions
- Tool constraints and capabilities
- Examples of correct behavior
- Domain expertise

### How

#### Key Sections

**1. Multi-Step Workflow Instructions**

```markdown
CRITICAL: You operate in a multi-step tool environment. After each tool call,
the system automatically re-invokes you with results.

STOPPING CONDITIONS (Only stop when):

1. All planned work complete AND final answer provided
2. Error requiring human intervention
3. User explicitly requests to stop

NEVER STOP AFTER:

- Creating a plan (must immediately start execution)
- A single tool call completes (continue to next tool)
- Marking a todo in_progress (must call the work tool immediately)
```

**2. Planning and Execution Pattern**

```markdown
PLANNING PHASE: Create execution plan using todos (Plan-first)
• Before calling any data tools, create a complete plan as todos
• For large operations, create separate todos for each batch
• After creating the plan, IMMEDIATELY continue to execution in the SAME response

ACTION PHASE: Execute todos sequentially with conversational updates
• CRITICAL EXECUTION ORDER for each todo:

1. Conversational update (1-2 sentences)
2. Status update tool: [todo_write mark in_progress]
3. Work tool: [queryCalls] or other action tool
4. System auto-continues after tools complete
```

**3. Message Structure Rule**

```markdown
MESSAGE STRUCTURE FORMULA:
[Optional brief text] + [One or more tool calls] + [Nothing after tools]

CORRECT: "Fetching calls now." + [todo_write] + [queryCalls]
WRONG: [queryCalls] + "I've fetched the calls." ← Blocks auto-continue
WRONG: Text-only message without tool calls ← Requires manual "continue"
```

**4. Tool Constraints**

```markdown
queryCalls: Max 100 per call; plan multiple calls for >100; total cap 5000
• Supports filters: states, originatedTypes, followUpStatuses, qualityOutcomes
• Time filters: before/after (ISO 8601)
• Order: newest first; use before-cursor for older pages

todo_write: Unified todo management with merge support
• merge=false: Replace entire list (initial planning, min 2 todos)
• merge=true: Update specific todos by ID (status changes, 1+ todos)
• Use ACTUAL todo IDs from responses, not indices
```

---

## 7. Message Parts & Types

### Why

AI messages can contain multiple types of content: text, reasoning, tool calls, and custom parts. A well-defined type system enables proper rendering and handling.

### What

```typescript
type MessagePart =
    | TextPart // Regular text content
    | ReasoningPart // Model's internal reasoning (if supported)
    | ToolCallPart // Tool invocation with state
    | DynamicToolPart // Dynamic/MCP tools without compile-time schemas
    | SuggestedQuestionsPart; // Follow-up question buttons
```

### How

#### Tool Call States

```typescript
type ToolCallState =
    | "input-streaming" // Tool input being streamed from model
    | "input-available" // Tool input complete, ready for execution
    | "output-available" // Tool executed successfully
    | "output-error"; // Tool execution failed
```

#### Type Guards

```typescript
function isTextPart(part: MessagePart): part is TextPart {
    return part.type === "text";
}

function isToolCallPart(part: MessagePart): part is ToolCallPart {
    return typeof part.type === "string" && part.type.startsWith("tool-");
}

function extractToolName(type: string): string | undefined {
    if (!type.startsWith("tool-")) return undefined;
    return type.replace("tool-", "");
}
```

#### Suggested Questions

The AI can include follow-up suggestions in responses:

```typescript
interface SuggestedQuestionsPart {
    type: "suggested-questions";
    questions: Array<{
        text: string;
        action: "template" | "message";
        templateId?: string; // For template action
        message?: string; // For message action
    }>;
}
```

---

## 8. Context Management

### Why

LLMs have finite context windows. The system must track context usage and handle overflow gracefully, preventing auto-continuation when context limits are approached.

### What

- Track context window utilization
- Detect context overflow signals from server
- Block auto-continuation during context-heavy operations
- Track which tools add to context

### How

```typescript
function useContextManagement(config: {
    selectedModelId?: string;
    systemPrompt: string;
}) {
    const ingestingCallIdsRef = useRef<Set<string>>(new Set());
    const contextOverflowHoldRef = useRef<boolean>(false);

    const checkMessage = (message: UIMessage) => {
        if (message.metadata?.contextOverflow === true) {
            contextOverflowHoldRef.current = true;
        }
    };

    const isContextOverflowHeld = () => contextOverflowHoldRef.current;

    return {
        ingestingCallIds: ingestingCallIdsRef.current,
        checkMessage,
        isContextOverflowHeld,
        // ... other methods
    };
}
```

#### Context-Aware Auto-Send

```typescript
canAutoSend: (messages, status) => {
    // Block during context ingestion
    if (contextManager.ingestingCallIds.size > 0) return false;
    if (contextManager.isContextOverflowHeld()) return false;
    return safeguards.canAutoSend(messages, status);
};
```

#### Context Estimation in Requests

```typescript
prepareSendMessagesRequest: ({ messages }) => {
    let messageTokens = 0;
    for (const msg of messages) {
        for (const part of msg.parts ?? []) {
            if (part.type === "text") {
                messageTokens += Math.ceil(part.text.length / 4); // ~4 chars per token
            }
        }
    }

    const systemTokens = Math.ceil(systemPrompt.length / 4);
    const currentTokens = systemTokens + messageTokens;
    const utilizationPercent = (currentTokens / contextWindow) * 100;

    return {
        body: {
            messages,
            context: {
                currentTokens,
                totalCapacity: contextWindow,
                utilizationPercent,
            },
        },
    };
};
```

---

## 9. State Persistence

### Why

Chat history, settings, and in-progress work (todos, notepad) should persist across page refreshes and sessions.

### What

Persisted state includes:

- Chat messages (serialized UIMessage[])
- Selected model ID
- Tool enablement preferences
- Auto-execute preferences
- Todos (AI-managed task list)
- Notepad content
- Token usage tracking

### How

#### Redux Slice Structure

```typescript
interface AiAssistantState {
    isAssistantPanelOpen: boolean;
    chatMessages: string; // JSON-serialized UIMessage[]
    selectedModelId: string;
    thinkingEnabled: boolean;
    thinkingPreferred: boolean;
    todos: TodoItem[];
    enabledTools: Record<string, boolean>;
    toolAutoExecute: Record<string, boolean>;
    isNotepadOpen: boolean;
    notepadMarkdown: string;
    lastInputTokens: number;
    lastTotalTokens: number;
    customPromptTemplates: Record<string, string>;
}
```

#### Throttled Persistence

During streaming, persist messages on a throttle to avoid excessive Redux updates:

```typescript
useEffect(() => {
    if (chat.messages.length === 0) return;

    const isStreaming =
        chat.status === "streaming" || chat.status === "submitted";

    if (isStreaming) {
        // Throttle during streaming (2 seconds)
        if (throttledPersistTimeout) clearTimeout(throttledPersistTimeout);
        throttledPersistTimeout = setTimeout(() => {
            persistMessages(chat.messages, "throttled_stream");
        }, 2000);
    } else {
        // Immediate persistence when streaming finishes
        if (throttledPersistTimeout) clearTimeout(throttledPersistTimeout);
        persistMessages(chat.messages, "stream_finish");
    }
}, [chat.messages, chat.status]);
```

#### Message Hydration on Load

```typescript
useEffect(() => {
    if (chat.messages.length === 0 && persistedMessages.length > 0) {
        // Validate and sanitize persisted messages
        const hydratedMessages = isValidUIMessageArray(persistedMessages)
            ? persistedMessages
            : sanitizeUIMessages(persistedMessages);

        // Validate tool call sequences
        const validation = validateToolCallSequence(hydratedMessages);
        if (!validation.valid) {
            log.warn("hydration_tool_call_issues", {
                errors: validation.errors,
            });
        }

        chat.setMessages(hydratedMessages);
    }
}, []);
```

---

## 10. Template Prompts

### Why

Pre-defined templates guide users through complex workflows with structured inputs. They reduce friction and ensure the AI receives well-formed requests.

### What

A template consists of:

- ID, title, subtitle
- Base prompt text
- Input fields with types and validation
- Optional header builder (adds metadata to the message)
- Optional visible message builder (user-friendly display)

### How

#### Template Types

```typescript
type TemplateFieldType =
    | "text"
    | "textarea"
    | "select"
    | "date"
    | "workflow-selector"
    | "time-range-preset"
    | "date-of-birth";

interface TemplatePrompt {
    id: string;
    title: string;
    subtitle: string;
    prompt: string;
    fields: TemplateField[];
    headerBuilder?: (fieldValues: TemplateFieldValues) => string;
    buildVisibleMessage?: (fieldValues: TemplateFieldValues) => string;
}
```

#### Example Template

```typescript
export const callReasonAnalysisTemplate: TemplatePrompt = {
    id: "call-reason-analysis",
    title: "Call Reasons Analysis",
    subtitle: "Select a workflow and time range to analyze call reasons.",
    prompt: DETAILED_ANALYSIS_PROMPT,
    fields: [
        {
            id: "workflow",
            label: "Workflow",
            type: "workflow-selector",
            required: true,
        },
        {
            id: "timeRange",
            label: "Time Range",
            type: "time-range-preset",
            required: true,
        },
        {
            id: "customPrompt",
            label: "Custom Prompt (Optional)",
            type: "textarea",
            required: false,
            rows: 3,
        },
    ],
    headerBuilder: (fieldValues) => {
        // Build structured header with workflow ID, time range, etc.
        return `[[CALL_REASON_ANALYSIS]] v1\n${JSON.stringify({
            workflowId: fieldValues.workflow,
            range: fieldValues.timeRange,
        })}`;
    },
    buildVisibleMessage: (fieldValues) => {
        return `Call reason analysis for ${fieldValues.workflowName} between ${fieldValues.timeRange}`;
    },
};
```

#### Template Registry

```typescript
export const templateRegistry: TemplateRegistry = {
    "call-reason-analysis": callReasonAnalysisTemplate,
    astrology: astrologyTemplate,
    // Add more templates here
};
```

---

## 11. Settings & User Preferences

### Why

Users need control over AI behavior—model selection, tool enablement, and automation preferences—while defaults should work well out of the box.

### What

User-configurable settings:

- **Model Selection**: Choose from available AI models
- **Thinking/Reasoning**: Enable extended thinking for supported models
- **Tool Enablement**: Toggle individual tools on/off
- **Auto-Execute**: Skip confirmation for specific tools

### How

#### Tool Enablement

```typescript
// Get default enabled state for all toggleable tools
function getDefaultEnabledToolsMap(): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    for (const tool of Object.values(TOOL_DEFINITIONS)) {
        if (tool.userToggleable) {
            map[tool.name] = tool.defaultEnabled ?? true;
        }
    }
    return map;
}

// Merge defaults with user preferences (handles new tools gracefully)
const selectEffectiveEnabledTools = createSelector(
    [selectEnabledToolsRaw],
    (userPrefs): Record<string, boolean> => {
        const defaults = getDefaultEnabledToolsMap();
        return { ...defaults, ...(userPrefs ?? {}) };
    }
);
```

#### Auto-Execute for Confirmation Tools

```typescript
// Per-tool auto-execute preference
interface State {
    toolAutoExecute: Record<string, boolean>;
}

// In tool callback
if (toolConfig.renderer === "confirmation" && autoExecMap[toolCall.toolName]) {
    // Execute automatically without confirmation UI
    toolConfig.confirmAndExecute({ input, toolCallId, addToolResult });
} else {
    // Show confirmation UI and wait
}
```

#### Settings UI Visibility

Some tools should be hidden from settings (internal/core tools):

```typescript
function getSettingsVisibleTools() {
    const excludedFromSettings = new Set([
        "askForConfirmation",
        "todo_write",
        "getCurrentTime",
        "read_notepad",
        "update_notepad",
    ]);

    return Object.values(TOOL_DEFINITIONS)
        .filter((t) => t.userToggleable && !excludedFromSettings.has(t.name))
        .map((t) => ({
            name: t.name,
            description: t.description,
            defaultEnabled: t.defaultEnabled,
        }));
}
```

---

## Quick Reference: Adding a New Tool

1. **Create the tool definition file** in `tools/definitions/yourTool/yourTool.ts`
2. **Define input schema** using Zod
3. **Define output type** as TypeScript interface
4. **Choose renderer**: `silent`, `confirmation`, or `card`
5. **Implement execution**: `autoExecute` (silent) or `confirmAndExecute` (confirmation)
6. **Register in index**: Add to `TOOL_DEFINITIONS` in `tools/index.ts`
7. **Add to server** (if not client-only): Include in server-side tool generation

```typescript
// Minimal silent tool
export const myTool = defineToolClientSide({
    name: "myTool",
    inputSchema: z.object({ param: z.string() }),
    outputType: {} as { ok: boolean; data?: string },
    aiDescription: "Description for the AI model",
    ui: {
        description: "Description for users",
        renderer: "silent",
        userToggleable: false,
        defaultEnabled: true,
    },
    execution: {
        isCore: true,
        autoExecute: async ({ input, toolCallId, addToolResult }) => {
            const result = await doSomething(input.param);
            await addToolResult({
                tool: "myTool",
                toolCallId,
                output: { ok: true, data: result },
            });
        },
    },
});
```

---

## Summary

This architecture provides a robust foundation for building agentic AI assistants with:

- **Unified Tool System**: Single definition for schema, UI, and execution
- **Multi-Step Execution**: Automatic continuation with comprehensive safeguards
- **Turn Isolation**: Settings frozen per conversation turn
- **Context Awareness**: Track and manage context window usage
- **Flexible Persistence**: Messages, settings, and work-in-progress state
- **User Control**: Configurable model, tools, and automation preferences

The separation of concerns into composable hooks makes the system testable, maintainable, and adaptable to different AI SDKs or frameworks.
