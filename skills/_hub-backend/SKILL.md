---
name: _hub-backend
description: Backend development skills hub. Routes to api-design, database, authentication, validation, and ai-sdk. Use when creating APIs, working with Prisma, implementing auth, validating data, or building AI/chat features.
---

# Backend Development Skills Hub

## Purpose

This hub helps you choose the right skill for backend development tasks. It provides:

- **Decision tree**: Which skill do I need?
- **Cross-skill workflows**: Common multi-skill patterns
- **Category context**: Shared principles for server-side development

## Decision Tree

| If you need to...                      | Use this skill   |
| -------------------------------------- | ---------------- |
| Create API endpoints or server actions | `api-design`     |
| Work with Prisma schema or queries     | `database`       |
| Implement login, sessions, OAuth       | `authentication` |
| Validate forms or API requests         | `validation`     |
| Build AI chat features or use AI SDK   | `ai-sdk`         |

## Sub-Skills in This Category

### api-design

**Use when**: Creating API endpoints, server actions, data fetching patterns

**Trigger phrases**: "API endpoint", "route handler", "server action", "REST API"

**Path**: `/skills/api-design/SKILL.md`

---

### database

**Use when**: Database operations, schema changes, complex queries

**Trigger phrases**: "prisma", "database", "migration", "schema", "query"

**Path**: `/skills/database/SKILL.md`

---

### authentication

**Use when**: Implementing auth, session management, OAuth providers

**Trigger phrases**: "auth", "login", "session", "OAuth", "authentication"

**Path**: `/skills/authentication/SKILL.md`

---

### validation

**Use when**: Input validation, form handling, API request validation

**Trigger phrases**: "validation", "zod", "form validation", "input validation"

**Path**: `/skills/validation/SKILL.md`

---

### ai-sdk

**Use when**: AI chat features, LLM integrations, AI agents and tools

**Trigger phrases**: "useChat", "streamText", "AI SDK", "chat", "LLM", "agent", "AI tools"

**Path**: `/skills/ai-sdk/SKILL.md`

**MANDATORY**: Load `skills/ai-sdk/reference/ai-sdk-docs.md` for code patterns

---

## Cross-Skill Workflows

### Creating a New API Endpoint

When building a new endpoint:

1. **database**: Add/update Prisma schema if needed
2. **validation**: Create Zod schemas for request/response
3. **api-design**: Implement route handler or server action
4. **authentication**: Add auth checks if required

### Adding a New Feature with Data

When adding a feature that persists data:

1. **database**: Design schema, create migration
2. **validation**: Define input/output schemas
3. **api-design**: Create CRUD endpoints
4. **authentication**: Protect routes appropriately

### Securing an Endpoint

When adding auth to existing endpoints:

1. **authentication**: Add session checks
2. **validation**: Validate user permissions
3. **api-design**: Return appropriate error responses

### Building AI Chat Features

When implementing AI-powered chat:

1. **ai-sdk**: Load reference docs, understand `useChat` and `streamText` patterns
2. **validation**: Create Zod schemas for tool parameters
3. **api-design**: Implement chat API route with `streamText`
4. **authentication**: Add auth checks to protect AI endpoints

## Category Principles

1. **Validate at boundaries**: Trust internal code, validate external input
2. **Schema-first**: Define Prisma schema and Zod schemas before implementation
3. **Server actions over API routes**: Prefer server actions for mutations
4. **Type safety**: Leverage Prisma + Zod for end-to-end type safety
5. **Error handling**: Return structured errors, never expose internals

## Tech Stack Reference

- **ORM**: Prisma with PostgreSQL
- **Validation**: Zod schemas
- **Authentication**: Auth.js (NextAuth.js v5)
- **API patterns**: Next.js App Router (route handlers + server actions)
- **Runtime**: Node.js (not Edge for Prisma operations)
- **AI/LLM**: AI SDK v6 (`@ai-sdk/react`, `@ai-sdk/openai`)

---

_Hub established November 2025 for the Learning App (Cognia) project._
