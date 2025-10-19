# Component Documentation Examples

This document provides examples of how to document different types of components in our Storybook. These templates should be followed when creating stories for components to ensure consistency across the design system.

## Atom Example: Button

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A versatile button component with multiple variants and sizes.
          
          ## Usage Guidelines
          - Use primary buttons for main actions
          - Use secondary buttons for alternative actions
          - Use outline buttons for less prominent actions
          
          ## Accessibility
          - Includes proper ARIA attributes
          - Supports keyboard navigation
          - Maintains sufficient color contrast in all variants
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { 
      control: 'select', 
      options: ['primary', 'secondary', 'outline'],
      description: 'Button style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the button when true',
      table: {
        defaultValue: { summary: false },
      },
    },
    isFullWidth: {
      control: 'boolean',
      description: 'Makes the button take full width of its container',
      table: {
        defaultValue: { summary: false },
      },
    },
    onClick: { 
      action: 'clicked',
      description: 'Function called when button is clicked',
      table: {
        category: 'Events',
      },
    },
    children: {
      description: 'Button content',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'medium',
    children: 'Outline Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    isFullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};
```

## Molecule Example: FormField

```tsx
// FormField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A form field component that combines a label, input, and optional error message.
          
          ## Composition
          This molecule is composed of the following atoms:
          - Label
          - Input (or other form control)
          - ErrorMessage (optional)
          
          ## Usage Guidelines
          - Always provide a meaningful label
          - Use error states to provide validation feedback
          - Consider using helper text for additional context
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the form field',
    },
    id: {
      control: 'text',
      description: 'Unique ID for the input and label relationship',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Type of input field',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    isRequired: {
      control: 'boolean',
      description: 'Marks the field as required',
      table: {
        defaultValue: { summary: false },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the input field',
      table: {
        defaultValue: { summary: false },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Function called when input value changes',
      table: {
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Username',
    id: 'username',
    type: 'text',
    placeholder: 'Enter your username',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    id: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    id: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    isRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Account Number',
    id: 'account',
    placeholder: 'Account number will be auto-generated',
    isDisabled: true,
  },
};
```

## Organism Example: CourseCard

```tsx
// CourseCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CourseCard } from './CourseCard';

const meta: Meta<typeof CourseCard> = {
  title: 'Organisms/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
          A course card component that displays information about a course, including title, description, progress, and actions.
          
          ## Composition
          This organism is composed of the following molecules and atoms:
          - Card (molecule)
          - Heading (atom)
          - Text (atom)
          - ProgressBar (molecule)
          - Button (atom)
          - Tag (atom)
          
          ## Usage Guidelines
          - Use as a preview for courses in listings and dashboards
          - Ensure the description is concise but informative
          - Always include progress information when the user has started the course
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Course title',
    },
    description: {
      control: 'text',
      description: 'Brief course description',
    },
    imageUrl: {
      control: 'text',
      description: 'URL for the course image',
    },
    author: {
      control: 'object',
      description: 'Course author information',
    },
    tags: {
      control: 'object',
      description: 'Array of tags for the course',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
    estimatedTime: {
      control: 'text',
      description: 'Estimated time to complete the course',
    },
    onContinue: {
      action: 'continue clicked',
      description: 'Function called when continue button is clicked',
    },
    onView: {
      action: 'view clicked',
      description: 'Function called when view details button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseCard>;

export const Default: Story = {
  args: {
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning with practical examples and hands-on exercises.',
    imageUrl: 'https://placehold.co/600x400',
    author: {
      name: 'Jane Smith',
      avatarUrl: 'https://placehold.co/150',
    },
    tags: ['AI', 'Machine Learning', 'Beginner'],
    estimatedTime: '4 hours',
  },
};

export const WithProgress: Story = {
  args: {
    ...Default.args,
    progress: 45,
  },
};

export const Completed: Story = {
  args: {
    ...Default.args,
    progress: 100,
  },
};

// You can add a story with multiple cards to show them in a grid
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard 
        title="Introduction to Machine Learning"
        description="Learn the fundamentals of machine learning with practical examples."
        imageUrl="https://placehold.co/600x400"
        author={{ name: 'Jane Smith', avatarUrl: 'https://placehold.co/150' }}
        tags={['AI', 'Machine Learning', 'Beginner']}
        progress={65}
        estimatedTime="4 hours"
      />
      <CourseCard 
        title="Advanced JavaScript Patterns"
        description="Master advanced JavaScript patterns and techniques for better code."
        imageUrl="https://placehold.co/600x400"
        author={{ name: 'John Doe', avatarUrl: 'https://placehold.co/150' }}
        tags={['JavaScript', 'Web Development', 'Advanced']}
        progress={25}
        estimatedTime="6 hours"
      />
      <CourseCard 
        title="Data Visualization with D3.js"
        description="Create powerful interactive data visualizations for the web."
        imageUrl="https://placehold.co/600x400"
        author={{ name: 'Alex Chen', avatarUrl: 'https://placehold.co/150' }}
        tags={['Data', 'Visualization', 'JavaScript']}
        estimatedTime="5 hours"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This example shows how course cards would appear in a responsive grid layout.',
      },
    },
  },
};
```

## Template Example: SettingsLayout

```tsx
// SettingsLayout.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsLayout } from './SettingsLayout';
import { ProfileSettings } from '../../organisms/settings/ProfileSettings';
import { AccountSettings } from '../../organisms/settings/AccountSettings';
import { AppearanceSettings } from '../../organisms/settings/AppearanceSettings';

const meta: Meta<typeof SettingsLayout> = {
  title: 'Templates/SettingsLayout',
  component: SettingsLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          A layout template for settings pages with a sidebar navigation and content area.
          
          ## Composition
          This template is composed of:
          - SettingsSidebar (organism)
          - PageHeader (molecule)
          - ContentContainer (atom)
          
          ## Usage Guidelines
          - Use for all settings-related pages
          - Place the main content in the children prop
          - Active navigation item should be highlighted based on current route
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title to display in the header',
    },
    description: {
      control: 'text',
      description: 'Page description below the title',
    },
    activeItem: {
      control: 'select',
      options: ['profile', 'account', 'appearance', 'notifications', 'billing'],
      description: 'Currently active navigation item',
    },
    children: {
      description: 'Main content of the settings page',
      control: { type: null },
    },
    breadcrumbs: {
      control: 'object',
      description: 'Breadcrumb items for navigation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsLayout>;

export const ProfilePage: Story = {
  args: {
    title: 'Profile Settings',
    description: 'Manage your personal information and profile details',
    activeItem: 'profile',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Profile', href: '/settings/profile' },
    ],
    children: <ProfileSettings />,
  },
};

export const AccountPage: Story = {
  args: {
    title: 'Account Settings',
    description: 'Manage your account and security preferences',
    activeItem: 'account',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Account', href: '/settings/account' },
    ],
    children: <AccountSettings />,
  },
};

export const AppearancePage: Story = {
  args: {
    title: 'Appearance Settings',
    description: 'Customize the look and feel of the application',
    activeItem: 'appearance',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Appearance', href: '/settings/appearance' },
    ],
    children: <AppearanceSettings />,
  },
};

export const Mobile: Story = {
  args: {
    ...ProfilePage.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
```

## Best Practices for Story Documentation

### 1. Component Description

Always include a detailed description of:
- The component's purpose
- When to use it
- Composition (for molecules, organisms, templates)
- Any special considerations

### 2. Props Documentation

For each prop:
- Provide a clear description
- Include type information
- Document default values
- Group related props together

### 3. Variants and States

Show all important variants:
- Different visual styles
- Size variations
- States (active, disabled, loading, error)
- Context-specific appearances

### 4. Accessibility

Document accessibility features:
- ARIA attributes used
- Keyboard navigation
- Color contrast considerations
- Screen reader support

### 5. Examples

Include examples of:
- Basic usage
- Common combinations
- Integration with other components
- Responsive behavior

### 6. Code Samples

For complex components, provide code samples of typical usage to help developers implement correctly.

```jsx
// Example of how to use the component
<CourseCard
  title="Introduction to React"
  description="Learn the fundamentals of React"
  progress={65}
  onContinue={() => navigate(`/courses/${courseId}`)}
/>
``` 