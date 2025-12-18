# AI SDK v6 Reference Documentation

> Source: https://ai-sdk.dev/llms.txt (comprehensive LLM documentation)

## Overview

AI SDK is a TypeScript toolkit for building AI-powered applications with LLMs. It provides:

- **AI SDK Core**: Low-level functions for text generation, structured data, tool calls
- **AI SDK UI**: Framework-agnostic hooks for building chat interfaces
- **AI SDK RSC**: Stream React Server Components from LLMs

## AI SDK Core

### `generateText`

Generate text and tool calls from an LLM.

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text, toolCalls, toolResults, usage, steps } = await generateText({
    model: openai("gpt-4o"),
    prompt: "What is the weather in San Francisco?",
    tools: {
        weather: {
            description: "Get the weather in a location",
            parameters: z.object({
                location: z
                    .string()
                    .describe("The location to get the weather for"),
            }),
            execute: async ({ location }) => ({
                location,
                temperature: 72 + Math.floor(Math.random() * 21) - 10,
            }),
        },
    },
    maxSteps: 5, // Enable multi-step tool use
});
```

### `streamText`

Stream text and tool calls from an LLM. Essential for chatbots.

```typescript
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = streamText({
    model: openai("gpt-4o"),
    prompt: "Write a poem about nature",
    onChunk: ({ chunk }) => {
        // Handle each chunk
    },
    onFinish: ({ text, usage }) => {
        // Handle completion
    },
});

// Stream as text
for await (const textPart of result.textStream) {
    console.log(textPart);
}

// Or convert to response for API routes
return result.toDataStreamResponse();
```

### `generateObject`

Generate structured JSON from an LLM using Zod schemas.

```typescript
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
        recipe: z.object({
            name: z.string(),
            ingredients: z.array(
                z.object({
                    name: z.string(),
                    amount: z.string(),
                })
            ),
            steps: z.array(z.string()),
        }),
    }),
    prompt: "Generate a lasagna recipe.",
});
```

## AI SDK UI

### `useChat` Hook

React hook for building chat interfaces with streaming support.

```typescript
'use client';

import { useChat } from '@ai-sdk/react';

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setMessages,
  } = useChat({
    api: '/api/chat', // Default endpoint
    initialMessages: [],
    onFinish: (message) => {
      console.log('Message complete:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### API Route Handler

```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-4o"),
        messages,
        system: "You are a helpful assistant.",
    });

    return result.toDataStreamResponse();
}
```

### `useCompletion` Hook

For single-turn text completion (non-chat).

```typescript
import { useCompletion } from '@ai-sdk/react';

export function Completion() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: '/api/completion',
    });

  return (
    <div>
      <p>{completion}</p>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
```

## Tools

Tools allow LLMs to perform actions and retrieve information.

### Tool Definition

```typescript
import { tool } from "ai";
import { z } from "zod";

const weatherTool = tool({
    description: "Get the weather in a location",
    parameters: z.object({
        location: z.string().describe("The location to get weather for"),
        unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius"),
    }),
    execute: async ({ location, unit }) => {
        // Call external API or perform action
        const weather = await fetchWeather(location, unit);
        return weather;
    },
});
```

### Using Tools with `streamText`

```typescript
import { streamText, tool } from "ai";

const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
        weather: weatherTool,
        search: searchTool,
    },
    maxSteps: 5, // Allow multi-step tool usage
});
```

### Tool Results in Messages

```typescript
// Handle tool calls in streaming
for await (const part of result.fullStream) {
    if (part.type === "tool-call") {
        console.log("Tool called:", part.toolName, part.args);
    }
    if (part.type === "tool-result") {
        console.log("Tool result:", part.result);
    }
}
```

## Agents

Agents are LLMs that use tools in a loop to accomplish tasks.

### Agent Pattern

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

async function runAgent(task: string) {
    let currentContext = task;
    let steps = 0;
    const maxSteps = 10;

    while (steps < maxSteps) {
        const { text, toolCalls, finishReason } = await generateText({
            model: openai("gpt-4o"),
            system: "You are an agent that completes tasks using tools.",
            prompt: currentContext,
            tools: {
                // Define your tools
            },
            maxSteps: 1, // Single step at a time for control
        });

        if (finishReason === "stop" || toolCalls.length === 0) {
            return text; // Task complete
        }

        // Process tool results and continue
        currentContext = `Previous result: ${text}\nContinue the task.`;
        steps++;
    }

    return "Max steps reached";
}
```

### Built-in Multi-Step Support

```typescript
const { text, steps } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Research and summarize recent AI news",
    tools: { search, summarize },
    maxSteps: 5, // Automatically handles multi-step
    onStepFinish: ({ text, toolCalls, toolResults }) => {
        console.log("Step completed:", { text, toolCalls, toolResults });
    },
});

console.log("Final result:", text);
console.log("Total steps:", steps.length);
```

## Providers

### OpenAI

```typescript
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o");
const embeddingModel = openai.embedding("text-embedding-3-small");
```

### Anthropic

```typescript
import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-sonnet-4-20250514");
```

### Google

```typescript
import { google } from "@ai-sdk/google";

const model = google("gemini-1.5-pro");
```

## Streaming Patterns

### Data Stream Response (Recommended for Chat)

```typescript
// Route handler
export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-4o"),
        messages,
    });

    return result.toDataStreamResponse();
}
```

### Text Stream Response

```typescript
return result.toTextStreamResponse();
```

### Custom Stream Handling

```typescript
const result = streamText({
    model: openai("gpt-4o"),
    messages,
});

// Access different stream types
result.textStream; // AsyncIterable<string>
result.fullStream; // AsyncIterable with all events
result.toDataStream(); // ReadableStream for responses
```

## Error Handling

```typescript
import { APICallError, RetryError } from "ai";

try {
    const result = await generateText({
        model: openai("gpt-4o"),
        prompt: "Hello",
    });
} catch (error) {
    if (error instanceof APICallError) {
        console.error("API Error:", error.message, error.statusCode);
    } else if (error instanceof RetryError) {
        console.error("Retry failed:", error.lastError);
    }
}
```

## Best Practices

1. **Use `streamText` for chat**: Always stream responses for better UX
2. **Define clear tool descriptions**: LLMs use descriptions to decide when to use tools
3. **Use Zod for parameters**: Type-safe parameter validation
4. **Set `maxSteps`**: Prevent infinite loops with multi-step tools
5. **Handle errors gracefully**: Implement proper error boundaries
6. **Use system prompts**: Guide model behavior consistently
7. **Cache expensive operations**: Use `experimental_telemetry` for monitoring

## Common Patterns

### Chat with Tools

```typescript
// API Route
export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-4o"),
        system: "You are a helpful assistant with access to tools.",
        messages,
        tools: {
            getWeather: weatherTool,
            searchWeb: searchTool,
        },
        maxSteps: 3,
    });

    return result.toDataStreamResponse();
}
```

### RAG Pattern

```typescript
const result = await generateText({
    model: openai("gpt-4o"),
    system: `Answer based on context:\n${relevantDocuments.join("\n")}`,
    prompt: userQuestion,
});
```

## Key URLs

- Documentation: https://ai-sdk.dev/docs/introduction
- AI SDK UI (Chat): https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- Tools: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
- Agents: https://ai-sdk.dev/docs/agents/overview
- Providers: https://ai-sdk.dev/docs/ai-sdk-providers
