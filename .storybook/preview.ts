import type { Preview } from '@storybook/react';
// Note: Update this path once you create apps/web/src/styles/globals.css
// import '../apps/web/src/styles/globals.css';
import { useThemeProviderDecorator } from './ThemeProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [useThemeProviderDecorator],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'split', icon: 'sidebar', title: 'Split View' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
