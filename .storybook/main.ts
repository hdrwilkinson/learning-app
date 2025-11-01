import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: [
        "../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../packages/screens/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-styling-webpack",
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    webpackFinal: async (config) => {
        // Add React Native Web aliases
        if (config.resolve) {
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                "react-native$": "react-native-web",
            };

            // Add file extensions
            config.resolve.extensions = [
                ".web.tsx",
                ".web.ts",
                ".web.jsx",
                ".web.js",
                ...(config.resolve.extensions || []),
            ];
        }

        return config;
    },
};

export default config;
