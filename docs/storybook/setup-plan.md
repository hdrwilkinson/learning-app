# Storybook Setup Plan

## Overview

This document outlines the plan for setting up and configuring Storybook as our visual documentation tool for components. Storybook will provide an isolated environment for developing, testing, and showcasing our UI components.

## Installation and Setup

### Step 1: Install Storybook

```bash
# Install Storybook with Next.js setup
npx storybook@latest init
```

This will:
- Install necessary dependencies
- Create basic configuration files
- Add NPM scripts for Storybook

### Step 2: Configure Tailwind CSS

Add Tailwind CSS support to ensure components render with the correct styles:

1. Update `.storybook/preview.js` to import our Tailwind CSS:

```js
import '../src/app/globals.css'; // Adjust path as needed to include global CSS

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

2. Configure `.storybook/main.js` to handle Tailwind CSS:

```js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
```

### Step 3: Configure Theme Provider

Set up theme provider to support light/dark mode in Storybook:

1. Create `.storybook/ThemeProvider.tsx` decorator:

```tsx
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export const withThemeProvider = (Story, context) => {
  const [mounted, setMounted] = useState(false);
  
  // Ensure theme is only applied after component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = context.globals.theme;
  
  return (
    <ThemeProvider forcedTheme={theme || undefined} attribute="class">
      {mounted && <Story {...context} />}
    </ThemeProvider>
  );
};
```

2. Update `.storybook/preview.js` to use the theme provider:

```js
import { withThemeProvider } from './ThemeProvider';

export const decorators = [withThemeProvider];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'sun', title: 'Light' },
        { value: 'dark', icon: 'moon', title: 'Dark' },
      ],
      showName: true,
    },
  },
};
```

## Organization Strategy

Organize stories by component atomic level and functional category:

```
src/
└── components/
    ├── atoms/
    │   ├── button/
    │   │   ├── Button.tsx
    │   │   ├── Button.stories.tsx
    │   │   └── ...
    │   └── ...
    ├── molecules/
    ├── organisms/
    └── templates/
```

## Story Writing Guidelines

### Basic Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { 
      control: 'select', 
      options: ['primary', 'secondary', 'outline'],
      description: 'Button style variant'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size'
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

### Story Documentation

Include in each story file:

1. **Component Description**: Brief explanation of the component's purpose
2. **Props Documentation**: Description of all props and their usage
3. **Variants**: Display all component variants with different props
4. **Usage Examples**: Common usage patterns
5. **Accessibility Notes**: Any accessibility considerations

## Implementation Plan

1. **Phase 1: Basic Setup**
   - Install and configure Storybook
   - Set up theme provider and styling
   - Create initial documentation pages

2. **Phase 2: Core Component Stories**
   - Create stories for all atomic components (atoms)
   - Document primary UI components thoroughly
   
3. **Phase 3: Compound Component Stories**
   - Add stories for molecules and organisms
   - Document component composition patterns

4. **Phase 4: Template and Page Stories**
   - Document page layouts and templates
   - Create stories with realistic data

## Integration with Component Development

Adopt a "story-first" development approach:

1. Create component requirements
2. Write story with props and variants
3. Implement component to satisfy story
4. Use story for visual testing and review

## Additional Addons to Consider

- `@storybook/addon-a11y`: Accessibility testing
- `@storybook/addon-viewport`: Responsive testing
- `@storybook/addon-controls`: Enhanced props controls
- `@storybook/addon-docs`: Documentation generation

## NPM Scripts

Add the following scripts to package.json:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook"
  }
}
``` 