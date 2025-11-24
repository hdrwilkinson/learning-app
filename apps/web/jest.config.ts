import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
    coverageProvider: "v8" as const,
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/../../jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.tsx",
        "!src/**/__tests__/**",
    ],
    transformIgnorePatterns: [
        "/node_modules/(?!next-auth|@auth/core|@react-aria|@react-stately|@react-types|lucide-react)",
    ],
} satisfies Config;

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
