import type { StorybookConfig } from "@storybook/react-webpack5";
import path from 'path';

const config: StorybookConfig = {
  stories: [
    "../packages/ui/src/**/*.mdx",
    "../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../apps/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        postCss: {
          implementation: require.resolve('postcss'),
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@repo/ui': path.resolve(__dirname, '../packages/ui/src'),
        '@repo/theme': path.resolve(__dirname, '../packages/theme'),
        '@repo/lib': path.resolve(__dirname, '../packages/lib'),
      };
    }
    return config;
  },
};

export default config;
