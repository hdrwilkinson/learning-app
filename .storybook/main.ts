import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
    stories: [
        "../packages/screens/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../apps/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        {
            name: "@storybook/addon-styling-webpack",
            options: {
                rules: [
                    {
                        test: /\.css$/,
                        sideEffects: true,
                        use: [
                            require.resolve("style-loader"),
                            {
                                loader: require.resolve("css-loader"),
                                options: { importLoaders: 1 },
                            },
                            {
                                loader: require.resolve("postcss-loader"),
                                options: {
                                    implementation: require.resolve("postcss"),
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    webpackFinal: async (config) => {
        config.resolve = config.resolve || {};

        // 1. Add TsconfigPathsPlugin to resolve @repo/* aliases
        config.resolve.plugins = config.resolve.plugins || [];
        config.resolve.plugins.push(
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, "../tsconfig.json"),
            })
        );

        // 2. Add React Native Web aliases and @ alias for apps/web
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "@": path.resolve(__dirname, "../apps/web/src"),
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

        // 3. Explicitly handle TypeScript files with Babel
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];

        // Insert Babel loader at the beginning to ensure it processes files first
        config.module.rules.unshift({
            test: /\.(ts|tsx)$/,
            include: [
                path.resolve(__dirname, "../packages"),
                path.resolve(__dirname, "../apps/web"),
                path.resolve(__dirname, "../.storybook"),
            ],
            exclude: /node_modules/,
            use: [
                {
                    loader: require.resolve("babel-loader"),
                    options: {
                        presets: [
                            require.resolve("@babel/preset-env"),
                            require.resolve("@babel/preset-typescript"),
                            [
                                require.resolve("@babel/preset-react"),
                                {
                                    runtime: "automatic",
                                },
                            ],
                        ],
                    },
                },
            ],
        });

        return config;
    },
};

export default config;
