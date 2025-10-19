# Learning App v4

Cross-platform learning application built with Next.js (web) and Expo (mobile).

## Tech Stack

- **Monorepo**: Turborepo with npm workspaces
- **Web**: Next.js 15 with App Router, deployed on Vercel
- **Mobile**: Expo with React Native
- **UI**: Shared components with React Native primitives + NativeWind (web via react-native-web)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Auth.js (NextAuth)
- **Testing**: Jest (unit/integration), Playwright (E2E)
- **Documentation**: Storybook

## Structure

```
learning-app/
├── apps/
│   ├── web/          # Next.js web app
│   └── mobile/       # Expo React Native app
├── packages/
│   ├── ui/           # Shared UI components (atoms, molecules, organisms)
│   ├── screens/      # Feature screens (shared between platforms)
│   ├── theme/        # Design tokens and Tailwind config
│   ├── api/          # API client and types
│   └── lib/          # Shared utilities
├── prisma/           # Database schema and migrations
├── services/         # Server-side services (DB, auth)
└── e2e/              # End-to-end tests
```

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:migrate

# Run development servers
npm run dev              # All apps
npm run dev:web          # Web only
npm run dev:mobile       # Mobile only

# Run Storybook
npm run storybook

# Run tests
npm test                 # Unit tests
npm run test:e2e         # E2E tests
```

## Development

- **Code Quality**: ESLint + Prettier with pre-commit hooks
- **Type Safety**: TypeScript in strict mode
- **CI/CD**: GitHub Actions for linting, testing, and building

