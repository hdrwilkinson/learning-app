import type { Decorator } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { SplitViewDecorator } from './SplitViewDecorator';

export const useThemeProviderDecorator: Decorator = (Story, context) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a simple placeholder consistent with what SplitViewDecorator would render if !mounted
        return (
            <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                <div style={{ flex: 1 }}></div>
                <div style={{ flex: 1 }}></div>
            </div>
        );
    }

    const theme = context.globals.theme;

    if (theme === 'split') {
        // SplitViewDecorator is now hook-free and relies on this decorator's mounted state.
        return SplitViewDecorator(Story, context);
    }

    // Single theme mode - using data-theme for consistency with SplitViewDecorator
    return (
        <ThemeProvider forcedTheme={theme} attribute="data-theme" enableSystem={false}>
            <div
                data-theme={theme}
                style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    borderRadius: '0.5rem',
                }}
            >
                {Story(context)}
            </div>
        </ThemeProvider>
    );
}; 