# The Learning App

A GenAI-powered learning platform designed to help users master subjects through structured, personalized pathways.

## 🏗️ Architecture

This is a monorepo built with:

- **Turborepo** - Build system
- **Next.js** (App Router) - Web application
- **Expo** - Mobile application (iOS/Android)
- **React Native Web** - Cross-platform UI
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Auth.js** - Authentication
- **TailwindCSS + NativeWind** - Styling

## 📁 Project Structure

```
learning-app/
├── apps/
│   ├── web/              # Next.js web app
│   └── mobile/           # Expo mobile app
├── packages/
│   ├── ui/               # Shared UI components (atoms, molecules, organisms)
│   ├── screens/          # Shared screens for both platforms
│   ├── theme/            # Design tokens and Tailwind preset
│   ├── api/              # API contracts, types, and client
│   └── lib/              # Shared utilities and constants
├── services/
│   └── db/               # Database client and auth configuration
├── prisma/
│   └── schema.prisma     # Database schema
└── e2e/
    └── web/              # Playwright E2E tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hdrwilkinson/the-learning-app.git
cd the-learning-app
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Husky:

```bash
npm run prepare
```

4. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

5. Set up the database:

```bash
# Create a PostgreSQL database
createdb learning_app_dev

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### Development

Start all apps in development mode:

```bash
npm run dev
```

Or start individual apps:

```bash
# Web only
npm run dev:web

# Mobile only
npm run dev:mobile
```

Access the apps:

- Web: http://localhost:3000
- Mobile: Use Expo Go app and scan QR code
- Storybook: http://localhost:6006 (run `npm run storybook`)

### Database Management

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📚 Storybook

View and develop UI components in isolation:

```bash
npm run storybook
```

## 🎨 Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format
```

Pre-commit hooks automatically format and lint your code.

## 🏢 Core Features

### Learning Structure

- **Courses** - Top-level learning containers
- **Modules** - Course subdivisions
- **Lessons** - Individual learning units
- **Information Points** - Granular concepts/definitions

### Learning Modes

1. **Curiosity Mode** - Interactive chat-based learning with AI guidance
2. **Quiz Mode** - Test comprehension with varied question types
3. **Curiosity Zone** - Unstructured exploratory learning

### Progress Tracking

- Spaced repetition algorithm (SM-2 inspired)
- Performance-based review intervals
- Mastery status tracking
- Detailed analytics

## 📦 Package Overview

### `@repo/ui`

Shared UI components built on React Native primitives. Works on both web (via react-native-web) and mobile.

- Atoms: Button, Text, Input
- Molecules: (to be added)
- Organisms: (to be added)

### `@repo/screens`

Route-agnostic screen components that compose UI from `@repo/ui`.

### `@repo/theme`

Design tokens and Tailwind configuration shared across platforms.

### `@repo/api`

- Zod schemas for validation
- TypeScript types
- API client helpers

### `@repo/lib`

Shared utilities, formatters, and constants.

## 🔐 Authentication

This app uses Auth.js (NextAuth.js v5) with:

- Database sessions (via Prisma)
- Multiple providers (Google, GitHub, Credentials)
- Server-side session management

## 🌐 Deployment

### Web (Vercel)

```bash
npm run build
```

### Mobile

```bash
cd apps/mobile
npm run build:ios    # iOS
npm run build:android # Android
```

## 📝 License

Private - All rights reserved

## 👥 Contributors

- Harry Wilkinson (@hdrwilkinson)
