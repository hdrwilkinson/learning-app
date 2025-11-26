---
name: deployment
description: Vercel deployment, environment variables, and build optimization. Use when deploying to production, configuring environments, or troubleshooting builds. Triggers include "deploy", "vercel", "environment variables", "production".
---

# Deployment Skill

## Purpose & Context (WHY)

This skill covers deploying the application to Vercel, managing environment variables, and optimizing builds. Production deployment requires careful configuration to ensure security and performance.

**When to use**: Deploying changes, configuring environment variables, troubleshooting build issues.

**When to skip**: For local development issues, use the `debugging` skill.

## Vercel Configuration

### vercel.json

```json
{
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "installCommand": "npm install"
}
```

## Environment Variables

### Required Variables

| Variable       | Description                  | Example                   |
| -------------- | ---------------------------- | ------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...`        |
| `AUTH_SECRET`  | NextAuth.js secret           | Random 32+ chars          |
| `NEXTAUTH_URL` | App URL                      | `https://app.example.com` |

### Setting in Vercel

1. Go to Project Settings → Environment Variables
2. Add variable for each environment (Production, Preview, Development)
3. Variables with `NEXT_PUBLIC_` prefix are exposed to client

### Local Development

```bash
# .env.local (never commit!)
DATABASE_URL="postgresql://..."
AUTH_SECRET="dev-secret-at-least-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

## Build Process

### Local Build Test

```bash
# Test production build locally
npm run build
npm run start
```

### Common Build Errors

| Error              | Solution                              |
| ------------------ | ------------------------------------- |
| `Module not found` | Check import paths, run `npm install` |
| `Type error`       | Run `npx tsc --noEmit` to find issues |
| `Prisma error`     | Run `npx prisma generate`             |

### Prisma in Production

```bash
# Build command should include:
npx prisma generate && next build

# Or in package.json:
"build": "prisma generate && next build"
```

## Database Migrations

### Deploying Migrations

```bash
# Vercel runs this during deployment
npx prisma migrate deploy
```

### Connection Pooling

For serverless, use connection pooling:

```
DATABASE_URL="postgresql://...?connection_limit=1"
```

Consider Prisma Data Proxy or PgBouncer for high-traffic apps.

## Deployment Checklist

### Before Deploying

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations ready (`prisma migrate deploy`)
- [ ] No console.logs or debug code

### After Deploying

- [ ] Verify app loads correctly
- [ ] Test critical user flows
- [ ] Check Vercel logs for errors
- [ ] Monitor performance metrics

## Preview Deployments

Vercel creates preview deployments for each PR:

- URL pattern: `project-git-branch-username.vercel.app`
- Uses Preview environment variables
- Useful for testing before merge

## Rollback

If deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Resources

**This Skill**:

- `reference/vercel-patterns.md` - Advanced Vercel configuration

**Related Skills**:

- `database` - Database migrations
- `performance` - Build optimization

## Key Principle

Reproducible deployments with proper environment isolation.

---

_Skill established November 2025 for the Learning App (Cognia) project._
