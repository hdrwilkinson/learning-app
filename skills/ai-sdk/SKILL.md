# AI SDK - Chat & Agent Implementation

> **Skill for implementing AI-powered chat features using Vercel AI SDK v6.**

## Purpose

Provides reliable guidance for implementing chat functionality, AI agents, and tools using the AI SDK. Uses browser navigation to access official documentation when needed.

## When This Skill Triggers

- Implementing chat features (`useChat`, `streamText`)
- Creating AI agents or tools
- Debugging AI/LLM integrations
- Keywords: "AI SDK", "useChat", "streamText", "chat functionality", "AI agent"

---

## Quick Reference: Current Codebase Implementation

The learning-app uses AI SDK v6 with the following structure:

```
apps/web/src/lib/ai/
├── config.ts          # LLM provider setup (Gemini)
├── agents/            # Agent definitions by mode
│   ├── base-prompt.ts # Shared system prompt
│   ├── types.ts       # Agent types and schemas
│   ├── curiosity/     # Curiosity mode agent
│   │   ├── agent.ts
│   │   ├── prompt.ts
│   │   └── index.ts
│   └── ...            # Other mode agents
└── tools/             # Tool definitions
    ├── index.ts       # Tool exports
    └── suggest-follow-up-questions.ts
```

---

## Workflow

### TODO 1: Understand Current Implementation

Before making changes, read the existing AI setup:

```bash
# Read in this order:
apps/web/src/lib/ai/config.ts           # Provider config
apps/web/src/lib/ai/agents/types.ts     # Type definitions
apps/web/src/lib/ai/agents/base-prompt.ts
apps/web/src/lib/ai/tools/index.ts
```

### TODO 2: Identify the Task Type

| Task               | Go To                                                         |
| ------------------ | ------------------------------------------------------------- |
| Add a new tool     | [Creating Tools](#creating-tools)                             |
| Create a new agent | [Creating Agents](#creating-agents)                           |
| Modify chat UI     | [useChat Hook](#usechat-hook)                                 |
| Debug streaming    | [Debugging](#debugging)                                       |
| Need more docs     | [Browser Documentation Access](#browser-documentation-access) |

---

## Creating Tools

AI SDK tools are functions that the LLM can call. Each tool needs:

1. **description** - What the tool does (for the LLM)
2. **parameters** - Zod schema for input validation
3. **execute** - Async function that runs when called

### Tool Pattern

```typescript
import { tool } from "ai";
import { z } from "zod";

export const myTool = tool({
    description: "Clear description for the LLM of what this tool does",
    parameters: z.object({
        param1: z.string().describe("Description for LLM"),
        param2: z.number().optional(),
    }),
    execute: async ({ param1, param2 }) => {
        // Your implementation
        return { result: "data" };
    },
});
```

### Registering Tools

Add to `apps/web/src/lib/ai/tools/index.ts`:

```typescript
export { myTool } from "./my-tool";

// Add to relevant tool collection
export const curiosityTools = {
    suggestFollowUpQuestions,
    myTool, // Add here if for Curiosity mode
};
```

---

## Creating Agents

Agents in AI SDK v6 use the `Experimental_Agent` class:

### Agent Pattern

```typescript
import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { gemini } from "../../config";
import { myOptionsSchema } from "../types";
import { buildPrompt } from "./prompt";
import { myTool } from "../../tools";

const tools = {
    myTool,
};

export const myAgent = new Agent({
    model: gemini,
    callOptionsSchema: myOptionsSchema,

    prepareCall: ({ options, ...settings }) => ({
        ...settings,
        system: buildPrompt(options),
    }),

    tools,
    stopWhen: stepCountIs(10), // Max steps
});
```

### Agent Options Schema

Add to `apps/web/src/lib/ai/agents/types.ts`:

```typescript
export const myOptionsSchema = z.object({
    userId: z.string(),
    context: z.string().optional(),
});

export type MyOptions = z.infer<typeof myOptionsSchema>;
```

---

## useChat Hook

The `useChat` hook manages chat state in React:

```typescript
"use client";

import { useChat } from "@ai-sdk/react";

export function ChatComponent() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
    body: {
      mode: "curiosity",
      // Additional options
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <input
        value={input}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </form>
  );
}
```

---

## API Route Handler

The server-side route uses `streamText`:

```typescript
import { streamText } from "ai";
import { curiosityAgent } from "@/lib/ai/agents/curiosity";

export async function POST(req: Request) {
    const { messages, mode, ...options } = await req.json();

    const result = await streamText({
        model: curiosityAgent.model,
        system: curiosityAgent.prepareCall({ options }).system,
        messages,
        tools: curiosityAgent.tools,
    });

    return result.toDataStreamResponse();
}
```

---

## Browser Documentation Access

When you need information beyond this skill, use browser navigation:

### MANDATORY: Browse AI SDK Docs

```
1. Navigate to: https://ai-sdk.dev/docs
2. Use browser_snapshot to read content
3. Navigate to specific sections as needed:
   - https://ai-sdk.dev/docs/ai-sdk-core/overview
   - https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
   - https://ai-sdk.dev/docs/foundations/agents
```

### Key Documentation URLs

| Topic      | URL                                                     |
| ---------- | ------------------------------------------------------- |
| Overview   | https://ai-sdk.dev/docs/introduction                    |
| Agents     | https://ai-sdk.dev/docs/foundations/agents              |
| Tools      | https://ai-sdk.dev/docs/foundations/tools               |
| useChat    | https://ai-sdk.dev/docs/ai-sdk-ui/chatbot               |
| streamText | https://ai-sdk.dev/docs/ai-sdk-core/generating-text     |
| Providers  | https://ai-sdk.dev/docs/ai-sdk-core/provider-management |

### LLM-Optimized Docs

For comprehensive reference, navigate to:

```
https://ai-sdk.dev/llms.txt
```

This contains the full AI SDK documentation formatted for LLMs.

---

## Debugging

### Common Issues

| Issue                 | Solution                                                  |
| --------------------- | --------------------------------------------------------- |
| Tool not being called | Check tool description clarity, ensure tool is registered |
| Streaming not working | Verify `toDataStreamResponse()` is used                   |
| Type errors           | Ensure Zod schemas match expected types                   |
| Agent loops forever   | Add `stopWhen` condition                                  |

### Debug Pattern

1. Check browser console for client errors
2. Check server logs for API errors
3. Verify tool parameters match schema
4. Test tool execution in isolation

---

## Reference Files

**MANDATORY**: Read `reference/llms.txt` for comprehensive AI SDK documentation when implementing complex features.

---

## Key Principles

1. **Tools are for actions** - Use tools when the LLM needs to DO something
2. **Agents orchestrate tools** - Agents decide when and how to use tools
3. **Streaming is default** - Always use streaming for chat UX
4. **Type safety via Zod** - All inputs validated with Zod schemas
5. **Browser for latest docs** - Use browser navigation for up-to-date documentation
