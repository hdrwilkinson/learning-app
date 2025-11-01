# 🚀 Quick Start Guide

Your learning-app is fully set up! Here's how to get started:

## ✅ Setup Complete

All dependencies installed, monorepo configured, and ready to code!

## 🔧 Before First Run

### 1. Create Environment File

```bash
# Copy the example
cp env.example .env.local

# Generate a secure secret
openssl rand -base64 32

# Edit .env.local and update these values:
# - DATABASE_URL (your PostgreSQL connection)
# - NEXTAUTH_SECRET (paste the generated secret)
# - GOOGLE_API_KEY (get from https://ai.google.dev/ when needed)
```

### 2. Set Up PostgreSQL

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create the database
createdb learning_app_dev
```

### 3. Initialize Database

```bash
# Run Prisma migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

## 🎯 Start Development

```bash
# Start web app
npm run dev:web
# Opens at http://localhost:3000

# OR start mobile app
npm run dev:mobile
# Scan QR code with Expo Go app

# OR start both
npm run dev
```

## 📚 Additional Commands

```bash
# Component development with Storybook
npm run storybook              # http://localhost:6006

# Database management
npm run db:studio              # Visual database editor

# Testing
npm test                       # Run all tests
npm run test:e2e              # E2E tests

# Code quality
npm run lint                  # Lint all code
npm run format                # Format with Prettier
```

## 📦 What You Have

### Apps

- **Web** (`apps/web/`) - Next.js 15 with App Router
- **Mobile** (`apps/mobile/`) - Expo with React Native

### Shared Packages

- **@repo/ui** - UI components (Button, Text, Input)
- **@repo/screens** - Shared screens
- **@repo/theme** - Design tokens
- **@repo/api** - API layer & types
- **@repo/lib** - Utilities

### Features Configured

- ✅ Prisma ORM with comprehensive schema
- ✅ Auth.js with Google, GitHub, Credentials
- ✅ Cross-platform styling (Tailwind + NativeWind)
- ✅ Storybook for component development
- ✅ Jest + Playwright testing
- ✅ Pre-commit hooks (lint + format)
- ✅ Google Gemini AI ready (gemini-2.0-flash-exp)

## 🤖 AI Integration

Configured for **Google Gemini**:

- Model: `gemini-2.0-flash-exp` (cheapest, fastest)
- Alternative: `gemini-1.5-pro` (more capable)
- Get API key: https://ai.google.dev/

## 📖 More Info

See `SETUP_COMPLETE.md` for full documentation.

## 🆘 Need Help?

### Common Issues

**Port 3000 in use:**

```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection error:**

```bash
brew services restart postgresql@15
```

**Module not found:**

```bash
npm install --legacy-peer-deps
npm run db:generate
```

## 🎉 You're Ready!

1. Create `.env.local` from `env.example`
2. Set up PostgreSQL database
3. Run `npm run db:migrate`
4. Run `npm run dev:web`
5. Visit http://localhost:3000

Happy coding! 🚀
