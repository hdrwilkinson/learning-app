---
name: authentication
description: Auth.js patterns, sessions, OAuth, and credentials. Use when implementing authentication, session management, or OAuth providers. Triggers include "auth", "login", "session", "OAuth", "authentication".
---

# Authentication Skill

## Purpose & Context (WHY)

This skill covers authentication patterns using Auth.js (NextAuth.js v5). It provides patterns for session management, OAuth providers, and credential-based auth.

**When to use**: Implementing login/logout, protecting routes, managing sessions, adding OAuth providers.

**When to skip**: For authorization logic, see the `validation` skill for permission checking.

## Architecture

```
apps/web/src/
├── auth.ts              # Auth.js configuration
├── auth.config.ts       # Edge-compatible config
├── middleware.ts        # Route protection
└── app/
    ├── api/auth/[...nextauth]/route.ts  # Auth API
    └── actions/auth.ts  # Auth server actions
```

## Getting Session

### Server Side

```typescript
// In Server Components
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <div>Hello, {session.user.name}</div>;
}
```

### Client Side

```typescript
// In Client Components
'use client';

import { useSession } from 'next-auth/react';

export function Profile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Spinner />;
  if (!session) return <LoginButton />;

  return <div>Hello, {session.user.name}</div>;
}
```

### In Server Actions

```typescript
"use server";

import { auth } from "@/auth";

export async function updateProfile(formData: FormData) {
    const session = await auth();

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    // ... update logic
}
```

## Protected Routes

### Middleware Pattern

```typescript
// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (!isLoggedIn && !isAuthPage) {
        return Response.redirect(new URL("/auth/login", req.nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## OAuth Providers

### Adding a Provider

```typescript
// auth.ts
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
});
```

### Sign In Button

```typescript
import { signIn } from '@/auth';

export function SignInButton() {
  return (
    <form action={async () => {
      'use server';
      await signIn('github');
    }}>
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
```

## Session Callbacks

```typescript
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks: {
        session({ session, user }) {
            // Add user ID to session
            session.user.id = user.id;
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // Custom authorization logic
            return isLoggedIn;
        },
    },
});
```

## Type Extensions

```typescript
// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
```

## Resources

**This Skill**:

- `reference/auth-patterns.md` - Advanced auth patterns

**Related Skills**:

- `api-design` - Protected API routes
- `database` - User model and sessions

## Key Principle

Secure authentication with proper session handling.

---

_Skill established November 2025 for the Learning App (Cognia) project._
