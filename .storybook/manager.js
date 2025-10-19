import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

// Use the getPreferredColorScheme function to adapt Storybook UI to user's system preference
const getPreferredColorScheme = () => {
    if (!globalThis || !globalThis.matchMedia) return 'light';

    const isDarkThemePreferred = globalThis.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;

    return isDarkThemePreferred ? 'dark' : 'light';
};

// Set the Storybook UI theme based on system preference
addons.setConfig({
    theme: getPreferredColorScheme() === 'dark' ? themes.dark : themes.light,
}); 