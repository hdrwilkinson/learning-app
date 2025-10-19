# Next Steps

## ✅ Completed
- ✅ Created new `learning-app` repo at v0.0.0
- ✅ Set up monorepo structure (Turborepo + npm workspaces)
- ✅ Copied and adapted all tooling from v3:
  - Jest (unit/integration testing)
  - Playwright (E2E testing)
  - Storybook (component documentation)
  - ESLint + Prettier
  - Husky pre-commit hooks
  - GitHub Actions CI/CD
- ✅ Pushed to GitHub: https://github.com/hdrwilkinson/learning-app

## 🚧 Required Next Steps

### 1. Install Dependencies
```bash
cd ~/Desktop/git/Harry/learning-app
npm install
```

### 2. Initialize Husky
```bash
npm run prepare
```

### 3. Create App Structures

#### Web App (`apps/web/`)
```bash
cd apps/web
npm init -y
# Install Next.js
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom
```

Create `apps/web/package.json`:
```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Create basic Next.js structure:
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/styles/globals.css`
- `apps/web/next.config.mjs`
- `apps/web/tsconfig.json`

#### Mobile App (`apps/mobile/`)
```bash
cd apps/mobile
npx create-expo-app@latest . --template blank-typescript
```

### 4. Create Packages

#### UI Package (`packages/ui/`)
```bash
mkdir -p packages/ui/src/{atoms,molecules,organisms,templates,providers}
```

Create `packages/ui/package.json`:
```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "test": "jest"
  }
}
```

#### Other Packages
Create similar structure for:
- `packages/screens/`
- `packages/theme/`
- `packages/api/`
- `packages/lib/`

### 5. Set Up Database
```bash
# Install Prisma client
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Create your schema in prisma/schema.prisma
# Run migrations
npx prisma migrate dev --name init
```

### 6. Set Up Auth.js
In `apps/web/`:
```bash
npm install next-auth @auth/core @auth/prisma-adapter
```

Create:
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `services/db/auth.ts`

### 7. Configure Environment Variables
Copy `.env.example` to `.env` and fill in:
- Database URL
- Auth secret
- OAuth credentials

### 8. Update Storybook
Once you have CSS in place, uncomment the import in `.storybook/preview.ts`:
```typescript
import '../apps/web/src/styles/globals.css';
```

### 9. Verify Setup
```bash
# Run linting
npm run lint

# Run tests (will pass with 0 tests)
npm test

# Start Storybook
npm run storybook

# Start web dev server (once Next.js is set up)
npm run dev:web
```

## 📚 Resources
- Turborepo: https://turbo.build/repo/docs
- Next.js: https://nextjs.org/docs
- Expo: https://docs.expo.dev/
- Prisma: https://www.prisma.io/docs
- Auth.js: https://authjs.dev/
- NativeWind: https://www.nativewind.dev/

## 🎯 Recommended Order
1. Install dependencies
2. Set up web app first (Next.js)
3. Create basic UI components in `packages/ui`
4. Set up Storybook stories
5. Set up database & Prisma
6. Set up authentication
7. Set up mobile app (Expo)
8. Create shared screens
9. Connect everything together

