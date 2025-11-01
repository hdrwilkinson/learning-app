import type { Config } from "jest";

const config: Config = {
    projects: [
        "<rootDir>/apps/web/jest.config.ts",
        "<rootDir>/packages/*/jest.config.ts",
    ],
    coverageProvider: "v8",
    collectCoverageFrom: [
        "apps/**/src/**/*.{ts,tsx}",
        "packages/**/src/**/*.{ts,tsx}",
        "!**/*.stories.tsx",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
};

export default config;
