# Component Storyboarding Checklist

Use this checklist when creating or updating component stories to ensure comprehensive documentation and consistent implementation.

## Initial Setup

- [ ] **File Location**: Story file placed in the same directory as the component
- [ ] **Naming Convention**: Named `[ComponentName].stories.tsx`
- [ ] **Import Pattern**: Properly imports the component and required dependencies
- [ ] **Meta Object**: Includes properly configured Meta object
- [ ] **Title Structure**: Uses atomic category path (e.g., 'Atoms/Button')
- [ ] **Tags**: Includes 'autodocs' tag for automatic documentation generation

## Component Description

- [ ] **Purpose**: Clearly explains what the component does
- [ ] **Usage Guidelines**: Describes when and how to use the component
- [ ] **Composition** (for molecules+): Lists constituent components
- [ ] **Accessibility Features**: Documents a11y considerations
- [ ] **Related Components**: References alternatives or related components

## Props Documentation

- [ ] **Complete Coverage**: All props are documented
- [ ] **Descriptions**: Each prop has a clear, concise description
- [ ] **Default Values**: Default values are documented
- [ ] **Control Types**: Appropriate control types are set for each prop
- [ ] **Categories**: Props are categorized (e.g., appearance, behavior, content)
- [ ] **Required Props**: Required props are clearly marked
- [ ] **Type Information**: TypeScript types are visible in documentation

## Story Variants

- [ ] **Default Story**: Shows default component appearance
- [ ] **Size Variants**: If applicable, shows different size options
- [ ] **Style Variants**: Shows all visual style variations
- [ ] **State Variants**: Shows all states (normal, hover, active, disabled, etc.)
- [ ] **Content Variations**: Shows with different content scenarios
- [ ] **Edge Cases**: Includes stories for edge cases (very long text, empty states, etc.)
- [ ] **Responsive Behavior**: Demonstrates responsive adaptations if applicable

## Actions and Interactions

- [ ] **Events Documented**: All interactive events are documented
- [ ] **Actions Connected**: Events trigger appropriate Storybook actions
- [ ] **Interaction Tests**: Complex interactions have tests where appropriate
- [ ] **Hover/Focus States**: Interactive states are demonstrated

## Visual Presentation

- [ ] **Proper Layout**: Component is displayed with appropriate spacing
- [ ] **Multiple Instances**: Shows multiple instances where helpful
- [ ] **Realistic Content**: Uses realistic content rather than placeholder text
- [ ] **Appropriate Background**: Uses appropriate background for the component
- [ ] **Mobile/Desktop Views**: Shows in relevant viewport sizes

## Accessibility Testing

- [ ] **Contrast Checking**: Color contrast meets WCAG standards
- [ ] **Keyboard Navigation**: Keyboard navigation is documented and testable
- [ ] **Screen Reader Text**: Appropriate aria attributes and labels
- [ ] **A11y Add-on**: Storybook a11y add-on tests pass

## Code Examples

- [ ] **Basic Usage**: Shows simple implementation code
- [ ] **Complex Examples**: Provides code examples for complex scenarios
- [ ] **Import Statement**: Includes correct import statement example
- [ ] **Props Usage**: Demonstrates proper props usage

## Documentation Quality

- [ ] **Formatting**: Documentation is well-formatted with headings, lists, etc.
- [ ] **Grammar/Spelling**: Text is free of grammatical and spelling errors
- [ ] **Consistency**: Terminology is consistent with the rest of the design system
- [ ] **Completeness**: No missing information that would be needed to use the component

## Additional Considerations

### For Atoms

- [ ] **Focused Scope**: Focuses on single-purpose functionality
- [ ] **Reusability**: Demonstrates how the atom can be used in various contexts
- [ ] **Base Styling**: Documents base styling and customization options

### For Molecules

- [ ] **Composition**: Clearly documents which atoms are composed
- [ ] **Internal Logic**: Explains any internal state or logic
- [ ] **Integration**: Shows how to integrate with form state, contexts, etc.

### For Organisms

- [ ] **Complex Interactions**: Documents more complex interaction patterns
- [ ] **Data Flow**: Explains data flow within the organism
- [ ] **Customization**: Shows customization options
- [ ] **Real-world Usage**: Provides realistic usage scenarios

### For Templates

- [ ] **Page Structure**: Shows overall page structure
- [ ] **Layout Variations**: Demonstrates layout variations
- [ ] **Responsive Layouts**: Shows how layout adapts across breakpoints
- [ ] **Composition**: Shows how organisms fit into the template

## Final Checks

- [ ] **Verify in Browser**: View in Storybook to ensure correct rendering
- [ ] **Consistency Check**: Ensure consistency with similar components
- [ ] **Dark Mode**: Test in both light and dark mode if applicable
- [ ] **Responsive Testing**: Test at different viewport sizes
- [ ] **Performance**: Component doesn't cause performance issues in Storybook

## Implementation Notes

Any special notes about the component implementation:

```
[Add implementation notes here as necessary]
``` 