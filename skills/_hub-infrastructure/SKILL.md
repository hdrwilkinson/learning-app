---
name: _hub-infrastructure
description: Infrastructure and DevOps skills hub. Routes to deployment and performance. Use when deploying to Vercel, configuring environments, or optimizing performance.
---

# Infrastructure Skills Hub

## Purpose

This hub helps you choose the right skill for infrastructure and DevOps tasks. It provides:

- **Decision tree**: Which skill do I need?
- **Cross-skill workflows**: Common multi-skill patterns
- **Category context**: Shared principles for deployment and operations

## Decision Tree

| If you need to...                      | Use this skill |
| -------------------------------------- | -------------- |
| Deploy to Vercel, configure env vars   | `deployment`   |
| Optimize bundle size, caching, loading | `performance`  |

## Sub-Skills in This Category

### deployment

**Use when**: Deploying to production, configuring environment, build issues

**Trigger phrases**: "deploy", "vercel", "environment variables", "production"

**Path**: `/skills/deployment/SKILL.md`

---

### performance

**Use when**: Improving performance, reducing bundle size, caching strategies

**Trigger phrases**: "performance", "optimize", "bundle size", "caching", "lazy load"

**Path**: `/skills/performance/SKILL.md`

---

## Cross-Skill Workflows

### Preparing for Production

When getting ready to deploy:

1. **performance**: Audit bundle size, enable optimizations
2. **deployment**: Configure environment variables, verify build

### Optimizing After Launch

When improving production performance:

1. **performance**: Measure Core Web Vitals
2. **deployment**: Configure caching headers
3. **performance**: Implement fixes based on metrics

### Debugging Production Issues

When production has problems:

1. **deployment**: Check logs, verify environment
2. **performance**: Check for performance regressions

## Category Principles

1. **Environment parity**: Dev should match production as closely as possible
2. **Secrets in env vars**: Never commit secrets, use Vercel environment variables
3. **Measure first**: Profile before optimizing
4. **Progressive enhancement**: Core functionality works without JS
5. **Reproducible builds**: Same code = same output

## Tech Stack Reference

- **Hosting**: Vercel
- **Database**: PostgreSQL (via connection pooling)
- **Build**: Turborepo + Next.js
- **Monitoring**: Vercel Analytics, Speed Insights
- **Caching**: Next.js built-in + Vercel Edge Cache

---

_Hub established November 2025 for the Learning App (Cognia) project._
